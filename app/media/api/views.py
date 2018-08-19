import requests
import json
from decimal import Decimal

from django.db.models import Q
from django.shortcuts import render, get_object_or_404
from django.conf import settings
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, CreateModelMixin, UpdateModelMixin, DestroyModelMixin
from rest_framework.filters import SearchFilter
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, list_route, detail_route, parser_classes, action
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework_extensions.mixins import NestedViewSetMixin

from api.models import *
from api.serializers import *
from api.filters import *
from api.paginators import *
from api.permissions import *


class MultipleSerializerMixin(object):
    def get_serializer_class(self):
        try:
            if hasattr(self, 'action'):
                if self.action in self.serializer_classes:
                    return self.serializer_classes[self.action]
            return self.serializer_classes['default']
        except (KeyError, AttributeError):
            return super(MultipleSerializerMixin, self).get_serializer_class()

class ActionPermissionClassesMixin(object):
    def get_permissions(self):
        if self.action_permission_classes:
            if self.action in self.action_permission_classes:
                permissions = self.action_permission_classes[self.action]
            else:
                permissions = self.action_permission_classes['default']

            return [permission() for permission in permissions]

        return super(ActionPermissionClassesMixin, self).get_permissions()


class VisibilityViewSetMixin(object):
    visibility_field = 'visibility'
    owner_field = 'owner'

    def _request_owner(self):
        '''Returns dict to filter by the request user'''
        _d = {}
        _d[self.owner_field] = self.request.user
        return _d

    def _visibility(self, visibility='9'):
        '''Returns dict to filter by a certain visibility'''
        _d = {}
        _d[self.visibility_field] = visibility
        return _d

    def get_queryset(self):
        qs = super(VisibilityViewSetMixin, self).get_queryset()

        self._is_authenticated = self.request.user.is_authenticated()
        if self._is_authenticated:
            # Either the user owns these objects or it is NOT private
            qs = qs.filter(Q(**self._request_owner()) | ~Q(**self._visibility()))

            if self.action == 'list':
                # Either the user owns these objects or it is public
                qs = qs.filter(Q(**self._request_owner()) | Q(**self._visibility('0')))
        else:
            qs = qs.filter(~Q(**self._visibility()))

            if self.action == 'list':
                qs = qs.filter(Q(**self._visibility('0')))

        return qs


class FeedContentItemVisibilityViewSetMixin(VisibilityViewSetMixin):
    owner_field = 'content_item__owner'
    visibility_field = 'content_item__visibility'

    def get_queryset(self, **kwargs):
        qs = super(FeedContentItemVisibilityViewSetMixin, self).get_queryset()

        return qs.restrict_local(
            user=self.request.user, allowed_places=[])


class GroupVisibilityViewSetMixin(VisibilityViewSetMixin):
    visibility_field = 'feed__visibility'

    def get_queryset(self, **kwargs):
        qs = super(GroupVisibilityViewSetMixin, self).get_queryset()

        if kwargs.get('restrict_places', True):
            return qs.restrict_local(
                user=self.request.user, allowed_places=[])
        return qs


class FeedContentStashVisibilityViewSetMixin(VisibilityViewSetMixin):
    owner_field = 'feeds__owner__in'

    def _request_owner(self):
        '''Returns dict to filter by the request user'''
        _d = {}
        _d[self.owner_field] = (self.request.user,)
        return _d


class AccountViewSet(ActionPermissionClassesMixin,
                     MultipleSerializerMixin,
                     ModelViewSet):
    """An API for viewing and editing accounts"""
    # TODO paginate
    queryset = Account.objects.filter(profile__isnull=False)
    serializer_classes = {
        'default': AccountSerializer,
        'create': FullAccountSerializer,
        'profile': PrivateAccountProfileDetailsSerializer
    }

    filter_backends = (SearchFilter,)
    search_fields = ('username',)
    action_permission_classes = {
        'default': [IsAuthenticated],
        'retrieve': [AllowAny],
        'partial_update': [IsThisUser],
        'update': [IsThisUser],
        'create': [AllowAny],
        'destroy': [IsThisUser]
    }

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


class InterestViewSet(ActionPermissionClassesMixin,
                      ListModelMixin,
                      RetrieveModelMixin,
                      CreateModelMixin,
                      GenericViewSet):
    queryset = Interest.objects.all()
    serializer_class = InterestSerializer
    filter_backends = (SearchFilter,)
    search_fields = ('name',)
    action_permission_classes = {
        'default': [IsAuthenticated],
        'list': [],
        'retrieve': []
    }


