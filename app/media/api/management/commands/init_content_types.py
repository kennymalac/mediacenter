from django.core.management.base import BaseCommand, CommandError
from api.models import FeedContentItemType


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        for ctype in FeedContentItemType.CONTENT_TYPES:
            FeedContentItemType.objects.get_or_create(name=ctype[1])
