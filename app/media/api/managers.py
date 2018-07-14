import requests
from django.conf import settings
from django.db import models
from django.contrib.auth.models import UserManager
#from django.contrib.gis.db.models.functions import Distance, AsGeoJSON


class PlaceManager(models.Manager):
    def other_places(self, place, restriction):
        # TODO configurable place distance, multiple places
        geo_request = requests.post('{}/location/distance-radius'.format(settings.GEOLOCATION_API), json={ 'place_id': place.id, 'distance': float(restriction.max_distance), 'unit': 'mi' })
        if geo_request.status_code != 200:
            return []

        # Either the content has no configured Place, or the place is within the place restriction's radius
        allowed_places = geo_request.json()['results']
        print(allowed_places)
        allowed_places.append(place.id)
        return allowed_places


class AccountManager(UserManager):
    # def _create_user(self):
    #     pass

    def create_superuser(self, username, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

    def modify_user_settings(self, modified_settings):
        pass


class BlogPostManager(models.Manager):

    def delete_blog_posts(self):
        """Marks multiple blog posts for deletion"""
        pass
