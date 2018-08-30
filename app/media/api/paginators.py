from itertools import chain
from operator import attrgetter

from django.db.models import Max, OuterRef, Subquery, Case, When
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import ParseError
from api.models import FeedContentItemType, FeedContentStashItem, Discussion, Comment


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


class FeedContentItemPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class FeedContentStashItemPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

    def paginate_queryset(self, qs, request, view=None):
        ordering = request.query_params.get('order', '-updated')
        if ordering not in ('updated', '-updated', 'created', '-created'):
            raise ParseError('Ordering not valid')

        start = int(request.query_params.get(self.page_query_param, 1)) * self.page_size - self.page_size
        num_pinned = qs.filter(is_pinned=True).count()
        num_pinned_items = max(0, num_pinned - start)
        print(start, num_pinned, num_pinned_items)

        # The number of non-pinned item this page
        items_size = self.page_size - num_pinned_items

        if ordering[0] == '-':
            reverse_ordering = '-'
            ordering = ordering[1:]
        else:
            reverse_ordering = ''

        if ordering not in ('updated', '-updated'):
            qs = qs.order_by('-is_pinned', 'order', '{}item__{}'.format(reverse_ordering, ordering))
            ordered = True
            # No need to convert the queryset

            items = qs

        else:
            ordering = '{}updated'.format(reverse_ordering)
            topic_type = FeedContentItemType.objects.get(name=FeedContentItemType.TOPIC)

            # Topics need to be sorted by either their latest child's date or
            # in the case of no post children, by their created date
            topic_item_pks = qs.filter(item__content_type=topic_type)\
                                    .values_list('item__id', flat=True)

            # NOTE: pinned items need to ALWAYS show first

            # TODO optimize page size?

            newest_posts = Discussion.objects.filter(parent=OuterRef('pk')).order_by('{}content_item__created'.format(reverse_ordering))
            topic_parent_items = [objectview(dict(id=item[0], updated=item[1])) for item in
                                  Discussion.objects.filter(posts__isnull=False, content_item__in=topic_item_pks)\
                                  .annotate(updated=Max(Subquery(newest_posts.values('content_item__created')[:1])))\
                                  .order_by(ordering)[:items_size]\
                                  .values_list('content_item', 'updated')]

            topic_other_items = [objectview(dict(id=item[0], updated=item[1])) for item in
                                 Discussion.objects.filter(posts__isnull=True, content_item__in=topic_item_pks)\
                                 .annotate(updated=Max('content_item__created'))\
                                 .order_by(ordering)[:items_size]\
                                 .values_list('content_item', 'updated')]

            # [print('a', item.__dict__) for item in chain(topic_parent_items, topic_other_items)]

            newest_comments = Comment.objects.filter(content_item=OuterRef('item__pk')).order_by('{}created'.format(reverse_ordering))
            qs_comments = [objectview(dict(id=item[0], updated=item[1])) for item in
                           qs.exclude(item__content_type=topic_type).filter(item__comments__isnull=False)\
                           .annotate(updated=Max(Subquery(newest_comments.values('created')[:1])))\
                           .order_by(ordering)[:items_size]\
                           .values_list('item', 'updated')]

            qs_no_comments = [objectview(dict(id=item[0], updated=item[1])) for item in
                            qs.exclude(item__content_type=topic_type).filter(item__comments__isnull=True)\
                              .annotate(updated=Max('item__created'))\
                              .order_by(ordering)[:items_size]\
                              .values_list('item', 'updated')]

            # [print('b', item.__dict__) for item in chain(qs_comments, qs_no_comments)]

            # Now get all items and sort by the annotated fields
            content_item_pks = [item.id for item in sorted(
                chain(topic_parent_items, topic_other_items, qs_no_comments, qs_comments),
                key=attrgetter('updated'), reverse=(reverse_ordering == '-'))]

            # Prepend pinned items to the page
            if num_pinned_items:
                content_item_pks = list(qs.filter(is_pinned=True).order_by('order')[start:num_pinned_items+start]\
                                     .values_list('item__pk', flat=True)) + content_item_pks

            #print((reverse_ordering == '-'), content_item_pks)

            items = FeedContentStashItem.objects.filter(item__in=content_item_pks)\
                                                .order_by(Case(*[When(item__pk=pk, then=pos) for pos, pk in enumerate(content_item_pks)]))

        return super(FeedContentStashItemPagination, self).paginate_queryset(items, request, view)

