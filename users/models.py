# coding=utf-8
import datetime
import pytz
from os import path

from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from django.db import models

from celery import shared_task
from taggit.managers import TaggableManager

from Web import settings
from utils.models import IP_log, MyListField, MyEmbeddedModelField
from posts.models import Post

HASH_KEY_LENGTH = 30
ACTIVATION_EXPIRED_TIME = 3
SPECIAL_USER_VALID_SPAN = 180
DEFAULT_PROFILE_PIC = 'img/default.jpg'

def profile_pic_upload_path(instance, filename):
    return path.join(instance.user.username, "profile_pic", filename)

class MyUser(AbstractUser):
    NORMAL_USER = 0
    SHOP_OWNER = 1
    MODERATOR = 2
    TESTING = 99
    USER_TYPE_CHOICES = (
        (NORMAL_USER, 'Normal User'),
        (SHOP_OWNER, 'Shop Owner'),
        (MODERATOR, 'Moderator'),
        (TESTING, 'Testing_User'),
    )
    type = models.IntegerField(
        default=NORMAL_USER,
        choices=USER_TYPE_CHOICES,
    )
    profile_pic = models.ImageField(
        upload_to=profile_pic_upload_path,
        default=DEFAULT_PROFILE_PIC
    )
    login_ip = MyListField(MyEmbeddedModelField('IP_log'))
    special_user_data = MyListField()
    bookmarks = MyListField(models.ForeignKey(Post))

    activation_code = models.CharField(max_length=HASH_KEY_LENGTH)
    activation_code_expired_time = models.DateTimeField(
        default=timezone.now()+datetime.timedelta(days=ACTIVATION_EXPIRED_TIME)
    )

    def __init__(self, *args, **kwargs):
        self._meta.get_field(name="first_name").blank = False
        self._meta.get_field(name="last_name").blank = False
        self._meta.get_field(name="email").blank = False
        super(MyUser, self).__init__(*args, **kwargs)

    def __unicode__(self):
        return self.username

    def is_expired(self):
        return timezone.now() > pytz.UTC.localize(self.activation_code_expired_time)

    def is_activated(self):
        return len(self.activation_code) == 0

class UserProfilePic(models.Model):
    user = models.ForeignKey(MyUser, related_name="user_profile_pic_user")
    profile_pic = models.ImageField(
        upload_to=profile_pic_upload_path,
        default=DEFAULT_PROFILE_PIC
    )

class SpecialUserData(models.Model):
    valid_from = models.DateTimeField(default=timezone.now())
    good_thru = models.DateTimeField(
        default=timezone.now()+datetime.timedelta(days=SPECIAL_USER_VALID_SPAN)
    )
    phone = models.CharField(max_length="16")
    phone2 = models.CharField(max_length="16", blank=True, default="")
    phone3 = models.CharField(max_length="16", blank=True, default="")

    class Meta:
        abstract = True

class ShopOwnerData(SpecialUserData):
    address = models.CharField(max_length="100")
    homepage = models.URLField()
    service_type = TaggableManager()

class ModeratorData(SpecialUserData):
    def __init__(self, *args, **kwargs):
        self._meta.get_field(name="phone").blank = True
        self._meta.get_field(name="phone").default = ""
        super(ModeratorData, self).__init__(*args, **kwargs)

class Preference(models.Model):
    type = models.CharField(max_length="30")

class User_Preference(models.Model):
    user_id = models.ForeignKey(MyUser)
    preference_id = models.ForeignKey(Preference)
    score = models.FloatField(default=0.0)
