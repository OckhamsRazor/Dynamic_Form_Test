# coding=utf-8
from django import forms

from .models import Post


class PageBaseForm(forms.Form):
    class Meta:
        model = Post
        fields = [
            'title',
        ]
