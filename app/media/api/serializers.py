from django.utils.translation import ugettext_lazy as _
from django.db.models import Max
from django.conf import settings
from api.paginators import *
from django_countries.serializers import CountryFieldMixin
from rest_framework import serializers
from rest_framework.pagination import PageNumberPagination

from api.models import *


class BasicProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('id', 'display_name', 'picture')


class AccountSerializer(CountryFieldMixin, serializers.ModelSerializer):
    profile = BasicProfileSerializer()

    class Meta:
        model = Account
        fields = ('id', 'username', 'country', 'email', 'profile', 'friends')


class FullAccountSerializer(AccountSerializer):
    """Requires full account view permissions (i.e. admin or current user privilege levels) UNLESS it is from a CREATE request."""
    account_settings = serializers.JSONField(read_only=False)

    def create(self, validated_data):
        profile_data = {}
        if 'profile' in validated_data:
            profile_data = validated_data.pop('profile')

        password = validated_data.pop('password')
        account = Account.objects.create(**validated_data)
        account.set_password(password)

        profile = Profile.objects.create(**profile_data, account=account)
        account.profile = profile
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
        fields = ('id', 'account_settings', 'profile', 'groupforum_set')


class LogSerializer(serializers.Serializer):
    created = serializers.DateTimeField()
    last_modified = serializers.DateTimeField()
    message = serializers.CharField(max_length=400, allow_blank=True)


class ActivityLogSerializer(serializers.Serializer):
    title = serializers.CharField()
    authors = serializers.ModelField(Account)
    logs = serializers.ModelField(Log)


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


class ProfileSerializer(serializers.ModelSerializer):
    interests = InterestSerializer(
        many=True
    )

    class Meta:
        model = Profile
        fields = ('id', 'display_name', 'picture', 'title', 'description', 'interests')


class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('id', 'display_name', 'picture', 'title', 'description', 'interests')


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

    class Meta:
        model = Feed
        fields = ('id', 'name', 'description', 'owner', 'content_types', 'interests')


class FeedSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(
        queryset=Account.objects.all(),
        required=False
    )

    interests = InterestSerializer(
        many=True
    )

    class Meta:
        model = Feed
        fields = ('id', 'name', 'description', 'owner', 'content_types', 'created', 'interests')


class FeedContentItemSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(
        queryset=Account.objects.all(),
        required=False
    )
    object_id = serializers.SerializerMethodField('get_content_id')
    # content_type = serializers.StringRelatedField(
    #     required=False
    # )

    class Meta:
        model = FeedContentItem
        fields = ('id', 'title', 'description', 'owner', 'content_type', 'created', 'object_id')

    def get_content_id(self, instance):
        _model = None
        if instance.content_type.name == FeedContentItemType.TOPIC or \
           instance.content_type.name == FeedContentItemType.POST:
            _model = Discussion
        # elif instance.content_type == FeedContentItemType.IMAGE:
        #     _model =

        return _model.objects.filter(content_item=instance).values_list('id', flat=True).first()


class FeedContentItemCreateUpdateSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(
        queryset=Account.objects.all(),
        required=False
    )

    content_type = serializers.PrimaryKeyRelatedField(
        queryset=FeedContentItemType.objects.all(),
        required=False
    )

    class Meta:
        model = FeedContentItem
        fields = ('id', 'title', 'description', 'owner', 'content_type', 'created')


class FeedContentItemProfileSerializer(serializers.ModelSerializer):
    owner = AccountSerializer()

    class Meta:
        model = FeedContentItem
        fields = ('id', 'title', 'description', 'owner', 'content_type', 'created')


