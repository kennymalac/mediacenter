from django_filters import rest_framework as filters
from api.models import GroupForum, Account, Interest

class GroupForumFilter(filters.FilterSet):
    members = filters.ModelMultipleChoiceFilter(queryset=Account.objects.all())
    interests = filters.ModelMultipleChoiceFilter(queryset=Interest.objects.all())

    class Meta:
        model = GroupForum
        fields = ('members', 'interests')
