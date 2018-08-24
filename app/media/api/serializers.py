from bleach.sanitizer import Cleaner
from django.utils.translation import ugettext_lazy as _
from django.db.models import Max, Q
from django.conf import settings
from api.paginators import *
from django_countries.serializers import CountryFieldMixin
from rest_framework import serializers
from rest_framework.pagination import PageNumberPagination

from api.models import *


class BasicProfileSerializer(serializers.ModelSerializer):
    account = serializers.PrimaryKeyRelatedField(
        queryset=Account.objects.all(),
        required=False
    )

    class Meta:
        model = Profile
        fields = ('id', 'display_name', 'picture', 'account')


class GroupForumBasicSerializer(serializers.ModelSerializer):

    class Meta:
        model = GroupForum
        fields = ('id', 'name', 'image')


class GroupForumField(serializers.RelatedField):
    def get_queryset(self):
        request = self.context.get('request', None)
        allowed_places = self.context.get('allowed_places', None)
        user = request.user if request and request.user else None

        return super(GroupForumField, self).get_queryset().\
            viewable_groups(user=user, allowed_places=allowed_places)

    def to_representation(self, obj):
        return dict(id=obj.id, name=obj.name, image=obj.image)

    def to_native(self, value):
        serialized = {}
        for k in GroupForumBasicSerializer.fields:
            serialized[k] = getattr(value, k)

        return serialized


class AccountBasicSerializer(serializers.ModelSerializer):
    profile = BasicProfileSerializer()

    class Meta:
        model = Account
        fields = ('id', 'profile')

    def to_representation(self, obj):
        if self.context.get('is_anonymous', False):
            return {
                'id': -1,
                'username': 'Anonymous',
                'country': '',
                'email': ''
            }

        return super(AccountBasicSerializer, self).to_representation(obj)


class AccountSerializer(CountryFieldMixin, AccountBasicSerializer):
    profile = BasicProfileSerializer()

    member_groups = GroupForumField(
        many=True,
        read_only=True
    )

    class Meta:
        model = Account
        fields = ('id', 'username', 'country', 'email', 'profile', 'friends', 'member_groups')


class FullAccountSerializer(AccountSerializer):
    """Requires full account view permissions (i.e. admin or current user privilege levels) UNLESS it is from a CREATE request."""
    account_settings = serializers.JSONField(read_only=False)

    def create(self, validated_data):
        invite_code = self.context['request'].data.get('invite_code')

        profile_data = {}
        if 'profile' in validated_data:
            profile_data = validated_data.pop('profile')

        password = validated_data.pop('password')
        account = Account.objects.create(**validated_data)
        account.set_password(password)

        invite_code.invitees.add(account)
        invite_code.uses += 1
        invite_code.save()

        profile = Profile.objects.create(**profile_data, account=account)
        account.profile = profile

        plan = Plan.objects.get(name='free')
        account.plan = plan

        account.save()

        return account

    class Meta:
        model = Account
        fields = ('id', 'username', 'email', 'password', 'country', 'account_settings', 'profile')


class PrivateAccountProfileDetailsSerializer(serializers.ModelSerializer):
    account_settings = serializers.JSONField(read_only=False)
    profile = BasicProfileSerializer()

    class Meta:
        model = Account
        fields = ('id', 'account_settings', 'profile', 'member_groups')


class LogSerializer(serializers.Serializer):
    created = serializers.DateTimeField()
    last_modified = serializers.DateTimeField()
    message = serializers.CharField(max_length=400, allow_blank=True)


class ActivityLogSerializer(serializers.ModelSerializer):
    action = serializers.CharField(source='get_action_display')

    class Meta:
        model = ActivityLog
        fields = ('id', 'action', 'message', 'context', 'author')


class BlogPostSerializer(serializers.Serializer):
    title = serializers.CharField()
    slug = models.SlugField()
    # TODO create authors field validator
    authors = serializers.ListField(
        child=serializers.CharField()
    )
    body = serializers.CharField()


# class MediaSrcHyperlinkedField(serializers.HyperlinkedIdentityField):
#     def to_representation(self, data):
#         pass

