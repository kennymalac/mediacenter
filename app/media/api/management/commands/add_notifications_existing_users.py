from django.core.management.base import BaseCommand, CommandError
from api.models import Account, setup_default_activity_notification_settings


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        for user in Account.objects.filter(notify_settings__isnull=True):
            print('Adding notificationsettings to {}'.format(user))
            setup_default_activity_notification_settings(user)
