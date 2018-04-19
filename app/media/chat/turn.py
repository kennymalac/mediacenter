import hmac
from base64 import b64encode
from hashlib import sha1
from calendar import timegm
from datetime import datetime, timedelta

from django.conf import settings


def createTurnAuth(username, userId):
    user = "{1}{2}:{0}".format(timegm((datetime.now() + timedelta(hours=24)).timetuple()), username, userId)
    return dict(
        user=user,
        password=b64encode(hmac.new(settings.TURN_SECRET, user.encode('ascii'), sha1).digest()).decode('ascii')
    )
