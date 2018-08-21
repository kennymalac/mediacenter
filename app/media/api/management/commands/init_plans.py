from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from api.models import Plan


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        for plan in settings.PLANS.values():
            Plan.objects.get_or_create(
                **plan
            )
