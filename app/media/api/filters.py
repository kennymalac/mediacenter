from django_filters import rest_framework as filters
from api.models import GroupForum, Account

class GroupForumFilter(filters.FilterSet):
    members = filters.ModelMultipleChoiceFilter(queryset=Account.objects.all())

    class Meta:
        model = GroupForum
        fields = ['members']
