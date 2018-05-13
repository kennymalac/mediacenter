from __future__ import unicode_literals

from django.conf import settings
from django.contrib.postgres.fields import JSONField, ArrayField
from django.db import models
from django.contrib.auth.models import AbstractUser

from django_countries.fields import CountryField
from guardian.mixins import GuardianUserMixin

import api.managers

# Create your models here.

class Account(AbstractUser, GuardianUserMixin):
    country = CountryField()
    email = models.EmailField()
    # Persist a hash of the user's UI display settings
    # Default settings are assigned on account creation
    profile = models.OneToOneField('api.Profile', null=True)
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


class Log(models.Model):
    """
    Every log has a representation as a resource.
    A media log will be pulled from an activity log and the UI will infer how to display the log by information passed into the log through its association with the media.
    """
    message = models.CharField(max_length=255)


class ActivityLog(models.Model):
    title = models.CharField(max_length=100)
    authors = models.ManyToManyField(settings.AUTH_USER_MODEL)
    logs = models.ManyToManyField(Log)


class BlogPost(models.Model):
    log = models.ForeignKey(Log)
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


mediaChoices = (
    ('P', "PHOTO"),
    ('V', "VIDEO"),
    # ('W', "PHOTO EMBED")
)


class FeedContentItemType(models.Model):
    IMAGE = 'img'
    VIDEO = 'vid'
    LINK = 'link'
    BLOGPOST = 'blgpst'
    TOPIC = 'topic'
    POST = 'post'
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
    # created = models.DateTimeField(auto_now_add=True)


class Feed(TaggedItem):
    owner = models.ForeignKey(Account, null=True)
    name = models.CharField(max_length=140, blank=True)
    description = models.TextField(blank=True)
    content_types = models.ManyToManyField(FeedContentItemType, related_name='+')
    content = models.ManyToManyField('api.FeedContentItem', related_name='feeds')
    created = models.DateTimeField(auto_now_add=True)


class FeedContentItem(TaggedItem):
    owner = models.ForeignKey(Account, blank=True)
    content_type = models.ForeignKey(FeedContentItemType, related_name="+")
    title = models.CharField(max_length=140, blank=True)
    description = models.TextField(blank=True)
    created = models.DateTimeField(auto_now_add=True)


class Discussion(models.Model):
    content_item = models.ForeignKey(FeedContentItem, related_name="+")
    parent = models.ForeignKey('self', null=True)
    order = models.IntegerField(default=0)
    text = models.TextField(blank=True)


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
    members = models.ManyToManyField(Account)


class Media(models.Model):
    album = models.ForeignKey(Album, blank=True)
    title = models.CharField(max_length=140, blank=True)
    description = models.TextField(blank=True)
    hidden = models.BooleanField(default=False)
    tags = models.ManyToManyField("MediaTag", blank=True)
    media_type = models.CharField(
        max_length=2,
        choices=mediaChoices
    )
    # TODO configure this
    # content_id = models.CharField(max_length=255)

    # permissions = models.JSONField()

    # def can_change(self, user):
    # 
    #     if user