class FeedContentStashSerializer(serializers.ModelSerializer):
    content = serializers.SerializerMethodField('paginated_content')

    class Meta:
        model = FeedContentStash
        fields = ('id', 'name', 'description', 'content')

    def paginated_content(self, instance):
        request = self.context['request']

        content_queryset = instance.content.all()
        _content_types = request.data.get('content_types', None)
        if _content_types:
            content_queryset = content_queryset.filter(content_type__in=FeedContentType.objects.filter(id__in=_content_types))

        _interests = request.data.get('interests', None)
        if _interests:
            content_queryset = content_queryset.filter(interests__in=Interest.objects.filter(id__in=_interests))

        paginator = StandardResultsSetPagination()
        page = paginator.paginate_queryset(content_queryset, self.context['request'])
        serializer = FeedContentItemSerializer(
            page,
            many=True,
            context={'request': self.context['request']}
        )
        return serializer.data


class FeedContentStashCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedContentStash
        # NOTE one request could wipe out entire stash! BAD
        fields = ('id', 'name', 'description', 'content')


class DiscussionSerializer(serializers.ModelSerializer):
    content_item = FeedContentItemProfileSerializer()

    class Meta:
        model = Discussion
        fields = ('id', 'parent', 'order', 'content_item', 'group', 'text')


class DiscussionCreateUpdateSerializer(serializers.ModelSerializer):
    content_item = FeedContentItemCreateUpdateSerializer(
        many=False,
        required=False
    )

    def update(self, instance, validated_data):
        if 'content_item' in validated_data:
            for k,v in validated_data.pop('content_item').items():
                setattr(instance.content_item, k, v)
                instance.content_item.save()

        return super(DiscussionCreateUpdateSerializer, self).update(instance, validated_data)

    def create(self, validated_data):
        content_item_data = validated_data.pop('content_item')
        # group = content_item_data.pop('group')
        order = 0

        if validated_data.get('parent', 0):
            content_type = FeedContentItemType.objects.get(name=FeedContentItemType.POST)
            posts = Discussion.objects.filter(parent=validated_data['parent'])
            if posts.count() >= 1:
                order = posts.aggregate(Max('order'))['order__max'] + 1
            else:
                order = 1
        else:
            content_type = FeedContentItemType.objects.get(name=FeedContentItemType.TOPIC)

        content_item = FeedContentItem.objects.create(**content_item_data, content_type=content_type)

        discussion = Discussion.objects.create(**validated_data, content_item=content_item, order=order)
        # discussion.members.add(*members)

        return discussion

    class Meta:
        model = Discussion
        fields = ('id', 'parent', 'order', 'group', 'content_item', 'text')


class GroupForumSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(
        queryset=Account.objects.all(),
        required=False
    )

    feed = FeedSerializer(
        read_only=False
    )

    class Meta:
        model = GroupForum
        fields = ('id', 'name', 'image', 'description', 'feed', 'owner', 'is_restricted', 'members', 'rules')


class GroupForumCreateUpdateSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(
        queryset=Account.objects.all(),
        required=False
    )

    feed = FeedCreateUpdateSerializer(
        read_only=False
    )

    def update(self, instance, validated_data):
        if 'feed' in validated_data:
            print(validated_data)
            for k,v in validated_data.pop('feed').items():
                setattr(instance.feed, k, v)

        return super(GroupForumCreateUpdateSerializer, self).update(instance, validated_data)

    def create(self, validated_data):
        feed_data = validated_data.pop('feed')
        interests = None
        content_types = None
        if 'interests' in feed_data:
            interests = feed_data.pop('interests')
        if 'content_types' in feed_data:
            content_types = feed_data.pop('content_types')

        feed = Feed.objects.create(**feed_data)
        if interests:
            feed.interests.add(*interests)
        if content_types:
            feed.content_types.add(*content_types)

        stash = FeedContentStash.objects.create(name="Default", description="Stored content for this group")
        feed.stashes.add(stash)

        members = validated_data.pop('members')
        group = GroupForum.objects.create(**validated_data, feed=feed)
        group.members.add(*members, group.owner)

        return group

    class Meta:
        model = GroupForum
        fields = ('id', 'name', 'image', 'description', 'feed', 'owner', 'is_restricted', 'members', 'rules')
