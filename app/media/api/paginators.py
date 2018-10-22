from itertools import chain
from operator import attrgetter
from collections import OrderedDict

from django.db.models import Q, Max, OuterRef, Subquery, Case, When
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import ParseError
from api.models import FeedContentItemType, FeedContentItem, FeedContentStashItem, Discussion, Comment


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000


class DiscussionPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class FeedPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class objectview(object):
    def __init__(self, d):
        self.__dict__ = d


class FeedContentItemSortingPaginationMixin(object):

    content_item_field_accessor = ''
    content_item_field = 'pk'
    count_override = None

    def get_ordering(self, request):
        ordering = request.query_params.get('order', '-updated')
        if ordering not in ('updated', '-updated', 'created', '-created'):
            raise ParseError('Ordering not valid')

        if ordering[0] == '-':
            reverse_ordering = '-'
            ordering = ordering[1:]
        else:
            reverse_ordering = ''

        return (ordering, reverse_ordering)


    # def get_paginated_response(self, data):
    #     return Response(OrderedDict([
    #         # Sorting by updated reduces the queryset for optimization purposes
    #         ('count', self.count_override or self.page.paginator.count),
    #         ('next', self.get_next_link()),
    #         ('previous', self.get_previous_link()),
    #         ('results', data)
    #     ]))

    def sort_by_updated(self, qs, ordering, reverse_ordering, items_size = None):
        self.count_override = qs.count()
        # TODO optimize by slicing the items - requires a custom Paginator class
        items_size = items_size or self.page_size

        ordering = '{}updated'.format(reverse_ordering)

        topic_type = FeedContentItemType.objects.get(name=FeedContentItemType.TOPIC)

        # Topics need to be sorted by either their latest child's date or
        # in the case of no post children, by their created date
        # content_item__content_type =

        content_type_is_topic = Q(**{"{}content_type".format(self.content_item_field_accessor): topic_type})
        comments_isnull = Q(**{"{}comments__isnull".format(self.content_item_field_accessor): True})

        topic_item_pks = qs.filter(content_type_is_topic)\
                           .values_list('{}id'.format(self.content_item_field_accessor), flat=True)

        newest_posts = Discussion.objects.filter(parent=OuterRef('pk')).order_by('{}content_item__created'.format(reverse_ordering))
        topic_parent_items = [objectview(dict(id=item[0], updated=item[1])) for item in
                              Discussion.objects.filter(posts__isnull=False, content_item__in=topic_item_pks)\
                              .annotate(updated=Max(Subquery(newest_posts.values('content_item__created')[:1])))\
                              # TODO optimize by slicing the items - requires a custom Paginator class
                              .order_by(ordering)\
                              #[:items_size]\
                              .values_list('content_item', 'updated')]

        topic_other_items = [objectview(dict(id=item[0], updated=item[1])) for item in
                             Discussion.objects.filter(posts__isnull=True, content_item__in=topic_item_pks)\
                             .annotate(updated=Max('content_item__created'))\
                             # TODO optimize by slicing the items - requires a custom Paginator class
                             .order_by(ordering)\
                             #[:items_size]\
                             .values_list('content_item', 'updated')]

        # [print('a', item.__dict__) for item in chain(topic_parent_items, topic_other_items)]

        newest_comments = Comment.objects.filter(content_item=OuterRef('{}pk'.format(self.content_item_field_accessor))).order_by('{}created'.format(reverse_ordering))
        qs_comments = [objectview(dict(id=item[0], updated=item[1])) for item in
                       qs.exclude(content_type_is_topic).filter(~comments_isnull)\
                       .annotate(updated=Max(Subquery(newest_comments.values('created')[:1])))\
                       # TODO optimize by slicing the items - requires a custom Paginator class
                       .order_by(ordering)\
                       #[:items_size]
                       .values_list(self.content_item_field, 'updated')]

        qs_no_comments = [objectview(dict(id=item[0], updated=item[1])) for item in
                          qs.exclude(content_type_is_topic).filter(comments_isnull)\
                          .annotate(updated=Max('{}created'.format(self.content_item_field_accessor)))\
                          # TODO optimize by slicing the items - requires a custom Paginator class
                          .order_by(ordering)\
                          #[:items_size]\
                          .values_list(self.content_item_field, 'updated')]

        # [print('b', item.__dict__) for item in chain(qs_comments, qs_no_comments)]

        # Now get all items and sort by the annotated fields
        return [item.id for item in sorted(
            chain(topic_parent_items, topic_other_items, qs_no_comments, qs_comments),
            key=attrgetter('updated'), reverse=(reverse_ordering == '-'))]


class FeedContentItemPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class FeedContentItemSortedPagination(FeedContentItemSortingPaginationMixin, PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

    def paginate_queryset(self, qs, request, view=None):
        ordering, reverse_ordering = self.get_ordering(request)

        if ordering not in ('updated', '-updated'):
            qs = qs.order_by('{}{}'.format(reverse_ordering, ordering))
            # No need to convert the queryset
            items = qs

        else:
            content_item_pks = self.sort_by_updated(qs, ordering, reverse_ordering)

            items = FeedContentItem.objects.filter(pk__in=content_item_pks)\
                                           .order_by(Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(content_item_pks)]))


        return super(FeedContentItemSortedPagination, self).paginate_queryset(items, request, view)


class FeedContentStashItemPagination(FeedContentItemSortingPaginationMixin, PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

    content_item_field_accessor = 'item__'
    content_item_field = 'item'

    def paginate_queryset(self, qs, request, view=None):
        ordering, reverse_ordering = self.get_ordering(request)

        start = int(request.query_params.get(self.page_query_param, 1)) * self.page_size - self.page_size
        num_pinned = qs.filter(is_pinned=True).count()
        num_pinned_items = max(0, num_pinned - start)

        if ordering not in ('updated', '-updated'):
            qs = qs.order_by('-is_pinned', 'order', '{}item__{}'.format(reverse_ordering, ordering))
            # No need to convert the queryset
            items = qs

        else:
            content_item_pks = self.sort_by_updated(qs, ordering, reverse_ordering, self.page_size - num_pinned_items)

            # Prepend pinned items to the page
            if num_pinned_items:
                content_item_pks = list(qs.filter(is_pinned=True).order_by('order')[start:num_pinned_items+start]\
                                     .values_list('item__pk', flat=True)) + content_item_pks

            #print((reverse_ordering == '-'), content_item_pks)

            items = FeedContentStashItem.objects.filter(item__in=content_item_pks)\
                                                .order_by(Case(*[When(item__pk=pk, then=pos) for pos, pk in enumerate(content_item_pks)]))

        return super(FeedContentStashItemPagination, self).paginate_queryset(items, request, view)


class NotificationPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100
