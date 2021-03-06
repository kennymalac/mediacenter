# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2017-03-14 02:57
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_auto_20170228_0517'),
    ]

    operations = [
        migrations.AlterField(
            model_name='media',
            name='album',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to='api.Album'),
        ),
        migrations.AlterField(
            model_name='media',
            name='description',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='media',
            name='src',
            field=models.FileField(upload_to=''),
        ),
        migrations.AlterField(
            model_name='media',
            name='title',
            field=models.CharField(blank=True, max_length=140),
        ),
    ]
