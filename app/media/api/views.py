from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import detail_route

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

# class AccessLevelsMixin(ModelViewSet):
#     def __init__(self):
#         self.access_level = ''

#     def set_privilege(self, request):
#         if request.user == 

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
    queryset = Album.objects.all()
    """An API for viewing and uploading albums"""
    serializer_classes = {
        'default': AlbumInfoSerializer,
        # 'public': 
        'details': MediaBrowserSerializer
    }

    # def get_queryset(self):
    #     if self.access_level == 'public':
    #         return Album.objects.filter(access_level='0')

    @detail_route(methods=['get'], url_path='browse')
    def details(self, request, pk=None):
        data = request.data
        #self.set_privilege(data['access_level'])

