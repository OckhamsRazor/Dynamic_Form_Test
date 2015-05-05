# coding=utf-8
from django.db import models

from taggit.managers import TaggableManager

from utils.models import MyListField, MyEmbeddedModelField, IP_log
from Web import settings


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
    date_published_and_source_ip = \
        MyEmbeddedModelField('IP_log', null=True) # TODO: ip is non-null!!
    comments = MyListField(MyEmbeddedModelField('Comment'))

    class Meta:
        abstract = True


class Template(PostElement):
    """docstring for Template"""
    title = models.CharField(max_length="30")
    entries = MyListField(MyEmbeddedModelField("Entry"))
    description = models.TextField(max_length="300")


class Entry(PostElement):
    """docstring for Entry"""
    CHOICE = 0
    COLOR = 1
    DBL = 10
    STR = 20
    EMAIL = 21
    URL = 22
    GPS = 30
    TIME = 40
    USER = 50
    POST = 60
    COMMENT = 61
    THREAD = 62
    TEMPLATE = 69
    ENTRY_TYPES = [
        CHOICE, COLOR, DBL, STR, EMAIL, URL, GPS, TIME,
        USER, POST, COMMENT, THREAD, TEMPLATE,
    ]
    ENTRY_TYPE_CHOICES = (
        (CHOICE, "Choice"),
        (COLOR, "Color"),
        (DBL, "Real Number"),
        (STR, "Text"),
        (EMAIL, "Email Address"),
        (URL, "Link"),
        (GPS, "Position"),
        (TIME, "Date/Time"),
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
    description = models.TextField(max_length="300", default="")


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
