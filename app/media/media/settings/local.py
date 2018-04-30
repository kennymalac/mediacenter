from media.settings.base import *

# Database
# https://docs.djangoproject.com/en/1.10/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'sqlite'
    }
}

TURN_SECRET = b'mediacenterSECRET'

CORS_ORIGIN_WHITELIST = (
    'localhost:8080',
    '127.0.0.1:8080'
)
