# coding=utf-8
import operator

from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.shortcuts import render, get_object_or_404

import utils.consts as consts
from .models import Page, Post, Template, Entry, Comment, Choice
from utils.decorators import post_only_view, post_only_json
from utils.views import handle_file_upload
from utils.utils import general_exception_handling


def main(request):
    user = request.user
    if user.is_authenticated():
        posts = Post.objects.filter(author_id=user.id)
    else:
        posts = Post.objects.all()
    context = {"posts": posts}
    return render(request, "wiki/main.html", context)


def general_title_exists(request, obj_type):
    """
    For objs with unique title
    """
    user = request.user
    new_title = request.POST["new_title"].capitalize()
    existing = obj_type.objects.filter(
        Q(title=new_title) & Q(author_id=user.id)
    )
    title_exists = (len(existing) != 0)
    return {"title_exists": title_exists}


def general_view_objs(request, obj_type, obj_name, temp):
    """
    return all objs (and render them to template temp)
    """
    objs = obj_type.objects.all()
    context = {obj_name: objs}
    return render(request, temp, context)


def general_view_objs_json(obj_type):
    """
    return all objs as JSON
    """
    objs = obj_type.objects.all()
    objs_json = []
    for obj in objs:
        objs_json.append(obj.to_json())

    return {"objs": objs}


def general_read_obj(request, obj_type):
    """
    return obj (with keywords of certain fields) as JSON
    """
    context = {
        "result": consts.FAILED,
        "objs": None
    }

    try:
        kws = request.POST.getlist("kws[]")
        objs = obj_type.objects.filter(
            reduce(operator.and_, (Q(title__icontains=kw) for kw in kws)) |
            reduce(operator.and_, (Q(options__icontains=kw) for kw in kws)) |
            reduce(operator.and_, (Q(description__icontains=kw) for kw in kws))
        ) if len(kws) != 0 else obj_type.objects.all()

        context["result"] = consts.SUCCESSFUL
        context["objs"] = []
        for obj in objs:
            context["objs"].append(obj.to_json())

    except Exception as e:
        general_exception_handling(e)

    return context


# #
# Template
#


def view_templates(request):
    return general_view_objs(
        request, Template, "templates", "wiki/templates.html"
    )


@login_required
@post_only_json
def template_title_exists(request):
    return general_title_exists(request, Template)


@login_required
@post_only_json
def create_template(request):
    return {"result": save_template(request, True)}


@login_required
@post_only_json
def read_template(request):
    return general_read_obj(request, Template)


@login_required
def template(request, template_id):
    """
    returns template as page
    """
    try:
        obj = get_object_or_404(Template, id=template_id)
        return render(request, "wiki/template.html", obj.to_json())
    except Exception as e:
        general_exception_handling(e)
        raise Http404


@login_required
@post_only_json
def update_template(request):
    return {"result": save_template(request, False)}


def save_template(request, isNew):
    result = consts.FAILED

    user = request.user
    title = request.POST["title"].capitalize()
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
            Template.objects.select_for_update().filter(
                Q(title=title) & Q(author_id=user.id)
            ).update(
                entries=entries, description=description
            )
        result = consts.SUCCESSFUL
    except Exception as e:
        general_exception_handling(e)

    return result


@login_required
def delete_template(request):
    pass


# #
# Choice
#


@login_required
@post_only_json
def view_choices_json(request):
    return general_view_objs_json(Choice)


@login_required
@post_only_json
def choice_title_exists(request):
    return general_title_exists(request, Choice)


@login_required
@post_only_json
def create_choice(request):
    return {"result": save_choice(request, True)}


@login_required
@post_only_json
def read_choice_all(request):
    return general_read_obj(request, Choice)


@login_required
@post_only_json
def read_choice(request):
    ret = {
        "results": {
            "category1": {
                "name": "Top keywords",
                "results": [],
            },
            "category2": {
                "name": "Top results",
                "results": []
            },
        },
    }

    # TODO: retrieve related keywords
    kws = request.POST.getlist("kws[]")
    for kw in kws:
        if kw != "":
            ret["results"]["category1"]["results"].append({
                "title": kw,
                "description": "more results with "+kw,
            })
    # TODO end

    context = general_read_obj(request, Choice)
    if context["result"] == consts.SUCCESSFUL:
        ret["results"]["category2"]["results"] = context["objs"]

    return ret


@login_required
@post_only_json
def update_choice(request):
    return {"result": save_choice(request, False)}


def save_choice(request, isNew):
    result = consts.FAILED
    print request.POST

    user = request.user
    title = request.POST["title"].capitalize()
    options = request.POST.getlist("values[]")
    description = request.POST["description"]
    try:
        if isNew:
            Choice(
                author=user, title=title,
                options=options, description=description
            ).save()
        else:
            Choice.objects.select_for_update().filter(
                Q(title=title) & Q(author_id=user.id)
            ).update(
                options=options, description=description
            )
        result = consts.SUCCESSFUL
    except Exception, e:
        general_exception_handling(e)

    return result


@login_required
def delete_choice(request):
    pass


# #
# Page/Post
#


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
