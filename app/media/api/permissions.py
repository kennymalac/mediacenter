from operator import attrgetter

from django.db.models import Q
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework import permissions
from api.models import FeedContentItem, FeedContentStash, Profile

class IsOwnerOrPublicOrGroupMemberOrUnlisted(permissions.BasePermission):

    account_field_attr = 'owner'
    visibility_field_attr = 'visibility'
    group_check = True

    def has_object_permission(self, request, view, obj):
        if attrgetter(self.visibility_field_attr)(obj) == '0' or attrgetter(self.account_field_attr)(obj) == request.user:
            return True

        # TODO better roles mechanism
        if self.group_check and obj.groupforum_set.count():
            groups = obj.groupforum_set
            if groups.filter(members__in=[request.user]).count():
                return True

        # Unlisted is viewable
        elif attrgetter(self.visibility_field_attr)(obj) != '9':
            return True

        return False


class IsContentItemOwnerOrPublicOrUnlisted(IsOwnerOrPublicOrGroupMemberOrUnlisted):
    account_field_attr = 'content_item.owner'
    visibility_field_attr = 'content_item.visibility'
    group_check = False


class IsFeedContentStashItemOwnerOrPublicOrUnlisted(IsOwnerOrPublicOrGroupMemberOrUnlisted):
    account_field_attr = 'item.owner'
    visibility_field_attr = 'item.visibility'
    group_check = False


class IsParentNotPrivateOrParentOwner(object):
    owner_field_name = 'owner'

    def has_permission(self, request, view):
        qs_params = None
        parent_pk = view.kwargs.get('parent_lookup_{}'.format(self.parent_lookup), None)

        if not parent_pk:
            return False

        if request.user.is_authenticated():
            owner_params = {}
            owner_params[self.owner_field_name] = request.user
            qs_params = Q(**owner_params) | ~Q(visibility='9')
        else:
            qs_params = ~Q(visibility='9')

        if self.parent_model.objects.filter(Q(pk=parent_pk) & qs_params).exists():
            return True
        else:
            raise Http404

    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)


class IsParentFeedContentItemNotPrivateOrOwner(IsParentNotPrivateOrParentOwner,
                                               permissions.BasePermission):
    parent_model = FeedContentItem
    parent_lookup = "content_item"


class IsParentFeedContentStashNotPrivateOrOwner(IsParentNotPrivateOrParentOwner,
                                                permissions.BasePermission):
    parent_model = FeedContentStash
    parent_lookup = "stash"
    owner_field_name = "origin_feed__owner"


class IsPublicOrUnlisted(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.visibility in ('0', '1')

# TODO moderation system
class IsGroupModeratorOrOwner(permissions.BasePermission):
    pass


class IsThisUser(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj == request.user


class IsOwner(permissions.BasePermission):
    account_field_attr = 'owner'

    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'content_item'):
            return obj.content_item.owner == request.user
        return getattr(obj, self.account_field_attr) == request.user


class IsOriginFeedOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.origin_feed and obj.origin_feed.owner == request.user


class IsStashItemOriginFeedOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.stash.origin_feed and obj.stash.origin_feed.owner == request.user


class IsFeedContentStashItemOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.item.owner and obj.item.owner == request.user


class IsOwnerAccount(IsOwner):
    account_field_attr = 'account'


