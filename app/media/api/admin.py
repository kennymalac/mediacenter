from django.contrib import admin
from .models import Media, Album, MediaTag, AlbumTag


class MediaTagAdmin(admin.ModelAdmin):
    search_fields = ('name',)
    fields = ('name',)
    list_display = ('name',)

class MediaAdmin(admin.ModelAdmin):
    search_fields = ["title"]
    list_display = ('title', 'media_type', 'hidden')
    fields = ('title', 'description', 'media_type', 'hidden', 'tags')


class AlbumTagAdmin(admin.ModelAdmin):
    search_fields = ('name',)
    fields = ('name',)
    list_display = ('name',)

class AlbumAdmin(admin.ModelAdmin):
    search_fields = ["title"]
    list_display = ('title',)
    fields = ('title', 'description', 'owner', 'access_level', 'unlisted')


admin.site.register(MediaTag, MediaTagAdmin)
admin.site.register(Media, MediaAdmin)
admin.site.register(AlbumTag, AlbumTagAdmin)
admin.site.register(Album, AlbumAdmin)

