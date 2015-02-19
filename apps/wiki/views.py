# coding=utf-8
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render

from celery import shared_task

from .forms import PageBaseForm
from .models import Page, Post
from utils.decorators import post_only_view, post_only_json
from utils.views import handle_file_upload


def main(request):
    user = request.user
    if user.is_authenticated():
        posts = Post.objects.filter(author_id=user.id) # pylint: disable=E1101
    else:
        posts = Post.objects.all() # pylint: disable=E1101
    context = {"posts": posts}
    return render(request, "wiki/main.html", context)


@login_required
def new_page(request):
    pass


@login_required
def new_post(request):
    return render(request, "wiki/new_page.html", {})


@login_required
def create_post(request):
    pass


@login_required
def update_post(request):
    pass


@login_required
def delete_post(request):
    pass
