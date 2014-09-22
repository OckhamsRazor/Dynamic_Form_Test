from django.conf.urls import patterns, url
from django.views.generic import RedirectView

from . import views
from .models import HASH_KEY_LENGTH

urlpatterns = patterns('',
    url(r'^$', RedirectView.as_view(url='settings/')),
    url(r'^login/$', views.login_request, name='login_req'),
    url(r'^logout/$', views.logout_request, name='logout_req'),
    url(r'^settings/$', views.settings, name='user_settings'),
    url(r'^settings/admin/$', views.admin, name='admin_settings'),
    url(r'^signup/$', views.new_account, name='sign_up_req'),
    url(r'^check/$', views.new_account_existence_checking, name='sign_up_exist_check'),
    url(
        r'^activate/(?P<code>[A-Za-z0-9]{%d})$' % HASH_KEY_LENGTH,
        views.email_activation, name='email_activation'
    ),
    url(r'^upload_avatar/$', views.upload, name='upload_avatar'),
    url(r'^crop_avatar/$', views.crop_avatar, name='crop_avatar'),
    url(r'^show_profile_pics/$', views.show_profile_pics, name='show_profile_pics'),
    url(r'^change_password/$', views.change_password, name='change_password'),

    # for ADMIN only
    url(r'^generate_user/$', views.generate_user_request, name='generate_user_request'),
)
