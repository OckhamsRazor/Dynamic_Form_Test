from django.db import models
from taggit.managers import TaggableManager
from utils import PostElement

class Post(PostElement):
    """docstring for Post"""

    title = models.CharField(max_length="30", default="")
    tags = TaggableManager()

# Do we need this? Can this be merged with Post?
class Reply(PostElement):
    """docstring for Reply"""

    originalPost = models.ForeignKey(Post)

class Comment(PostElement):
    """docstring for Comment"""

    post = models.ForeignKey(Post)

# class Attribute:
    # """docstring for Attribute"""

    # name = models.CharField(default="")