class PlaceViewSet(ActionPermissionClassesMixin,
                   ListModelMixin,
                   RetrieveModelMixin,
                   DestroyModelMixin,
                   GenericViewSet):
    queryset = Place.objects.all()
    serializer_class = PlaceSerializer
    filter_class = PlaceFilter
    action_permission_classes = {
        'default': [IsAuthenticated, IsOwner],
        'create': [IsAuthenticated],
        'destroy': [IsAuthenticated, IsOwner]
    }

    def get_queryset(self):
        qs = super(PlaceViewSet, self).get_queryset()

        return qs.filter(owner=self.request.user)

    @list_route(methods=['POST'], url_path='connect')
    def connect(self, request, *args, **kwargs):
        position = request.data.get('position', None)
        if not position:
            return Response({
                'error': 'No position provided'
            }, status=400)

        home = Place.objects.create(name="Home", owner=request.user)
        home.save()

        coords = position['coordinates']

        try:
            # Add position to geolocation microservice
            geo_request = requests.put('{}/location/'.format(settings.GEOLOCATION_API), json={ 'latitude': coords[1], 'longitude': coords[0], 'place_id': home.id })
            if geo_request.status_code != 201:
                home.delete()
                return Response({
                    'error': 'Something went wrong, please try again later'
                }, status=500)
        except requests.exceptions.ConnectionError as e:
            home.delete()
            return Response({
                'error': 'Something went wrong, please try again later'
            }, status=500)

        PlaceRestriction.objects.create(place=home, max_distance=Decimal("50"))

        # Setup a Feed with this Place as its filter
        feed = Feed.objects.create(name="Home", icon="ion-ios-home", owner=request.user, description="Content from your local area", visibility='9')
        feed.places.add(home)
        home.default_feed = feed
        feed.save()
        home.save()

        return Response(self.get_serializer(home).data)


