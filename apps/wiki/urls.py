from django.conf.urls import patterns, url
from django.views.generic import RedirectView

from . import views


urlpatterns = patterns('',
    url(r'^$', RedirectView.as_view(url='main/')),
    url(r'^main/$', views.main, name='wiki_main'),
    url(r'^template/$', views.view_templates, name='templates'),
    url(r'^new_post/$', views.new_post, name='new_post'),
    url(r'^create_post/$', views.create_post, name='create_post'),

    url(
        r'^template_title_exists/$',
        views.template_title_exists,
        name='template_title_exists'
    ),
    url(r'^create_template/$', views.create_template, name='create_template'),
    url(r'^update_template/$', views.update_template, name='update_template'),
    url(r'^delete_template/$', views.delete_template, name='delete_template'),
)
