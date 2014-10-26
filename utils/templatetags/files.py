import os

from django import template

register = template.Library()

@register.filter
def filename(value):
    return os.path.basename(value)

@register.filter
def filename_wo_ext(value):
    return os.path.splitext(os.path.basename(value))[0]