#     def to_internal_value(self, data):
#         return

#     def get_url(self, obj, view_name, request, format):
#         return 'https:/i.imgur.com/5EMmiqE.png'
#         # TODO do I need the album primary key here?
#         # url_kwargs = {
#         #     'album_pk': obj.pk,
#         #     'media_pk': obj.pk
#         # }
#         # return reverse()

#     def get_object():
#         pass


class MediaListSerializer(serializers.ListSerializer):
    def create(self, validated_data):
        # Batch upload is being performed
        media_list = [Media(**item) for item in validated_data]
        try:
            return Media.objects.create
        except (TypeError) as e:
            return Media.objects.bulk_create(media_list)

    def update(self, instance, validated_data):
        # is this where we check if the filetype is valid etc.?

        # multiple media updates are happening at once
        pass


class MediaAllowedFileTypeChecker(object):
    ALLOWED_FILETYPES = settings.ACCEPT_FILETYPES

    def __contains__(self, val):
        for kind, types in settings.ACCEPT_MIMES.values():
            if val in types:
                return kind
        raise ValidationError("Media type could not be determined.")


# class MediaSrcField(FileField):
#     ALLOWED_TYPES = MediaAllowedFileTypeChecker()

#     def get_file_extension(self, filename, decoded_file):
#         #
#         # WARNING: this could be DDOSed!
#         #
#         from django.core.files.storage import default_storage
#         from django.core.files.base import ContentFile
#         from os.path import join
#         import magic
#         tmpfile = 'tmp/{}'.format(upload)
#         default_storage.save(tmpfile, ContentFile(decoded_file).read())
#         path_to_tmpfile = join(settings.MEDIA_ROOT, tmpfile)

#         file_mime = magic.from_file(path_to_tmpfile, mime=True)

#         return file_mime

#     def to_internal_value(self, data):
#         file_object = super(MediaSrcField, self).to_internal_value(data)
#         # TODO add virus protection

#         try:
#             file_object['ext'] = file_object['name'].split('.')[1 ]
#         except IndexError:
#             # There is no explicit file extension
#             file_object['ext'] = ''

#         if 'mime' not in file_object:
#             # Try to figure out a file format from the associated mimetypes
#             file_object['mime'] = self.infer_format(data.file)

#         return file_object


# class MediaHyperlinkedSerializer(serializers.HyperlinkedModelSerializer):
#     src = MediaSrcHyperlinkedField(
#         read_only=False,
#         many=True,
#         required=False,
#         view_name='media-image-src'
#     )

#     tags = serializers.PrimaryKeyRelatedField(
#         queryset=MediaTag.objects.all(),
#         many=True,
#         required=False
#     )

#     class Meta:
#         model = Media
#         list_serializer_class = MediaListSerializer
#         fields = ('album', 'title', 'description', 'tags', 'media_type', 'src')


class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ('id', 'title', 'description', 'tags', 'media_type')

    def determine_media_type(self, mime):
        for kind, types in settings.ACCEPT_MIMES.values():
            if mime in types:
                return kind
        raise ValidationError("Media type could not be determined.")

    # def validate(self, data):
    #     if data['media_type'] not in mediaChoices:
    #         data['media_type'] = self.determine_media_type(data['src']['mime'])

        # if data['src']['size'] > settings.MAX_FILE_SIZE[data['media_type']]:
        #     raise ValidationError('File cannot be stored due to large size')

        # acceptable_mimes = settings.ACCEPT_MIMES[data["media_type"]]
        # if data['src']['mime'] not in acceptable_mimes:
        #     raise ValidationError('MIME type not valid for media_type')


class AlbumMediaBrowserPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 24
    # essentially we limit this because this will be 24 "guaranteed" CDN requests


# class MediaBrowserSerializer(serializers.HyperlinkedModelSerializer):
#     media_set = SerializerMethodField()


#    class Meta:
#         model = Album
#         # TODO reevaluate this later
#         #'thumbnail', 
#         fields = ('media_set')

    # def get_media_set(self, obj):
    #     MediaSerializer(
    #         many=True,
    #         read_only=True
    #     )

    #     return serializer.data

