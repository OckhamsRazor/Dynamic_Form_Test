# coding=utf-8
import json
import traceback
from os import path
from PIL import Image
from shutil import rmtree

from django.core.mail import EmailMessage
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

from celery import shared_task

import Web
import utils.consts as consts
from .models import MyUser, HASH_KEY_LENGTH, DEFAULT_PROFILE_PIC
from .forms import SignUpForm
from utils.decorators import post_only_view, post_only_json
from utils.views import handle_file_upload
from utils.utils import generate_user, existence_checking, \
    random_string, confirmation_mail_content

@post_only_json
def login_request(request):
    result = consts.FAILED
    user = authenticate(
        username=request.POST['login'],
        password=request.POST['password']
    )

    if user is not None:
        if not user.is_active:
            result = consts.INACTIVE
        elif user.is_expired():
            result = consts.EXPIRED
        elif not user.is_activated():
            result = consts.UNACTIVATED
        else:
            login(request, user)
            result = consts.SUCCESSFUL
    else:
        result = consts.AUTH_FAILED

    return {'result': result}

@login_required
@post_only_json
def logout_request(request):
    logout(request)
    return {'result': consts.SUCCESSFUL}

def passwd_recovery(request):
    return HttpResponse("NOT IMPLEMENTED.")

@login_required
@post_only_json
def change_password(request):
    if request.user.check_password(request.POST["password_old"]):
        request.user.set_password(request.POST["password_new"])
        request.user.save()
        result = consts.SUCCESSFUL
    else:
        result = consts.AUTH_FAILED

    return {'result': result}

@post_only_json
def new_account_existence_checking(request):
    """
    Check if certain user attribute (e.g. username) has been taken by others
    If the existed account has expired, it will be removed
    """
    to_check = request.POST["to_check"]
    content = request.POST["content"]
    exist = existence_checking(to_check, content)
    if exist:
        result = consts.SUCCESSFUL
    else:
        result = consts.FAILED

    return {'result': result}

@post_only_json
def new_account(request):
    form = SignUpForm(request.POST)
    if form.is_valid():
        data = request.POST
        activation_code = \
            random_string(HASH_KEY_LENGTH)

        new_user = MyUser.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            activation_code=activation_code,
        )
        new_user.save()
        result = consts.SUCCESSFUL

        mail = EmailMessage(
            subject="Activate your Counselsior account",
            body=confirmation_mail_content(data['username'], activation_code),
            to=[data['email']]
        )
        mail.send()
    else:
        result = consts.FORM_INVALID

    return {'result': result}

def settings(request):
    context = {}
    return render(request, "settings/settings.html", context)

def admin(request):
    context = {}
    return render(request, "settings/admin.html", context)

@post_only_json
def generate_user_request(request):
    try:
        generate_user(int(request.POST["people"]))
    except Exception as e:
        print traceback.format_exc()
    else:
        result = consts.SUCCESSFUL

    return {
        'result': result,
    }

def email_activation(request, code):
    """
    On clicking the activation URL in the confirmation mail
    """
    context = {"result": "failed", 'reason': 'invalid code'}
    users = MyUser.objects.filter(activation_code=code)
    if len(users) == 1:
        user = users[0]
        if user.is_expired():
            context["reason"] = "expired"
            return render(request, "auth/activation_result.html", context)

        if request.user.is_authenticated():
            logout(request)

        user.activation_code = ""
        user.save()

        context["result"] = "success"
        context["user"] = user.username

    return render(request, "auth/activation_result.html", context)

@shared_task
@login_required
@post_only_json
def upload(request):
    result = consts.FAILED
    user = request.user
    new_profile_pic_url = user.profile_pic.file

    try:
        request.FILES['profile_pic'].name = \
            str(user.profile_pics.file_no+1) + \
            consts.Type_to_Ext[request.FILES['profile_pic'].content_type]

        new_profile_pic_url_short = path.join(
            user.username,
            "profile_pics",
            request.FILES['profile_pic'].name,
        )
        new_profile_pic_url = path.join(
            Web.settings.MEDIA_URL,
            new_profile_pic_url_short
        )
        new_profile_pic_path = path.join(
            Web.settings.MEDIA_ROOT,
            new_profile_pic_url_short
        )
        handle_file_upload(
            request, request.FILES['profile_pic'], new_profile_pic_path
        )

        user.profile_pic.file = new_profile_pic_url_short
        user.profile_pics.files.append(user.profile_pic)
        user.profile_pics.file_no += 1
        user.save()
        result = consts.SUCCESSFUL
    except Exception as e:
        print traceback.format_exc()

    return {
        'result': result,
        'profile_pic_path': new_profile_pic_url
    }

@login_required
@post_only_json
def crop_avatar(request):
    result = consts.FAILED
    user = request.user
    try:
        img_path = path.join(
            Web.settings.MEDIA_ROOT,
            user.profile_pic.file.lstrip("/")
        )
        img = Image.open(img_path)
        ratio = img.size[0] / float(request.POST["img_width"])
        box = (
            int(int(request.POST["x"])*ratio),
            int(int(request.POST["y"])*ratio),
            int(int(request.POST["x2"])*ratio),
            int(int(request.POST["y2"])*ratio),
        )
        img.crop(box).save(img_path)
        result = consts.SUCCESSFUL
    except Exception as e: # should do security check here!
        print traceback.format_exc()

    return {'result': result}

@login_required
def show_profile_pics(request):
    user = request.user
    profile_pics = user.profile_pics.files

    context = {"profile_pics": profile_pics}
    return render(request, "settings/profile_pics.html", context)

@login_required
def remove_profile_pic(request):
    pass
    # request.user.profile_pic = DEFAULT_PROFILE_PIC
    # dir_path = path.join(Web.settings.MEDIA_ROOT, "img", request.user.username)
    # if path.exists(dir_path):
        # rmtree(dir_path)
