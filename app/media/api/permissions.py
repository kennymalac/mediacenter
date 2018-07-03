from rest_framework import permissions

class IsPublicOrGroupMemberOrOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if obj.visibility == '0' or obj.owner == request.user:
            return True
        else:
            # TODO better roles mechanism
            group = obj.feed.groupforum
            if group and request.user in group.members:
                return True
            else:
                return False

