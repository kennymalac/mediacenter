from __future__ import unicode_literals

from datetime import datetime

from django.conf import settings
from django.contrib.postgres.fields import JSONField, ArrayField
from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver
from django.db import models
from django.contrib.auth.models import AbstractUser

from django_countries.fields import CountryField
from guardian.mixins import GuardianUserMixin

import api.managers
from api.pubsub import ALL_ACTIONS

# Create your models here.
class Account(AbstractUser, GuardianUserMixin):
    country = CountryField(null=True)
    email = models.EmailField()
    # Persist a hash of the user's UI display settings
    # Default settings are assigned on account creation
    profile = models.OneToOneField('api.Profile', null=True, on_delete=models.CASCADE)
    friends = models.ManyToManyField('self', blank=True)

    account_settings = JSONField(null=True, blank=True)
    REQUIRED_FIELDS = ['display_name', 'email', 'password']
    accounts = api.managers.AccountManager

    class Meta:
        verbose_name = 'account'
        verbose_name_plural = 'accounts'
        abstract = False

    def change_profile_details(self, details):
        '''Changes user account profile settings with provided details.'''
        self.profile_details = details
        # TODO profile modification privilege check
        # if details and self.has_perm('change_account'):
        #     # self.profile.modify(details)
        #     pass

    def change_account_settings(self, settings):
        self.account_settings = settings


@receiver(post_delete, sender=Account)
def pre_delete_user(sender, **kwargs):
    instance = kwargs.get('instance')

    if instance.profile:
        instance.profile.delete()


class ActivityLog(models.Model):
    """
    Every log has a representation as a resource.
    A media log will be pulled from an activity log and the UI will infer how to display the log by information passed into the log through its association with the media.
    """

    action = models.CharField(max_length=8, choices=ALL_ACTIONS)
    message = models.CharField(max_length=255)
    context = JSONField(blank=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, blank=True, related_name="logs")
    subscribed = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name="+")


class BlogPost(models.Model):
    slug = models.SlugField()
    title = models.CharField(max_length=100)
    authors = models.ManyToManyField(Account)
    body = models.TextField()
    objects = api.managers.BlogPostManager()

    def has_change_permission(self, user):
        if user.id in self.authors:
            return True
        else:
            return False


#class Collage
USER_ACCESS_LEVELS = (
    ('0', "GUEST"),
    ('1', "USER"),
    ('4', "FRIEND"),
    ('5', "MODERATOR"),
    ('9', "ADMIN")
)

