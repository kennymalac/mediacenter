# -*- coding: utf-8 -*-
# Generated by Django 1.11.12 on 2018-05-03 01:38
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_feed_content'),
    ]

    operations = [
        migrations.AlterField(
            model_name='feed',
            name='content',
            field=models.ManyToManyField(to='api.FeedContentItem'),
        ),
    ]
