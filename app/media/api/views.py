from django.shortcuts import render
from django.conf import settings
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, CreateModelMixin
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, list_route, detail_route, parser_classes
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework_extensions.mixins import NestedViewSetMixin

from api.models import *
from api.serializers import *
from api.filters import *

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
        'profile': PrivateAccountProfileDetailsSerializer
    }
    # permission_classes

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]

        return super(AccountViewSet, self).get_permissions()

    @detail_route(methods=['POST', 'GET'], url_path='profile')
    @parser_classes((JSONParser,))
    def profile(self, request, *args, **kwargs):
        serializer = self.get_serializer(
             instance=self.get_object()
        )

        if request.method == "POST":
            if serializer.is_valid(request.data):
                # TODO if method is POST, modify profile
                pass

        elif request.method == "GET":
            return Response(serializer.data)

    @list_route(methods=['GET'], url_path='current-user')
    def current_user_profile(self, request):
        serializer = PrivateAccountProfileDetailsSerializer(request.user)
        return Response(serializer.data)


class ActivityLogViewSet(ModelViewSet):
    queryset = ActivityLog.objects.all()
    serializer_class = ActivityLogSerializer


class BlogPostViewSet(ModelViewSet):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer


class MediaViewSet(NestedViewSetMixin,
                   MultipleSerializerMixin,
                   ListModelMixin,
                   RetrieveModelMixin,
                   CreateModelMixin,
                   GenericViewSet):
    # TODO: make this more refined based on user privilege levels
    queryset = Media.objects.filter(hidden=False)
    serializer_classes = {
        'default': MediaSerializer,
    }
    pagination_class = AlbumMediaBrowserPagination


class FeedContentTypeViewSet(ListModelMixin,
                  RetrieveModelMixin,
                  GenericViewSet):
    queryset = FeedContentItemType.objects.all()
    serializer_class = FeedContentItemTypeSerializer


class InterestViewSet(ListModelMixin,
                      RetrieveModelMixin,
                      CreateModelMixin,
                      GenericViewSet):
    queryset = Interest.objects.all()
    serializer_class = InterestSerializer


class ProfileViewSet(ListModelMixin,
                     RetrieveModelMixin,
                     GenericViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    filter_fields = ('interests',)


class FeedViewSet(NestedViewSetMixin,
                  MultipleSerializerMixin,
                  ModelViewSet):
    # TODO Federated - users seize the means of feed production

    queryset = Feed.objects.filter(groupforum__isnull=True)
    serializer_classes = {
        'default': FeedSerializer,
        'update': FeedCreateUpdateSerializer,
        'create': FeedCreateUpdateSerializer
    }


class FeedContentItemViewSet(NestedViewSetMixin,
                             ListModelMixin,
                             RetrieveModelMixin,
                             CreateModelMixin,
                             GenericViewSet):

    queryset = FeedContentItem.objects.all()
    serializer_class = FeedContentItemSerializer


class DiscussionViewSet(NestedViewSetMixin,
                        MultipleSerializerMixin,
                        ModelViewSet):

    queryset = Discussion.objects.all().order_by('order')
    serializer_classes = {
        'default': DiscussionSerializer,
        'partial_update': DiscussionCreateUpdateSerializer,
        'update': DiscussionCreateUpdateSerializer,
        'create': DiscussionCreateUpdateSerializer
    }


class GroupForumViewSet(NestedViewSetMixin,
                        MultipleSerializerMixin,
                        ModelViewSet):

    queryset = GroupForum.objects.all()
    serializer_classes = {
        'default': GroupForumSerializer,
        'partial_update': GroupForumCreateUpdateSerializer,
        'update': GroupForumCreateUpdateSerializer,
        'create': GroupForumCreateUpdateSerializer
    }
    filter_class = GroupForumFilter

    @list_route(methods=['POST'], url_path='search', permission_classes=[IsAuthenticated])
    def search(self, request):
        interests = Interest.objects.filter(id__in=request.data.get('interests', []))

        serializer = GroupForumSerializer(self.get_queryset().filter(feed__interests__in=interests), many=True)
        return Response(serializer.data)

    @detail_route(methods=['POST'], url_path='join', permission_classes=[IsAuthenticated])
    def join(self, request, pk=None):
        instance = self.queryset.get(pk=pk)

        if instance.is_restricted:
            return Response({
                'error': 'Joining this group is by invitation only'
            }, status=400)

        instance.members.add(request.user.id)

        return Response({})

    @detail_route(methods=['POST'], url_path='leave', permission_classes=[IsAuthenticated])
    def leave(self, request, pk=None):
        instance = self.queryset.get(pk=pk)
        instance.members.remove(request.user.id)

        return Response({})

# @api_view
# def media_image_src(request):
#     # request.query_params[]
#     # TODO CDN capabable?
#     # Return the File as a Response

#     media_item = Media.objects.get(album=album_pk, id=pk)
#     if (hasattr(media_item, 'src')):
#         return Response({
#             "data": Media.objects.get(album=album_pk, id=pk).src
#         })
#     else:
#         return Response({
#             "data": ""
#         })

class AlbumViewSet(NestedViewSetMixin, MultipleSerializerMixin, ModelViewSet):
    """An API for viewing and uploading albums"""
    queryset = Album.objects.all()

    serializer_classes = {
        'default': AlbumInfoSerializer,
        # 'public': 
        'create': AlbumCreateSerializer
    }

    @detail_route(methods=['POST'], url_path='upload')
    @parser_classes((MultiPartParser, FormParser))
    def upload_media_items(self, request, *args, **kwargs):
        # TODO verify user privilege to upload to this album
        viewfn = MediaViewSet.as_view({'post': 'create'})
        response = viewfn(request, args, kwargs)

        #Media.objects.get()

        return response

    # @api_view(['POST'])


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

