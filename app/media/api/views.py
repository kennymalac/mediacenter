from django.shortcuts import render
from django.conf import settings
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.decorators import api_view, detail_route, parser_classes
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework_extensions.mixins import NestedViewSetMixin

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


class MediaViewSet(ListModelMixin,
                   RetrieveModelMixin,
                   GenericViewSet):
    # TODO: make this more refined based on user privilege levels
    queryset = Media.objects.filter(hidden=False)
    serializer_class = MediaSerializer
    pagination_class = AlbumMediaBrowserPagination


class AlbumViewSet(NestedViewSetMixin, ModelViewSet):
    queryset = Album.objects.all()
    """An API for viewing and uploading albums"""
    serializer_class = AlbumInfoSerializer
    # serializer_classes = {
    #     'default': AlbumInfoSerializer,
    #     # 'public': 
    #     'details': MediaBrowserSerializer
    # }

    # @api_view(['POST'])
    @detail_route(methods=['POST'], url_path='upload')
    @parser_classes((MultiPartParser, FormParser))
    def upload_media_items(self, request, *args, **kwargs):
        # TODO verify user privilege to upload to this album
        MediaViewSet.create(request, args, kwargs)


    # def get_queryset(self):
    #     if self.access_level == 'public':
    #         return Album.objects.filter(access_level='0')

    # @detail_route(methods=['get'], url_path='browse')
    # def details(self, request, pk=None):
    #     #self.set_privilege(data['access_level'])
    #     album = self.get_object()
    #     serializer = self.get_serializer(
    #         instance=album,
    #     )

    #     return Response(serializer.data)

