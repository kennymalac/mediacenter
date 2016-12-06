from django.db import models
from django.contrib.auth.models import UserManager

class AccountManager(UserManager):
    # def _create_user(self):
    #     pass

    def create_superuser(self, username, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)


class BlogPostManager(models.Manager):

    def delete_blog_posts(self):
        """Marks multiple blog posts for deletion"""
        pass
