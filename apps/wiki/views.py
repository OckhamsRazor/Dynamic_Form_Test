# coding=utf-8
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render

from celery import shared_task

import utils.consts as consts
from .models import Page, Post, Template, Entry
from utils.decorators import post_only_view, post_only_json
from utils.views import handle_file_upload
from utils.utils import general_exception_handling


def main(request):
    user = request.user
    if user.is_authenticated():
        posts = Post.objects.filter(author_id=user.id) # pylint: disable=E1101
    else:
        posts = Post.objects.all() # pylint: disable=E1101
    context = {"posts": posts}
    return render(request, "wiki/main.html", context)


def view_templates(request):
    templates = Template.objects.all() # pylint: disable=E1101
    context = {"templates": templates}
    return render(request, "wiki/template.html", context)


@login_required
@post_only_json
def template_title_exists(request):
    user = request.user
    new_title = request.POST["new_title"]
    existing = Template.objects.filter( # pylint: disable=E1101
        Q(title=new_title) & Q(author_id=user.id)
    )
    title_exists = (len(existing) != 0)
    return {"title_exists": title_exists}


@login_required
@post_only_json
def create_template(request):
    return {"result": save_template(request, True)}


@login_required
@post_only_json
def update_template(request):
    return {"result": save_template(request, False)}


def save_template(request, isNew):
    result = consts.FAILED

    user = request.user
    title = request.POST["title"]
    description = request.POST["description"]
    names = request.POST.getlist("names[]")
    types = request.POST.getlist("types[]")
    default_values = request.POST.getlist("values[]")
    entry_descriptions = request.POST.getlist("entry_descriptions[]")

    entries = []
    try:
        for idx, name in enumerate(names):
            entry = Entry(
                author=user, key=name, value=[default_values[idx]],
                type=types[idx], description=entry_descriptions[idx]
            )
            entries.append(entry)
        if isNew:
            Template(
                author=user, title=title,
                entries=entries, description=description
            ).save()
        else:
            Template.objects.select_for_update().filter(title=title).update(
                entries=entries, description=description
            )
        result = consts.SUCCESSFUL
    except Exception as e:
        general_exception_handling(e)

    return result

@login_required
def delete_template(request):
    pass


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
