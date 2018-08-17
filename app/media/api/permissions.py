from rest_framework import permissions

class IsOwnerOrPublicOrGroupMemberOrUnlisted(permissions.BasePermission):

    account_field_name = 'owner'

    def has_object_permission(self, request, view, obj):
        if obj.visibility == '0' or getattr(obj, self.account_field_name) == request.user:
            return True
        else:
            # TODO better roles mechanism
            groups = obj.groupforum_set
            if groups.count():
                if request.user in groups.first().members:
                    return True
            # Unlisted is viewable
            elif obj.visibility != '9':
                return True
            else:
                return False


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
    account_field_name = 'owner'

    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'content_item'):
            return obj.content_item.owner == request.user
        return getattr(obj, self.account_field_name) == request.user


class IsOwnerAccount(IsOwner):
    account_field_name = 'account'



