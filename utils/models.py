# coding=utf-8
from django.db import models
from django.utils import timezone
from djangotoolbox.fields import ListField, EmbeddedModelField

from .forms import StringListField, ObjectListField

class MyListField(ListField):
    def formfield(self, **kwargs):
        return models.Field.formfield(self, StringListField, **kwargs)

class MyEmbeddedModelField(EmbeddedModelField):
    def formfield(self, **kwargs):
        return models.Field.formfield(self, ObjectListField, **kwargs)

class IP_log(models.Model):
    time = models.DateTimeField(default=timezone.now())
    ip = models.IPAddressField(default="0.0.0.0")
