"""Media Center URL Configuration"""
from django.conf.urls import include, url
from django.contrib import admin
from rest_framework.routers import DefaultRouter
from rest_framework_extensions.routers import ExtendedDefaultRouter
from rest_framework_jwt.views import obtain_jwt_token

from api.views import *
from ui.views import *

router = ExtendedDefaultRouter()
router.register(r'account', AccountViewSet)
router.register(r'activity', ActivityLogViewSet)
router.register(r'blogpost', BlogPostViewSet)
router.register(r'album', AlbumViewSet, base_name='album')\
      .register(
          r'media',
          MediaViewSet,
          base_name='albums-media',
          parents_query_lookups=['album']
      )
router.register(r'feed-content-type', FeedContentTypeViewSet, base_name='feed-content-type')
router.register(r'interest', InterestViewSet, base_name='interest')
router.register(r'place', PlaceViewSet, base_name='place')
router.register(r'profile', ProfileViewSet, base_name='profile')\
.register(
    r'comment',
    CommentViewSet,
    base_name='comments',
    parents_query_lookups=['user_profile']
)


router.register(
    r'content',
    FeedContentItemViewSet,
    base_name='content',
)\
.register(
    r'comment',
    CommentViewSet,
    base_name='comments',
    parents_query_lookups=['content_item']
)

router.register(
        r'stash',
        FeedContentStashViewSet
    )\
    .register(
        r'content',
        FeedContentStashItemViewSet,
        base_name='stash-content',
        parents_query_lookups=['stash']
    )

router.register(r'feed', FeedViewSet, base_name='feed')\
    .register(
        r'stash',
        FeedContentStashViewSet,
        base_name='feed-stash',
        parents_query_lookups=['feeds']
    )

router.register(r'discussion', DiscussionViewSet, base_name='discussion')
router.register(r'link', LinkViewSet, base_name='link')

router.register(r'group', GroupForumViewSet, base_name='group')


urlpatterns = [
    url(r'^$', VueView.as_view()),
    url(r'^admin/', admin.site.urls),
    # DEPRECATED #
    # url(r'^register/', RegisterView.as_view()),
    # url(r'^chat/', ChatView.as_view()),
    # url(r'^feed/', FeedView.as_view()),
    # url(r'^media/', MediaView.as_view()),
    url(r'^api-token-auth/', obtain_jwt_token),
    url(r'^api/', include(router.urls)),
]