class AlbumInfoSerializer(serializers.ModelSerializer):
    owner = AccountSerializer(
        read_only=True
    )
    tags = serializers.PrimaryKeyRelatedField(
        queryset=AlbumTag.objects.all(),
        many=True,
        required=False
    )
    class Meta:
        model = Album
        fields = ('id', 'title', 'description', 'owner', 'tags')


class AlbumCreateSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(
        queryset=Account.objects.all(),
        required=False
    )

    tags = serializers.PrimaryKeyRelatedField(
        queryset=AlbumTag.objects.all(),
        many=True,
        required=False
    )
    class Meta:
        model = Album
        fields = ('id', 'title', 'description', 'owner', 'tags')


class FeedContentItemTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedContentItemType
        fields = ('id', 'name')


class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interest
        fields = ('id', 'name')


class PlaceSerializer(serializers.ModelSerializer):
    owner = AccountSerializer()

    class Meta:
        model = Place
        fields = ('id', 'name', 'owner', 'default_feed')


class ProfileSerializer(serializers.ModelSerializer):
    interests = InterestSerializer(
        many=True
    )

    class Meta:
        model = Profile
        fields = ('id', 'display_name', 'account', 'picture', 'title', 'description', 'interests', 'background_image', 'background_color', 'background_repeat')


class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('id', 'display_name', 'account', 'picture', 'title', 'description', 'interests', 'background_image', 'background_color', 'background_repeat')


class FeedCreateUpdateSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(
        queryset=Account.objects.all(),
        required=False
    )

    content_types = serializers.PrimaryKeyRelatedField(
        queryset=FeedContentItemType.objects.all(),
        many=True,
        required=False
    )

    stashes = serializers.PrimaryKeyRelatedField(
        queryset=FeedContentStash.objects.all(),
        many=True,
        required=False
    )

    places = serializers.PrimaryKeyRelatedField(
        queryset=Place.objects.all(),
        many=True,
        required=False
    )

    class Meta:
        model = Feed
        fields = ('id', 'name', 'description', 'icon', 'picture', 'owner', 'content_types', 'interests', 'places', 'stashes', 'visibility', 'background_image', 'background_color', 'background_repeat')

    def to_representation(self, obj):
        result = super(FeedCreateUpdateSerializer, self).to_representation(obj)

        # Filter to only include places that are owned by this user
        request = self.context.get("request")
        if request and hasattr(request, 'user') and not request.user.is_anonymous:
            result['places'] = [place.id for place in obj.places.filter(owner=request.user)]

        return result


class FeedSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(
        queryset=Account.objects.all(),
        required=False
    )

    interests = InterestSerializer(
        many=True
    )

    has_group = serializers.SerializerMethodField()

    class Meta:
        model = Feed
        fields = ('id', 'name', 'description', 'icon', 'picture', 'has_group', 'owner', 'content_types', 'created', 'interests', 'stashes', 'visibility', 'background_image', 'background_color', 'background_repeat')

    def get_has_group(self, instance):
        return instance.groupforum_set.count() > 0


class CommentBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'owner', 'is_anonymous', 'content_item', 'user_profile', 'parent', 'text', 'created')

    def to_representation(self, obj):
        # TODO make this a mixin?
        self.context['is_anonymous'] = obj.is_anonymous

        result = super(CommentBasicSerializer, self).to_representation(obj)

        # If this is the primary key serializer, give it the forgotten fake intance
        if obj.is_anonymous and isinstance(result['owner'], int):
            result['owner'] = {
                'id': -1,
                'username': 'Anonymous',
                'country': '',
                'email': ''
            }

        return result


class CommentSerializer(CommentBasicSerializer):
    owner = AccountSerializer(
        read_only=True,
    )


class CommentCreateUpdateSerializer(CommentBasicSerializer):
    pass


