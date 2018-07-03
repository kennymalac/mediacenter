from django.db import models
from django.contrib.auth.models import UserManager
#from django.contrib.gis.db.models.functions import Distance, AsGeoJSON



# class PlaceManager(models.Manager):
#     def (place, distance):
#         return self.annotate(distance=distance(''))


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
