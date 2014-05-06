import json
import logging

from django.core import serializers
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm

from .models import MyUser
from .forms import SignUpForm
from .utils import generate_user, existence_checking

def login_request(request):
    result = "failure"
    if request.method == 'POST':
        user = authenticate(
            username=request.POST['login'],
            password=request.POST['password']
        )

        if user is not None:
            if user.is_active:
                login(request, user)
                result = "success"
            else:
                result = "not active"

    response = HttpResponse(
        json.dumps({'result': result}),
        content_type='application/json'
    )

    return response

@login_required
def logout_request(request):
    logout(request)
    return HttpResponseRedirect("/")

def passwd_recovery(request):
    return HttpResponse("NOT IMPLEMENTED.")

def new_account_existence_checking(request):
    """
    Check if certain user attribute (e.g. username) has been taken by others
    """
    context = {
        "exist": True,
    }

    if request.method == "POST":
        to_check = request.POST["to_check"]
        content = request.POST["content"]
        context["exist"] = existence_checking(to_check, content)

    return HttpResponse(
        json.dumps(context),
        content_type='application/json'
    )

def new_account(request):
    context = {'result': 'failed', 'reason': 'invalid form'}
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            data = request.POST
            new_user = MyUser.objects.create_user(
                username=data['username'],
                email=data['email'],
                password=data['password'],
            )
            new_user.save()
            context['result'] = 'success'
            context['reason'] = None

            user = authenticate(
                username=data['username'], password=data['password'])
            login(request, user)

    return HttpResponse(
        json.dumps(context),
        content_type='application/json'
    )

def settings(request):
    if request.user.is_authenticated():
        user_type = request.user.type
    else:
        user_type = MyUser.PENDING

    user = {
        'logged_in': request.user.is_authenticated(),
        'username': request.user.username,
        'user_type': user_type,

        'is_admin': request.user.is_superuser,
    }

    context = {
        'user': user,
    }

    return render(request, "auth/settings.html", context)

def generate_user_request(request):
    context = {'result': 'failed', 'reason': 'unknown'}

    if request.method == "POST":
        try:
            generate_user(int(request.POST["people"]))
        except Exception as e:
            context['reason'] = str(e)
            logging.exception("Exception from auto generating users:")
        else:
            context["result"] = 'success'

    return HttpResponse(
        json.dumps(context),
        content_type='application/json'
    )

def email_activation(request, code):
    """
    On clicking the activation URL in the confirmation mail
    """
    pass