class FeedContentItemBasicSerializer(serializers.ModelSerializer):

    content_type = serializers.PrimaryKeyRelatedField(
        queryset=FeedContentItemType.objects.all(),
        required=False
    )
    is_anonymous = serializers.BooleanField(
        required=False
    )
    class Meta:
        model = FeedContentItem
        fields = ('id', 'title', 'description', 'owner', 'is_anonymous', 'content_type', 'visibility', 'created', 'interests', 'places')

    def to_representation(self, obj):
        self.context['is_anonymous'] = obj.is_anonymous
        result = super(FeedContentItemBasicSerializer, self).to_representation(obj)

        # Filter to only include places that are owned by this user
        request = self.context.get("request")
        if request and hasattr(request, 'user') and not request.user.is_anonymous:
            result['places'] = [place.id for place in obj.places.filter(owner=request.user)]

        # If this is the primary key serializer, give it the forgotten fake intance
        if obj.is_anonymous and isinstance(result['owner'], int):
            result['owner'] = {
                'id': -1,
                'username': 'Anonymous',
                'country': '',
                'email': ''
            }

        return result

def get_content_id(instance):
    _model = None
    if instance.content_type.name == FeedContentItemType.TOPIC or \
       instance.content_type.name == FeedContentItemType.POST or \
       instance.content_type.name == FeedContentItemType.POLL:
        _model = Discussion
    elif instance.content_type.name == FeedContentItemType.LINK:
        _model = Link
    elif instance.content_type.name == FeedContentItemType.IMAGE:
        _model = Image

    pk = _model.objects.filter(content_item=instance).values_list('id', flat=True).first()
    return pk

def get_group_id_name(instance):
    # TODO optimize
    if instance.origin_stash:
        groups = instance.origin_stash.origin_feed.groupforum_set
        if groups.count():
            return [groups.first().id, groups.first().name]

def get_feed_id(instance):
    if instance.origin_stash:
        return instance.origin_stash.feeds.first().id


class FeedContentItemSerializer(FeedContentItemBasicSerializer):
    owner = AccountBasicSerializer(
        required=False
    )
    object_id = serializers.SerializerMethodField('get_content_id')
    origin_stash_id = serializers.SerializerMethodField()
    feed_id = serializers.SerializerMethodField()
    group_id = serializers.SerializerMethodField()
    group_name = serializers.SerializerMethodField()
    is_local = serializers.SerializerMethodField()
    nested_object = serializers.SerializerMethodField()
    # content_type = serializers.StringRelatedField(
    #     required=False
    # )

    class Meta:
        model = FeedContentItem
        fields = ('id', 'title', 'description', 'owner', 'is_anonymous', 'is_local', 'content_type', 'comments', 'created', 'object_id', 'origin_stash_id', 'feed_id', 'group_id', 'group_name', 'nested_object', 'visibility', 'interests')

    def get_content_id(self, instance):
        return get_content_id(instance)

    def get_origin_stash_id(self, instance):
        if instance.origin_stash:
            return instance.origin_stash.id

    def get_feed_id(self, instance):
        return get_feed_id(instance)

    def get_group_id(self, instance):
        v = get_group_id_name(instance)
        if v:
            return v[0]

    def get_group_name(self, instance):
        v = get_group_id_name(instance)
        if v:
            return v[1]

    def get_is_local(self, instance):
        allowed_places = self.context.get('allowed_places', [])

        for place_id in [p.id for p in instance.places.all()]:
            if place_id in allowed_places:
                return True

        return False

    def get_nested_object(self, instance):
        """Returns a nested representation of the content item's object"""
        if instance.content_type.name == FeedContentItemType.LINK:
            content_id = self.get_content_id(instance)
            if content_id:
                return BasicLinkSerializer(instance=Link.objects.get(id=content_id)).data
        elif instance.content_type.name == FeedContentItemType.IMAGE:
            content_id = self.get_content_id(instance)
            if content_id:
                return BasicImageSerializer(instance=Image.objects.get(id=content_id)).data


class FeedContentStashItemBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedContentStashItem
        fields = ('id', 'is_pinned', 'order')


class FeedContentItemCreateUpdateSerializer(FeedContentStashItemBasicSerializer):
    def update(self, instance, validated_data):
        if 'item' in validated_data:
            for k,v in validated_data.pop('item').items():
                setattr(instance.item, k, v)
                instance.item.save()

        return super(FeedContentItemCreateUpdateSerializer, self).update(instance, validated_data)


