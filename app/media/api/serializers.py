from django.core.paginator import Paginator
from django_countries.serializer_fields import CountryField
from rest_framework import serializers
from rest_framework.pagination import PageNumberPagination

from api.models import *


class AccountSerializer(serializers.ModelSerializer):
    country = CountryField()

    class Meta:
        model = Account
        fields = ('first_name', 'last_name', 'username', 'country', 'email')

class FullAccountSerializer(AccountSerializer):
    """Requires full account view permissions (i.e. admin or current user privilege levels)"""
    account_settings = serializers.JSONField(True)

    class Meta:
        model = Account
        fields = ('username', 'first_name', 'last_name', 'email', 'password', 'country', 'account_settings')


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


class MediaSerializer(serializers.ModelSerializer):
    src = serializers.URLField(
        max_length=1000,
        min_length=None,
        allow_blank=False
    )

    class Meta:
        model = Media
        fields = ('id', 'title', 'description', 'tags', 'media_type', 'src')
        list_serializer_class = MediaListSerializer

    def parse_src(self, value):
        # TODO add virus protection
        if value['filetype'] in ACCEPT_FILETYPES[self.media_type]:
            return True
        else:
            raise TypeError('File type ' + value['filetype'] + ' not valid for media type ' + self.media_type)


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
    class Meta:
        model = Album
        fields = ('id', 'title', 'description', 'owner', 'tags')