class Album(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    owner = models.ForeignKey(Account)
    access_level = models.CharField(
        max_length=1,
        choices=USER_ACCESS_LEVELS
    )
    unlisted = models.BooleanField(default=False)
    tags = models.ManyToManyField("AlbumTag")


class AlbumTag(models.Model):
    name = models.CharField(max_length=42)


class MediaTag(models.Model):
    name = models.CharField(max_length=42)
    #


class FeedContentItemType(models.Model):
    IMAGE = 'img'
    VIDEO = 'vid'
    LINK = 'link'
    BLOGPOST = 'blgpst'
    TOPIC = 'topic'
    POST = 'post'
    # TODO reverse the order here, LOL!
    CONTENT_TYPES = (
        ('image', IMAGE),
        ('video', VIDEO),
        ('link', LINK),
        ('topic', TOPIC),
        ('post', POST),
        ('blogpost', BLOGPOST),
    )
    name = models.CharField(max_length=6, choices=CONTENT_TYPES)

    def __str__(self):
        return self.name


class ContentTag(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        abstract = True


class Interest(ContentTag):
    parents = models.ManyToManyField('self')
    children = models.ManyToManyField('self')
    # Art, Computers, Design > Digital Art > Anime


class TaggedItem(models.Model):
    # Associated tags
    interests = models.ManyToManyField(Interest, blank=True)
    # places = models.ManyToManyField(Place)
    # people (people without accounts most likely)
    # organizations
    # 

    class Meta:
        abstract = True


class Profile(TaggedItem):
    display_name = models.CharField(max_length=60, blank=True)
    title = models.CharField(max_length=140, default="Welcome to my profile!")
    description = models.TextField(blank=True)
    picture = models.URLField(blank=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.display_name

VISIBILITY = (
    ('0', 'Public'),
    ('1', 'Unlisted'),
    # ('2', 'Friends')
    ('9', 'Private')
)

class Feed(TaggedItem):
    owner = models.ForeignKey(Account, null=True)
    name = models.CharField(max_length=140, blank=True)
    description = models.TextField(blank=True)
    content_types = models.ManyToManyField(FeedContentItemType, related_name='+')
    created = models.DateTimeField(auto_now_add=True)
    stashes = models.ManyToManyField('api.FeedContentStash', related_name='feeds')

    visibility = models.CharField(max_length=2, choices=VISIBILITY, default='0')

    def __str__(self):
        return self.name


class FeedContentItem(TaggedItem):
    origin_stash = models.ForeignKey('api.FeedContentStash', null=True, related_name="owned_content")
    owner = models.ForeignKey(Account, blank=True)
    is_anonymous = models.BooleanField(default=False)
    content_type = models.ForeignKey(FeedContentItemType, related_name="+")
    title = models.CharField(max_length=140, blank=True)
    description = models.TextField(blank=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Comment(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(Account, blank=True)
    content_item = models.ForeignKey(FeedContentItem, related_name="comments", null=True)
    user_profile = models.ForeignKey(Profile, related_name="comments", null=True)
    is_anonymous = models.BooleanField(default=False)
    parent = models.ForeignKey('self', null=True)
    text = models.TextField(blank=True)


class FeedContentStash(models.Model):
    # TODO "sticky" content - maybe add order?
    name = models.CharField(max_length=140, blank=True)
    description = models.TextField(blank=True)
    max_content = models.IntegerField(default=1000)
    content = models.ManyToManyField(FeedContentItem, related_name="+")
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


def setup_default_feed(user):
    feed = Feed.objects.create(name="My Feed", description="All of your uploads outside of groups", owner=user)
    stash = FeedContentStash.objects.create(name="My Content", description="Anything you upload my default will be stored here")
    feed.content_types.add(*list(FeedContentItemType.objects.all()))
    feed.stashes.add(stash)


class Discussion(models.Model):
    content_item = models.ForeignKey(FeedContentItem, related_name="+")
    parent = models.ForeignKey('self', null=True)
    order = models.IntegerField(default=0)
    text = models.TextField(blank=True)
    text_last_edited = models.DateTimeField(null=True)

@receiver(post_delete, sender=Discussion)
def pre_delete_discussion(sender, **kwargs):
    instance = kwargs.get('instance')
    instance.content_item.delete()

@receiver(pre_save, sender=Discussion)
def change_text_last_edited(sender, instance, **kwargs):
    old = sender.objects.filter(pk=instance.pk)
    if old.count() != 0:
        old_text = old.values_list('text', flat=True)[0]
        if old_text != instance.text:
            instance.text_last_edited = datetime.now()


class Link(models.Model):
    content_item = models.ForeignKey(FeedContentItem, related_name="+")
    link = models.URLField()


@receiver(post_delete, sender=Link)
def pre_delete_link(sender, **kwargs):
    instance = kwargs.get('instance')
    if instance.content_item:
        instance.content_item.delete()


# class ContentShare(models.Model):
#     pass

class GroupForum(models.Model):
    owner = models.ForeignKey(Account, related_name="owned_groups")
    name = models.CharField(max_length=140, blank=True)
    description = models.TextField(blank=True)
    rules = ArrayField(
        models.TextField(blank=True),
        default=[]
    )
    # interests = models.ManyToManyField(Interest, related_name='+')
    feed = models.ForeignKey(Feed)
    image = models.URLField(blank=True)
    is_restricted = models.BooleanField(default=False)
    # TODO various options, i.e. moderators can invite, only owner can invite, etc.
    # invite_policy = models.CharField()
    members = models.ManyToManyField(Account, 'member_groups')


class Media(models.Model):
    album = models.ForeignKey(Album, blank=True)
    title = models.CharField(max_length=140, blank=True)
    description = models.TextField(blank=True)
    hidden = models.BooleanField(default=False)
    tags = models.ManyToManyField("MediaTag", blank=True)