class FeedContentStashItemSerializer(FeedContentStashItemBasicSerializer):
    item = FeedContentItemSerializer()

    class Meta:
        model = FeedContentStashItem
        fields = ('id', 'item', 'is_pinned', 'order')


class FeedContentItemProfileSerializer(FeedContentItemBasicSerializer):
    owner = AccountSerializer()
    comments = CommentSerializer(
        many=True,
        read_only=True,
        required=False
    )

    class Meta:
        model = FeedContentItem
        fields = ('id', 'title', 'description', 'owner', 'interests', 'comments', 'content_type', 'created', 'is_anonymous', 'visibility')


class FeedContentStashSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedContentStash
        fields = ('id', 'name', 'description')


class FeedContentStashContentSerializer(serializers.ModelSerializer):
    content = serializers.SerializerMethodField('paginated_content')

    def paginated_content(self, instance):
        request = self.context['request']

        content_queryset = FeedContentStashItem.objects.filter(stash=instance).restrict_local(user=request.user)

        if request.user and request.user.is_authenticated():
            # Either the user owns these objects or it is NOT private
            content_queryset = content_queryset.filter(Q(item__owner=request.user) | ~Q(item__visibility='9'))
        else:
            content_queryset = content_queryset.exclude(item__visibility='9')

        _content_types = request.data.get('content_types', None)
        if _content_types:
            content_queryset = content_queryset.filter(content_type__in=FeedContentType.objects.filter(id__in=_content_types))

        _interests = request.data.get('interests', None)
        if _interests:
            content_queryset = content_queryset.filter(interests__in=Interest.objects.filter(id__in=_interests))

        paginator = FeedContentItemPagination()
        page = paginator.paginate_queryset(content_queryset.order_by('-is_pinned', '-item__created'), self.context['request'])
        serializer = FeedContentStashItemSerializer(
            page,
            many=True,
            context={'request': self.context['request']}
        )
        return { 'results': serializer.data, 'count': content_queryset.count() }

    class Meta:
        model = FeedContentStash
        fields = ('content',)


class FeedContentStashCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedContentStash
        # NOTE one request could wipe out entire stash! BAD
        fields = ('id', 'name', 'description', 'content')


class ContentItemCRUDSerializer(serializers.ModelSerializer):
    def create_content_item(self, data, content_type):
        if 'content_type' in data:
            # Content type is already provided and is not overrideable
            data.pop('content_type')

        interests = []
        places = []
        if 'interests' in data:
            interests = data.pop('interests')
        if 'places' in data:
            places = data.pop('places')

        instance = FeedContentItem.objects.create(**data, content_type=content_type)
        instance.interests.add(*interests)
        instance.places.add(*places)

        return instance

    def update(self, instance, validated_data):
        if 'content_item' in validated_data:
            for k,v in validated_data.pop('content_item').items():
                setattr(instance.content_item, k, v)
                instance.content_item.save()

        return super(ContentItemCRUDSerializer, self).update(instance, validated_data)

    class Meta:
        abstract = True


class PollOptionSerializer(serializers.ModelSerializer):
    value = serializers.SerializerMethodField('get_vote_count')
    id = serializers.ModelField(model_field=PollOption()._meta.get_field('id'), required=False)

    class Meta:
        model = PollOption
        fields = ('id', 'title', 'value', 'order')

    def get_vote_count(self, instance):
        return instance.votes.count()


class PollSerializer(serializers.ModelSerializer):
    options = PollOptionSerializer(many=True)
    user_votes = serializers.SerializerMethodField()

    class Meta:
        model = Poll
        fields = ('id', 'options', 'user_votes')

    def get_user_votes(self, instance):
        if self.context['request'].user.is_authenticated():
            vote = PollOptionVote.objects.filter(owner=self.context['request'].user, poll=instance)
            if vote.exists():
                return [choice.id for choice in list(vote.first().options.all())]
        return []


