from django.conf.urls import patterns, url
from django.views.generic import RedirectView

from . import views


urlpatterns = patterns('',
    url(r'^$', RedirectView.as_view(url='main/')),
    url(r'^main/$', views.main, name='wiki_main'),

    url(r'^new_post/$', views.new_post, name='new_post'),
    url(r'^create_post/$', views.create_post, name='create_post'),

    url(r'^template/main/$', views.view_templates, name='template_main'),
    url(
        r'^template/(?P<template_id>[a-f\d]{24})/$',
        views.template,
        name='template'
    ),
    url(
        r'^template_title_exists/$',
        views.template_title_exists,
        name='template_title_exists'
    ),
    url(r'^create_template/$', views.create_template, name='create_template'),
    url(r'^read_template/$', views.read_template, name='read_template'),
    url(r'^update_template/$', views.update_template, name='update_template'),
    url(r'^delete_template/$', views.delete_template, name='delete_template'),

    url(
        r'^choice_title_exists/$',
        views.choice_title_exists,
        name='choice_title_exists'
    ),
    url(r'^create_choice/$', views.create_choice, name='create_choice'),
    url(r'^read_choice_all/$', views.read_choice_all, name='read_choice_all'),
    url(r'^read_choice/$', views.read_choice, name='read_choice'),
    url(r'^update_choice/$', views.update_choice, name='update_choice'),
    url(r'^delete_choice/$', views.delete_choice, name='delete_choice'),
)
