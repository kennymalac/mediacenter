from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet

from api.models import *
from api.serializers import *

class MultipleSerializerMixin(object):
    def get_serializer_class(self):
        try:
            if hasattr(self, 'action'):
                if self.action in self.serializer_classes:
                    return self.serializer_classes[self.action]
            return self.serializer_classes['default']
        except (KeyError, AttributeError):
            return super(MultipleSerializerMixin, self).get_serializer_class()


class AccountViewSet(MultipleSerializerMixin, ModelViewSet):
    """An API for viewing and editing accounts"""
    queryset = Account.objects.all()
    serializer_classes = {
        'default': AccountSerializer,
        'create': FullAccountSerializer,
    }
    # permission_classes


class ActivityLogViewSet(ModelViewSet):
    queryset = ActivityLog.objects.all()
    serializer_class = ActivityLogSerializer


class BlogPostViewSet(ModelViewSet):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer


class MediaViewSet(ModelViewSet):
    # TODO: make this more refined based on user privilege levels
    queryset = Media.objects.filter()
    serializer_class = MediaListSerializer
    pagination_class = AlbumMediaBrowserPagination


class AlbumViewSet(MultipleSerializerMixin, ModelViewSet):
    """An API for viewing and uploading albums"""
    queryset = Album.objects.all()
    serializer_classes = {
        'public': MediaBrowserSerializer,
        'metadata': AlbumInfoSerializer
    }
