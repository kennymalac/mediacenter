from api.models import *
from rest_framework import serializers
from rest_framework.pagination import PageNumberPagination
from django_countries.serializer_fields import CountryField

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
    title = serializers.CharField()
    src = serializers.URLField(max_length=200, min_length=None, allow_blank=False)

    class Meta:
        list_serializer_class = MediaListSerializer


class AlbumMediaBrowserPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 24
    # essentially we limit this because this will be 24 "guaranteed" CDN requests


class MediaBrowserSerializer(serializers.HyperlinkedModelSerializer):
    title = serializers.CharField()
    # TODO consult Django REST framework serializer documentation
    media = serializers.HyperlinkedRelatedField(
        view_name='media-detail',
        many=True,
        read_only=True
    )

    class Meta:
        model = Album
        # TODO reevaluate this later
        fields = ('media')

        
class AlbumInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Album
        fields = ('id', 'title', 'tags')
