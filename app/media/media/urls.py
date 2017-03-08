"""Media Center URL Configuration"""
from django.conf.urls import include, url
from django.contrib import admin
from rest_framework.routers import DefaultRouter
from rest_framework_extensions.routers import ExtendedDefaultRouter
from rest_framework_jwt.views import obtain_jwt_token

from api.views import *
from ui.views import *

router = ExtendedDefaultRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'activitylogs', ActivityLogViewSet)
router.register(r'blogposts', BlogPostViewSet)
router.register(r'album', AlbumViewSet, base_name='album')\
      .register(
          r'media',
          MediaViewSet,
          base_name='albums-media',
          parents_query_lookups=['album__media']
      )


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
