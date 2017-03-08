from django.contrib import admin
from .models import Account, Media, Album, MediaTag, AlbumTag


class AccountAdmin(admin.ModelAdmin):
    search_fields = ('first_name', 'last_name', 'email', 'country')
    fields = ('first_name', 'last_name', 'email', 'country', 'account_settings')
    list_display = ('first_name', 'email', 'country')


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


admin.site.register(Account, AccountAdmin)
admin.site.register(MediaTag, MediaTagAdmin)
admin.site.register(Media, MediaAdmin)
admin.site.register(AlbumTag, AlbumTagAdmin)
admin.site.register(Album, AlbumAdmin)