class ProfileViewSet(ActionPermissionClassesMixin,
                     MultipleSerializerMixin,
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
    action_permission_classes = {
        'default': [IsAuthenticated, IsOwnerAccount],
        'list': [IsAuthenticated],
        'retrieve': [AllowAny],
        'update': [IsAuthenticated, IsOwnerAccount],
        'partial_update': [IsAuthenticated, IsOwnerAccount]
    }

    filter_fields = ('interests',)


class FeedViewSet(NestedViewSetMixin,
                  VisibilityViewSetMixin,
                  ActionPermissionClassesMixin,
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
    action_permission_classes = {
        'default': [IsAuthenticated, IsOwnerOrPublicOrGroupMemberOrUnlisted],
        'update': [IsAuthenticated, IsOwner],
        'partial_update': [IsAuthenticated, IsOwner],
        'create': [IsAuthenticated],
        'destroy': [IsAuthenticated, IsOwner]
    }
    filter_class = FeedFilter
    pagination_class = FeedContentItemPagination

    def list(self, request):
        if 'owner' in request.query_params:
            owner_id = request.query_params['owner']
            if int(owner_id) == request.user.id and Feed.objects.filter(owner=request.user, default_owner_feed=True).count() == 0:
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
    pagination_class = FeedContentItemPagination

    def get_serializer(self, *args, **kwargs):
        """
        Return the serializer instance that should be used for validating and
        deserializing input, and for serializing output.
        """
        serializer_class = self.get_serializer_class()
        if 'extra_context' in kwargs:
            # Put this into the serializer
            extra_context = kwargs.pop('extra_context')
        else:
            extra_context = {}
        kwargs['context'] = {**self.get_serializer_context(), **extra_context}
        return serializer_class(*args, **kwargs)

    @list_route(methods=['POST'], url_path='search', permission_classes=[IsAuthenticated])
    def search(self, request):
        content_queryset = self.get_queryset().filter(Q(visibility='0') | Q(owner=request.user))

        _feed_id = request.data.get('feed', None)
        if _feed_id:
            feed = get_object_or_404(Feed, pk=_feed_id)

            if feed.default_owner_feed:
                content_queryset = content_queryset.filter(owner=feed.owner)

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

        serializer = self.get_serializer(self.paginate_queryset(content_queryset), many=True, extra_context={'allowed_places': allowed_places})


        return self.get_paginated_response(serializer.data)


class FeedContentStashItemViewSet(NestedViewSetMixin,
                                  MultipleSerializerMixin,
                                  ModelViewSet):

    queryset = FeedContentStashItem.objects.all()
    serializer_classes = {
        'default': FeedContentStashItemSerializer,
        'partial_update': FeedContentItemCreateUpdateSerializer,
        'update': FeedContentStashCreateUpdateSerializer,
        # 'create': FeedContentStashCreateUpdateSerializer
    }

class FeedContentStashViewSet(NestedViewSetMixin,
                              FeedContentStashVisibilityViewSetMixin,
                              ActionPermissionClassesMixin,
                              MultipleSerializerMixin,
                              ModelViewSet):

    queryset = FeedContentStash.objects.all()
    serializer_classes = {
        'default': FeedContentStashSerializer,
        'partial_update': FeedContentStashCreateUpdateSerializer,
        'update': FeedContentStashCreateUpdateSerializer,
        'create': FeedContentStashCreateUpdateSerializer,
        'content': FeedContentStashContentSerializer
    }
    action_permission_classes = {
        'default': [IsAuthenticated, IsPublicOrUnlisted],
        'update': [IsAuthenticated], # TODO
        'partial_update': [IsAuthenticated], # TODO
        'create': [IsAuthenticated],
        'destroy': [IsAuthenticated] # TODO
    }

    pagination_class = StandardResultsSetPagination


    @action(methods=['GET'], detail=True, permission_classes=[IsAuthenticated])
    def content(self, request, pk=None, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @detail_route(methods=['POST'], url_path='content/add', permission_classes=[IsAuthenticated])
    def add_content(self, request, pk=None, **kwargs):
        instance = self.queryset.get(pk=pk)
        feed_parent_pk = kwargs.get('parent_lookup_feeds', False)
        require_private = False

        content = None
        if feed_parent_pk:
            # All content must be private
            feed = Feed.objects.get(id=feed_parent_pk)
            require_private = feed.visibility == '9'

            if feed.default_owner_feed and feed.owner != request.user:
                return Response({
                    'error': 'You do not have permission to add content to this stash'
                }, status=403)

            elif feed.groupforum_set.count():
                # Check if this feed has at least one group that can accept this content
                if not feed.groupforum_set.filter(members__in=[self.request.user]).count():
                    return Response({
                        'error': 'You do not have permission to add content to this stash'
                    }, status=403)

        # TODO get feed, verify feed membership/post permission
        # if instance.owner:
        #     return Response({
        #         'error': ''
        #     }, status=403)

        content_pks = request.data.get('content', [])
        content = FeedContentItem.objects.filter(pk__in=content_pks)
        # All content without an origin stash now default to being shown in this stash
        new_content = content.filter(origin_stash__isnull=True)

        for item in new_content:
            item.origin_stash = instance
            if require_private:
                item.visibility = '9'

            item.save()

            content_type = item.content_type.name
            if content_type == FeedContentItemType.TOPIC:
                log = ActivityLog.objects.create(action='Topic00', author=item.owner, context={'instance': get_content_id(item), 'group': get_group_id_name(item)[0], 'stash': item.origin_stash.id}, message="Created topic")
                log.subscribed=[]
            elif content_type == FeedContentItemType.POST:
                log = ActivityLog.objects.create(action='Post00', author=item.owner, context={'instance': get_content_id(item), 'group': get_group_id_name(item)[0], 'stash': item.origin_stash.id}, message="Created post")
                log.subscribed=[]
            elif content_type == FeedContentItemType.LINK:
                log = ActivityLog.objects.create(action='Link00', author=item.owner, context={'instance': get_content_id(item), 'feed': get_feed_id(item), 'stash': item.origin_stash.id}, message="Created post")
                log.subscribed=[]
            elif content_type == FeedContentItemType.IMAGE:
                log = ActivityLog.objects.create(action='Image00', author=item.owner, context={'instance': get_content_id(item), 'feed': get_feed_id(item), 'stash': item.origin_stash.id}, message="Created image")
                log.subscribed=[]


        stashed_content = FeedContentStashItem.objects.bulk_create([
            FeedContentStashItem(item=item, stash=instance) for item in content
        ])

        data_content = FeedContentStashItemSerializer(stashed_content, many=True)
        return Response({ 'content': data_content.data })


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
                        FeedContentItemVisibilityViewSetMixin,
                        ActionPermissionClassesMixin,
                        MultipleSerializerMixin,
                        ModelViewSet):

    queryset = Discussion.objects.all().order_by('order')
    serializer_classes = {
        'default': DiscussionSerializer,
        'partial_update': DiscussionCreateUpdateSerializer,
        'update': DiscussionCreateUpdateSerializer,
        'create': DiscussionCreateUpdateSerializer
    }
    action_permission_classes = {
        'default': [IsAuthenticated, IsContentItemOwnerOrPublicOrUnlisted],
        'update': [IsAuthenticated, IsOwner],
        'partial_update': [IsAuthenticated, IsOwner],
        # TODO create in group should check if group member
        'create': [IsAuthenticated],
        'destroy': [IsAuthenticated, IsOwner]
    }
    pagination_class = DiscussionPagination
    filter_class = DiscussionFilter


class LinkViewSet(NestedViewSetMixin,
                  FeedContentItemVisibilityViewSetMixin,
                  ActionPermissionClassesMixin,
                  MultipleSerializerMixin,
                  ModelViewSet):

    queryset = Link.objects.all().order_by('content_item__created')
    serializer_classes = {
        'default': LinkSerializer,
        'partial_update': LinkCreateUpdateSerializer,
        'update': LinkCreateUpdateSerializer,
        'create': LinkCreateUpdateSerializer
    }
    action_permission_classes = {
        'default': [IsAuthenticated, IsContentItemOwnerOrPublicOrUnlisted],
        'update': [IsAuthenticated, IsOwner],
        'partial_update': [IsAuthenticated, IsOwner],
        # TODO create in group should check if group member
        'create': [IsAuthenticated],
        'destroy': [IsAuthenticated, IsOwner]
    }
    pagination_class = FeedContentItemPagination


class ImageViewSet(NestedViewSetMixin,
                   FeedContentItemVisibilityViewSetMixin,
                   ActionPermissionClassesMixin,
                   MultipleSerializerMixin,
                   ModelViewSet):

    queryset = Image.objects.all().order_by('content_item__created')
    serializer_classes = {
        'default': ImageSerializer,
        'partial_update': ImageCreateUpdateSerializer,
        'update': ImageCreateUpdateSerializer,
        'create': ImageCreateUpdateSerializer
    }
    action_permission_classes = {
        'default': [IsAuthenticated, IsContentItemOwnerOrPublicOrUnlisted],
        'update': [IsAuthenticated, IsOwner],
        'partial_update': [IsAuthenticated, IsOwner],
        # TODO create in group should check if group member
        'create': [IsAuthenticated],
        'destroy': [IsAuthenticated, IsOwner]
    }
    pagination_class = FeedContentItemPagination


class GroupForumViewSet(NestedViewSetMixin,
                        GroupVisibilityViewSetMixin,
                        ActionPermissionClassesMixin,
                        MultipleSerializerMixin,
                        ModelViewSet):

    queryset = GroupForum.objects.all().order_by('feed__created')
    serializer_classes = {
        'default': GroupForumSerializer,
        'partial_update': GroupForumCreateUpdateSerializer,
        'update': GroupForumCreateUpdateSerializer,
        'create': GroupForumCreateUpdateSerializer
    }
    # NOTE we should probably allow private groups to be listed if the user is a member
    action_permission_classes = {
        'default': [IsAuthenticated, IsOwner],
        'retrieve': [AllowAny],
        'list': [IsAuthenticated],
        'create': [IsAuthenticated]
    }
    filter_class = GroupForumFilter
    pagination_class = DiscussionPagination

    @list_route(methods=['POST'], url_path='search', permission_classes=[IsAuthenticated])
    def search(self, request):
        group_queryset = self.get_queryset(restrict_places=False)

        place_id = request.data.get('place', 0)
        if place_id:
            user_places = Place.objects.filter(owner=request.user, id=place_id)
            if user_places.count() > 0:
                # TODO configurable place distance, multiple places
                place = user_places.first()
                restriction = PlaceRestriction.objects.filter(place=place).first()
                allowed_places = Place.objects.other_places(place, restriction)

                if len(allowed_places) == 0:
                    group_queryset = group_queryset.filter(feed__places__isnull=True)
                else:
                    group_queryset = group_queryset.filter(feed__places__in=allowed_places)

            else:
                return Response({
                    'error': 'Unauthorized search parameters'
                }, status=400)
        else:
            group_queryset = group_queryset.filter(feed__places__isnull=True)

        interests = Interest.objects.filter(id__in=request.data.get('interests', []))

        if interests.count():
            group_queryset = group_queryset.filter(feed__interests__in=interests)

        # NOTE private groups shouldn't show in list action either
        # TODO make default list action more secure
        serializer = GroupForumSerializer(group_queryset.filter(feed__visibility='0'), many=True)
        return Response(serializer.data)

    @detail_route(methods=['POST'], url_path='join', permission_classes=[IsAuthenticated])
    def join(self, request, pk=None):
        instance = self.queryset.get(pk=pk)

        if instance.is_restricted:
            # TODO detect invite
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
