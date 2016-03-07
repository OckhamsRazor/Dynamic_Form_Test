# coding=utf-8
import json

from django.http import HttpResponse
from django.shortcuts import render

import consts


def json_req(decorated_func):
    """
    For view functions which return json
    """
    def wrap(request, *args, **kwargs):
        data = decorated_func(request, *args, **kwargs)
        return HttpResponse(
            json.dumps(data),
            content_type='application/json'
        )
    return wrap


def post_only_json(decorated_func):
    """
    For post-only view functions which return json
    """
    def wrap(request, *args, **kwargs):
        if request.method == "POST":
            data = decorated_func(request, *args, **kwargs)
            return HttpResponse(
                json.dumps(data),
                content_type='application/json'
            )
        else:
            return render(request, "error/405.html", status=405)
    return wrap


def post_only_view(template):
    """
    For post-only view functions which return rendered templates
    """
    def decorator(decorated_func):
        def wrap(request, *args, **kwargs):
            if request.method == "POST":
                context = decorated_func(request, *args, **kwargs)
                return render(request, template, context)
            else:
                return render(request, "error/405.html", status=405)
        return wrap
    return decorator
