import requests

from django.apps import apps
from django.conf import settings
from django.db import models
from django.db.models import Q
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

class LocalQuerySet(object):
    def restrict_local(self, **kwargs):
        allowed_places = kwargs.get('allowed_places', None)

        if allowed_places == None:
            allowed_places = []

            user = kwargs.get('user', None)
            if user and user.is_authenticated():
                # Find applicable places to this user's local area if they have one configured
                Place = apps.get_model('api.Place')
                PlaceRestriction = apps.get_model('api.PlaceRestriction')

                user_places = Place.objects.filter(owner=user)
                if user_places.count() > 0:
                    # TODO configurable place distance, multiple places
                    place = user_places.first()
                    restriction = PlaceRestriction.objects.filter(place=place).first()
                    allowed_places = Place.objects.other_places(place, restriction)

        qs_filter = {}
        qs_filter['{}__isnull'.format(self.places_field_name)] = True
        qs_filter2 = {}
        qs_filter2['{}__in'.format(self.places_field_name)] = allowed_places
        return self.filter(
            Q(**qs_filter) | Q(**qs_filter2))


class GroupForumQuerySet(LocalQuerySet, models.QuerySet):
    places_field_name = 'feed__places'


class FeedContentItemQuerySet(LocalQuerySet, models.QuerySet):
    places_field_name = 'content_item__places'


class FeedContentStashItemQuerySet(LocalQuerySet, models.QuerySet):
    places_field_name = 'item__places'


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