class DiscussionSerializer(serializers.ModelSerializer):
    content_item = FeedContentItemProfileSerializer()
    text_last_edited = serializers.DateTimeField(
        required=False,
        read_only=True
    )
    poll = PollSerializer(required=False)

    class Meta:
        model = Discussion
        fields = ('id', 'parent', 'order', 'content_item', 'text', 'text_last_edited', 'poll')


cleaner = Cleaner(['a', 'p', 'abbr', 'br', 'acronym', 'b', 'code', 'img', 'pre', 'blockqote', 'span', 'sub', 'sup', 'code', 'em', 'i', 'ul', 'li', 'ol', 'strong', 'l', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'thead', 'caption', 'tbody', 'col', 'colgroup', 'tfoot', 'th', 'tr', 'td'], attributes={'*': ['style', 'alt', 'width', 'height'], 'img': ['src'], 'a': ['href', 'title'], 'abbr': ['title'], 'acronym': ['title'], 'table': ['align', 'cellpadding', 'cellspacing'], 'th': ['scope'], 'colgroup': ['span'], 'caption': ['align']}, styles=['color', 'font-weight', 'text-decoration', 'background-color', 'color', 'text-align', 'border-style', 'border', 'border-width', 'border-color'])


class DiscussionCreateUpdateSerializer(ContentItemCRUDSerializer):
    content_item = FeedContentItemBasicSerializer(
        many=False,
        required=False
    )
    text_last_edited = serializers.DateTimeField(
        required=False,
        read_only=True
    )
    poll = PollSerializer(required=False)

    def save(self):
        if 'text' in self.validated_data:
            text = self.validated_data['text']
            self.validated_data['text'] = cleaner.clean(text)
        super(DiscussionCreateUpdateSerializer, self).save()

    def create(self, validated_data):
        content_item_data = validated_data.pop('content_item')
        poll_data = None
        order = 0

        if validated_data.get('parent', 0):
            content_type = FeedContentItemType.objects.get(name=FeedContentItemType.POST)
            posts = Discussion.objects.filter(parent=validated_data['parent'])
            if posts.count() >= 1:
                order = posts.aggregate(Max('order'))['order__max'] + 1
            else:
                order = 1
        elif validated_data.get('poll', 0):
            content_type = FeedContentItemType.objects.get(name=FeedContentItemType.POLL)
            poll_data = validated_data.pop('poll')
        else:
            content_type = FeedContentItemType.objects.get(name=FeedContentItemType.TOPIC)

        content_item = self.create_content_item(content_item_data, content_type)

        discussion = Discussion.objects.create(**validated_data, content_item=content_item, order=order)

        if poll_data:
            # create Poll
            options_data = poll_data.pop('options')
            poll = Poll.objects.create(**poll_data)
            options = PollOption.objects.bulk_create([
                PollOption(**option, poll=poll) for option in options_data
            ])

            discussion.poll = poll
            discussion.save()

        # discussion.members.add(*member

        return discussion

    def update(self, instance, validated_data):
        if 'poll' in validated_data:
            poll_data = validated_data.pop('poll')
            if 'options' in poll_data:
                poll_options = []
                serializer = None
                for option_data in poll_data.pop('options'):
                    if 'id' in option_data:
                        option = PollOption.objects.filter(id=option_data.pop('id'))
                        if not option.count():
                            continue
                        option = option.first()

                        serializer = PollOptionSerializer(data=option_data, instance=option)
                    else:
                        serializer = PollOptionSerializer(data=option_data)

                    if serializer.is_valid():
                        serializer.validated_data['poll'] = instance.poll
                        option = serializer.save()
                        poll_options.append(option.id)
                        print(serializer.errors)

                PollOption.objects.filter(poll=instance.poll).exclude(id__in=poll_options).delete()

        return super(DiscussionCreateUpdateSerializer, self).update(instance, validated_data)

    class Meta:
        model = Discussion
        fields = ('id', 'parent', 'order', 'content_item', 'text', 'text_last_edited', 'poll')


class LinkSerializer(serializers.ModelSerializer):
    content_item = FeedContentItemProfileSerializer()

    class Meta:
        model = Link
        fields = ('id', 'content_item', 'link')

class BasicLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Link
        fields = ('id', 'link')


class LinkCreateUpdateSerializer(ContentItemCRUDSerializer):
    content_item = FeedContentItemBasicSerializer(
        many=False,
        required=False
    )

    def create(self, validated_data):
        content_item_data = validated_data.pop('content_item')

        content_type = FeedContentItemType.objects.get(name=FeedContentItemType.LINK)
        content_item = self.create_content_item(content_item_data, content_type)

        link = Link.objects.create(**validated_data, content_item=content_item)

        return link

    class Meta:
        model = Link
        fields = ('id', 'content_item', 'link')


class ImageSerializer(serializers.ModelSerializer):
    content_item = FeedContentItemProfileSerializer()

    class Meta:
        model = Image
        fields = ('id', 'content_item', 'src')

class BasicImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ('id', 'src')


class ImageCreateUpdateSerializer(ContentItemCRUDSerializer):
    content_item = FeedContentItemBasicSerializer(
        many=False,
        required=False
    )

    def create(self, validated_data):
        content_item_data = validated_data.pop('content_item')

        content_type = FeedContentItemType.objects.get(name=FeedContentItemType.IMAGE)
        content_item = self.create_content_item(content_item_data, content_type)

        image = Image.objects.create(**validated_data, content_item=content_item)

        return image

    class Meta:
        model = Image
        fields = ('id', 'content_item', 'src')


class GroupForumSerializer(GroupForumBasicSerializer):
    owner = serializers.PrimaryKeyRelatedField(
        queryset=Account.objects.all(),
        required=False
    )

    feed = FeedSerializer(
        read_only=False
    )

    members = serializers.SerializerMethodField()
    members_count = serializers.SerializerMethodField()

    is_local = serializers.SerializerMethodField()

    class Meta:
        model = GroupForum
        fields = ('id', 'name', 'image', 'description', 'feed', 'owner', 'is_restricted', 'is_local', 'members', 'members_count', 'rules')

    def get_is_local(self, instance):
        return instance.feed.places.count() != 0

    def get_members(self, instance):
        # Only show members to Group owner
        if 'request' in self.context and self.context['request'].user == instance.owner:
            return AccountSerializer(instance.members, many=True).data
        return []

    def get_members_count(self, instance):
        return instance.members.count()


class GroupForumCreateUpdateSerializer(GroupForumSerializer):
    owner = serializers.PrimaryKeyRelatedField(
        queryset=Account.objects.all(),
        required=False
    )

    members = serializers.PrimaryKeyRelatedField(
        queryset=Account.objects.all(),
        required=False,
        many=True
    )

    feed = FeedCreateUpdateSerializer(
        read_only=False
    )

    def update(self, instance, validated_data):
        if 'feed' in validated_data:
            print(validated_data)
            for k,v in validated_data.pop('feed').items():
                setattr(instance.feed, k, v)

            instance.feed.save()

        return super(GroupForumCreateUpdateSerializer, self).update(instance, validated_data)

    def create(self, validated_data):
        feed_data = validated_data.pop('feed')
        interests = None
        content_types = None
        places = None
        print(validated_data, feed_data)

        if 'interests' in feed_data:
            interests = feed_data.pop('interests')
        if 'content_types' in feed_data:
            content_types = feed_data.pop('content_types')
        if 'places' in feed_data:
            places = feed_data.pop('places')

        feed = Feed.objects.create(**feed_data)
        if interests:
            feed.interests.add(*interests)
        if content_types:
            feed.content_types.add(*content_types)
        if places:
            # NOTE only Places owned by this user can be added to the Group's feed
            feed.places.add(*places)

        stash = FeedContentStash.objects.create(name="Default", description="Stored content for this group", origin_feed=feed)
        feed.stashes.add(*(stash,))

        members = validated_data.pop('members')
        group = GroupForum.objects.create(**validated_data, feed=feed)
        group.members.add(*members, group.owner)

        return group

    class Meta:
        model = GroupForum
        fields = ('id', 'name', 'image', 'description', 'feed', 'owner', 'is_restricted', 'members', 'rules')
