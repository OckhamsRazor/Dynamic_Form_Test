from django.conf.urls import patterns, url
from django.views.generic import RedirectView

from . import views
from .models import UserActivation

urlpatterns = patterns('',
    url(r'^$', RedirectView.as_view(url='settings/')),
    url(r'^login/$', views.login_request, name='login_req'),
    url(r'^logout/$', views.logout_request, name='logout_req'),
    url(r'^settings/$', views.settings, name='user_settings'),
    url(r'^signup/$', views.new_account, name='sign_up_req'),
    url(r'^check/$', views.new_account_existence_checking, name='sign_up_exist_check'),
    url(r'^activate/$', views.email_activation_manual, name='email_activation_manual'),
    url(
        r'^activate/(?P<code>[A-Za-z0-9]{%d})$' % UserActivation.HASH_KEY_LENGTH,
        views.email_activation_link, name='email_activation_link'
    ),
    # for ADMIN only
    url(r'^generate_user/$', views.generate_user_request, name='generate_user_request'),
)
