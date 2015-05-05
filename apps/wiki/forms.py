# coding=utf-8
from django import forms

from .models import Post, Template


class PageBaseForm(forms.Form):
    class Meta:
        model = Post
        fields = [
            'title',
        ]


class TemplateForm(forms.Form):
    class Meta:
        model = Template
        fields = [
            'title',
        ]
