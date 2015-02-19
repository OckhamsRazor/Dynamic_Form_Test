# coding=utf-8
from django.db import models

from taggit.managers import TaggableManager

from utils.models import MyListField, MyEmbeddedModelField, IP_log
from Web import settings


class Template(models.Model):
    """docstring for Template"""
    name = models.CharField(max_length="30")
    entries = MyListField(MyEmbeddedModelField("Entry"))
    description = models.TextField(max_length="300")


class Page(models.Model):
    """
    Wiki page with certain topic (e.g. Cell Phone)
    Page contains many Posts (user-customed wiki page)
    """
    posts = MyListField(models.ForeignKey('Post'))


class PostElement(models.Model):
    """docstring for PostElement"""
    author = models.ForeignKey(settings.AUTH_USER_MODEL)
    credit = models.FloatField(default=0.0)
    date_published_and_source_ip = MyEmbeddedModelField('IP_log')
    comments = MyListField(MyEmbeddedModelField('Comment'))

    class Meta:
        abstract = True


class Entry(PostElement):
    """docstring for Entry"""
    INT = 0
    DOUBLE = 1
    STR = 10
    EMAIL = 11
    URL = 12
    GPS = 20
    TIME = 30
    USER = 40
    POST = 50
    COMMENT = 51
    THREAD = 52
    TEMPLATE = 59
    ENTRY_TYPES = [
        INT, DOUBLE, STR, EMAIL, URL, GPS, TIME,
        USER, POST, COMMENT, THREAD, TEMPLATE,
    ]
    ENTRY_TYPE_CHOICES = (
        (INT, "Integer"),
        (DOUBLE, "Double"),
        (STR, "String"),
        (EMAIL, "Email"),
        (URL, "URL"),
        (GPS, "GPS_Coordinate"),
        (TIME, "DateTime"),
        (USER, "User"),
        (POST, "Post"),
        (COMMENT, "Comment"),
        (THREAD, "Thread"),
        (TEMPLATE, "Template"),
    )

    key = models.CharField(max_length="30")
    value = MyListField()
    type = models.IntegerField(
        default=STR,
        choices=ENTRY_TYPE_CHOICES,
    )


class Post(PostElement):
    """
    Wiki page that belongs to user
    """
    page = models.ForeignKey('Page', related_name='thread')
    title = models.CharField(max_length="30", default="")
    entries = MyListField(MyEmbeddedModelField('Entry'))
    tags = TaggableManager()


class Comment(PostElement):
    """docstring for Comment"""
    pass
