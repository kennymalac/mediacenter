from django.shortcuts import render
from django.views.generic import TemplateView
from django_countries.data import COUNTRIES


class VueView(TemplateView):
    # Let's try this out B-)
    template_name = 'program.html'

class RegisterView(TemplateView):
    template_name = 'register.html'

    def countries(self):
        return [value for (key, value) in sorted(COUNTRIES.items())]

class MediaView(TemplateView):
    template_name = 'media-gallery.html'

class FeedView(TemplateView):
    template_name = 'feed.html'

class ChatView(TemplateView):
    template_name = 'chat.html'
