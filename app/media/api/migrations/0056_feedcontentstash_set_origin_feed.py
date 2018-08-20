# -*- coding: utf-8 -*-
# Generated by Django 1.11.11 on 2018-08-19 23:19
from __future__ import unicode_literals

from django.db import migrations


def forwards_func(apps, schema_editor):
    alias = schema_editor.connection.alias
    FeedContentStashes = apps.get_model('api', 'FeedContentStash').objects.using(alias)

    for stash in FeedContentStashes.all():
        stash.origin_feed = stash.feeds.first()
        stash.save()

def backwards_func(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0055_feedcontentstash_origin_feed'),
    ]

    operations = [
        migrations.RunPython(
            forwards_func
        )
    ]
