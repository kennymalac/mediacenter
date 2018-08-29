from django_filters import rest_framework as filters
from api.models import GroupForum, Discussion, Feed, Account, Interest, Place

class GroupForumFilter(filters.FilterSet):
    members = filters.ModelMultipleChoiceFilter(queryset=Account.objects.all())
    interests = filters.ModelMultipleChoiceFilter(queryset=Interest.objects.all())

    class Meta:
        model = GroupForum
        fields = ('name', 'members', 'interests')


class DiscussionFilter(filters.FilterSet):
    class Meta:
        model = Discussion
        fields = ('parent',)


class PlaceFilter(filters.FilterSet):
    owner = filters.ModelChoiceFilter(queryset=Account.objects.all())

    class Meta:
        model = Place
        fields = ('owner', )


class FeedFilter(filters.FilterSet):
    owner = filters.ModelChoiceFilter(queryset=Account.objects.all())

    class Meta:
        model = Feed
        fields = ('owner', )
