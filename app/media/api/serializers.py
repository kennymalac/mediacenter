from api.models import *
from rest_framework import serializers
from django_countries.serializer_fields import CountryField

class AccountSerializer(serializers.ModelSerializer):
    country = CountryField()

    class Meta:
        model = Account
        fields = ('first_name', 'last_name', 'username', 'country', 'email')

class FullAccountSerializer(AccountSerializer):
    account_settings = serializers.JSONField(True)

    class Meta:
        model = Account
        fields = ('username', 'first_name', 'last_name', 'email', 'password', 'country', 'account_settings')

class LogSerializer(serializers.Serializer):
    created = serializers.DateTimeField()
    last_modified = serializers.DateTimeField()
    message = serializers.CharField(max_length=400, allow_blank=True)


class ActivityLogSerializer(serializers.Serializer):
    title = serializers.CharField()
    authors = serializers.ModelField(Account)
    logs = serializers.ModelField(Log)


class BlogPostSerializer(serializers.Serializer):
    title = serializers.CharField()
    slug = models.SlugField()
    # TODO create authors field validator
    authors = serializers.ListField(
        child=serializers.CharField()
    )
    body = serializers.CharField()
