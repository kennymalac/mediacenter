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
    serializer_classes = {
        'default': AccountSerializer,
        'create': FullAccountSerializer,
    }
    queryset = Account.objects.all()
    # permission_classes

class ActivityLogViewSet(ModelViewSet):
    queryset = ActivityLog.objects.all()
    serializer_class = ActivityLogSerializer


class BlogPostViewSet(ModelViewSet):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer

# class MediaViewSet():
#   queryset = Media.objects.all()
#   serializer_class = MediaSerializer
 
