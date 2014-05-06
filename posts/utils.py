from django.db import models
from Web import settings

class PostElement(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL)
    content = models.TextField(default="")

    credit = models.FloatField(default=0.0)

    class Meta:
        abstract = True
