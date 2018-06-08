from django.shortcuts import render, get_object_or_404
from django.conf import settings
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, CreateModelMixin, UpdateModelMixin
from rest_framework.filters import SearchFilter
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, list_route, detail_route, parser_classes
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework_extensions.mixins import NestedViewSetMixin

from api.models import *
from api.serializers import *
from api.filters import *
from api.paginators import *


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
    queryset = Account.objects.filter(profile__isnull=False)
    serializer_classes = {
        'default': AccountSerializer,
        'create': FullAccountSerializer,
        'profile': PrivateAccountProfileDetailsSerializer
    }

    filter_backends = (SearchFilter,)
    search_fields = ('username',)
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
    filter_backends = (SearchFilter,)
    search_fields = ('name',)


class ProfileViewSet(MultipleSerializerMixin,
                     ListModelMixin,
                     RetrieveModelMixin,
                     UpdateModelMixin,
                     GenericViewSet):
    queryset = Profile.objects.all()
    serializer_classes = {
        'default': ProfileSerializer,
        'update': ProfileUpdateSerializer,
        'partial_update': ProfileUpdateSerializer,
    }
    filter_fields = ('interests',)


class FeedViewSet(NestedViewSetMixin,
                  MultipleSerializerMixin,
                  ModelViewSet):
    # TODO Federated - users seize the means of feed production

    queryset = Feed.objects.filter(groupforum__isnull=True)
    serializer_classes = {
        'default': FeedSerializer,
        'update': FeedCreateUpdateSerializer,
        'partial_update': FeedCreateUpdateSerializer,
        'create': FeedCreateUpdateSerializer
    }
    filter_class = FeedFilter

    def list(self, request):
        if 'owner' in request.query_params:
            owner_id = request.query_params['owner']
            if int(owner_id) == request.user.id and Feed.objects.filter(owner=request.user, name="My Feed").count() == 0:
                setup_default_feed(request.user)

        return super(FeedViewSet, self).list(request)

    def create(self, request):
        request.data['owner'] = request.user.id
        return super(FeedViewSet, self).create(request)


class FeedContentItemViewSet(ListModelMixin,
                             RetrieveModelMixin,
                             CreateModelMixin,
                             GenericViewSet):

    queryset = FeedContentItem.objects.all()
    serializer_class = FeedContentItemSerializer
    pagination_class = StandardResultsSetPagination


    @list_route(methods=['POST'], url_path='search', permission_classes=[IsAuthenticated])
    def search(self, request):
        content_queryset = self.get_queryset()

        _feed_id = request.data.get('feed', None)
        if _feed_id:
            feed = get_object_or_404(Feed, pk=_feed_id)

            if feed.content_types.count() > 0:
                content_queryset = content_queryset.filter(content_type__in=feed.content_types.all())
            if feed.interests.count() > 0:
                content_queryset = content_queryset.filter(interests__in=feed.interests.all())

        else:
            _content_types = request.data.get('content_types', None)
            if _content_types:
                content_queryset = content_queryset.filter(content_type__in=FeedContentType.objects.filter(id__in=_content_types))

            _interests = request.data.get('interests', None)
            if _interests:
                content_queryset = content_queryset.filter(interests__in=Interest.objects.filter(id__in=_interests))

        serializer = self.get_serializer(self.paginate_queryset(content_queryset), many=True)

        return self.get_paginated_response(serializer.data)


class FeedContentStashViewSet(NestedViewSetMixin,
                              MultipleSerializerMixin,
                              ModelViewSet):

    queryset = FeedContentStash.objects.all()
    serializer_classes = {
        'default': FeedContentStashSerializer,
        'partial_update': FeedContentStashCreateUpdateSerializer,
        'update': FeedContentStashCreateUpdateSerializer,
        'create': FeedContentStashCreateUpdateSerializer
    }

    pagination_class = StandardResultsSetPagination

    @detail_route(methods=['POST'], url_path='content/add', permission_classes=[IsAuthenticated])
    def add_content(self, request, pk=None, **kwargs):
        print(kwargs.get('parent_lookup_feeds', ''))
        instance = self.queryset.get(pk=pk)

        # TODO get feed, verify feed membership/post permission
        # if instance.owner:
        #     return Response({
        #         'error': ''
        #     }, status=403)

        content_pks = request.data.get('content', [])
        content = FeedContentItem.objects.filter(pk__in=content_pks)

        instance.content.add(*list(content))

        # All content without an origin stash now default to being shown in this stash
        content.filter(origin_stash__isnull=True).update(origin_stash=instance)

        return Response({ 'content': request.data.get('content', []) })


class CommentViewSet(NestedViewSetMixin,
                     MultipleSerializerMixin,
                     ModelViewSet):

    queryset = Comment.objects.all().order_by('created')
    serializer_classes = {
        'default': CommentSerializer,
        'partial_update': CommentCreateUpdateSerializer,
        'update': CommentCreateUpdateSerializer,
        'create': CommentCreateUpdateSerializer
    }

    # def create(self, request):


    #     super(CommentViewSet, self).create(request)


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


class LinkViewSet(NestedViewSetMixin,
                  MultipleSerializerMixin,
                  ModelViewSet):

    queryset = Link.objects.all()
    serializer_classes = {
        'default': LinkSerializer,
        'partial_update': LinkCreateUpdateSerializer,
        'update': LinkCreateUpdateSerializer,
        'create': LinkCreateUpdateSerializer
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
