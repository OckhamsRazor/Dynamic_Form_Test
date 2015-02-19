from django.conf.urls import patterns, url
from django.views.generic import RedirectView

from . import views


urlpatterns = patterns('',
    url(r'^$', RedirectView.as_view(url='main/')),
    url(r'^main/$', views.main, name='wiki_main'),
    url(r'^new_post/$', views.new_post, name='new_post'),
    url(r'^create_post/$', views.create_post, name='create_post'),
)
