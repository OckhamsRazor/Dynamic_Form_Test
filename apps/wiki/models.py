# coding=utf-8
from django.db import models

from taggit.managers import TaggableManager

from utils.models import MyListField, MyEmbeddedModelField, IP_log
from utils.utils import get_user
from Web import settings


class Page(models.Model):
    """
    Wiki page with certain topic (e.g. Cell Phone)
    Page contains many Posts (user-customed wiki page)
    """
    posts = MyListField(models.ForeignKey('Post'))


class PostElement(models.Model):
    """
    Basic properties for post-related elements
    e.g. Post and Comment
    """
    author = models.ForeignKey(settings.AUTH_USER_MODEL)
    credit = models.FloatField(default=0.0)
    date_published_and_source_ip = \
        MyEmbeddedModelField('IP_log', null=True) # TODO: ip is non-null!!
    comments = MyListField()

    def to_json(self):
        json = {
            "id": self.id,
            "author": get_user(self.author.id).username,
            "author_id": self.author.id,
            "credit": self.credit,
            # IP_log #
            "comments": [] # TODO
        }
        return json

    class Meta:
        abstract = True


class Choice(PostElement):
    """docstring for Choice"""
    title = models.CharField(max_length="30")
    options = MyListField()
    option = models.IntegerField(default=-1) # option ID; -1: none is selected
    description = models.TextField(max_length="300")

    def clean(self, *args, **kwargs):
        if self.option >= len(self.options):
            self.option = -1

        super(Choice, self).clean(*args, **kwargs)

    def save(self, *args, **kwargs):
        self.full_clean()
        super(Choice, self).save(*args, **kwargs)


class Template(PostElement):
    """docstring for Template"""
    title = models.CharField(max_length="30")
    entries = MyListField(MyEmbeddedModelField("Entry"))
    description = models.TextField(max_length="300")

    def to_json(self):
        json = super(Template, self).to_json()
        json["title"] = self.title
        json["description"] = self.description
        json["entries"] = []
        for entry in self.entries:
            json["entries"].append(entry.to_json())

        return json


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
    ENTRY_TYPE_IDX = {}
    for idx, TYPE in enumerate(ENTRY_TYPES):
        ENTRY_TYPE_IDX[TYPE] = idx
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
    value2 = MyListField()
    value3 = MyListField()
    type = models.IntegerField(
        default=STR,
        choices=ENTRY_TYPE_CHOICES,
    )
    description = models.TextField(max_length="300", default="")

    def to_json(self):
        json = super(Entry, self).to_json()
        json["name"] = self.key
        json["value"] = self.value[0]
        json["type"] = Entry.ENTRY_TYPE_CHOICES[
            Entry.ENTRY_TYPE_IDX[self.type]
        ][1]
        json["description"] = self.description

        return json


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
