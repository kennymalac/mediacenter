from huey import crontab
from huey.contrib.djhuey import task, db_task, db_periodic_task

from api.models import Notification, NotificationSubscription, Discussion

@db_task()
def push_notification(log, subscription, subtype):
    notification = Notification.objects.create(log=log, subtype=subtype)

    # Instant delivery
    subscription.current_notifications.add(notification)
    if subscription.frequency == 'I':
       send_notification(notification, subscription.web_delivery, subscription.email_delivery)

# @db_task
# def push_reply_posted_topic(log, context):
#     pass

@db_task()
def push_notifications(log):
    '''Processes activity log into Notifications sent to those affected'''
    if log.action == 'Post00':
        # Create a Notification for each Subscription that is waiting for this

        affected_topic_owner = Discussion.objects.get(id=log.context['instance']).parent.content_item.owner.id
        s_qs = NotificationSubscription.objects.filter(owner=affected_topic_owner)

        # TODO any user should be able to subscribe to this topic
        # topic.subscribers
        [push_notification(log, sub, 'Reply00') for sub in s_qs]

@db_task()
def send_notification(notification, send_web, send_email):
    #
    #if send_email:
    #    send_mail()
    notification.deferred = False
    notification.save()

@task
def send_notifications(subscription):
    #subscription.current_s
    pass

# @db_periodic_task(crontab(day='*/1'))
# def push_daily_notifications():
#     '''Sends out daily Notifications'''
#     subs = NotificationSubscription.objects.filter(frequency='D', current_notifications__isempty=False)
#     for sub in subs:
#         send_notifications(sub)

# @db_periodic_task(crontab(day='*/7'))
# def push_weekly_notifications():
#     '''Send out weekly Notifications'''
#     subs = NotificationSubscription.objects.filter(frequency='W', current_notifications__isempty=False)
#     for sub in subs:
#         send_notifications(sub)


# @db_periodic_task(crontab(day='*/31'))
# def clear_notifications():
#     pass
