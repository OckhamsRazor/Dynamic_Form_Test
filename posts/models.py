# coding=utf-8
from django.db import models
from taggit.managers import TaggableManager

from Web import settings
from webUtils.models import MyListField, MyEmbeddedModelField, IP_log

class Entry(models.Model):
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

class TextEntry(models.Model):
    content = models.CharField(max_length="300")

class Template(models.Model):
    """docstring for Template"""
    name = models.CharField(max_length="30")
    entries = MyListField()
    description = models.TextField(max_length="300")

class Thread(models.Model):
    """docstring for Thread"""
    original_post = models.ForeignKey('Post', related_name='op')
    posts = MyListField(models.ForeignKey('Post'))

class PostElement(models.Model):
    """docstring for PostElement"""
    author = models.ForeignKey(settings.AUTH_USER_MODEL)
    content = Entry(
        key="",
        value=[TextEntry()],
        type=Entry.STR
    )
    credit = models.FloatField(default=0.0)
    date_published_and_source_ip = MyEmbeddedModelField('IP_log')

    class Meta:
        abstract = True

class Post(PostElement):
    """docstring for Post"""
    thread = models.ForeignKey('Thread', related_name='thread')
    title = models.CharField(max_length="30", default="")
    comments = MyListField(MyEmbeddedModelField('Comment'))
    entries = MyListField(MyEmbeddedModelField('Entry'))
    tags = TaggableManager()

class Comment(PostElement):
    """docstring for Comment"""
    pass
