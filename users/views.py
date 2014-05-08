import json
import logging

from django.core.mail import EmailMessage
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

from .models import MyUser, HASH_KEY_LENGTH
from .forms import SignUpForm
from .utils import generate_user, existence_checking, random_string

def login_request(request):
    context = {'result': 'failure', 'reason': 'unknown'}
    if request.method == 'POST':
        user = authenticate(
            username=request.POST['login'],
            password=request.POST['password']
        )

        if user is not None:
            if not user.is_active:
                context["reason"] = "inactive"
            elif user.is_expired():
                context["reason"] = "expired"
            elif not user.is_activated():
                context["reason"] = "unactivated"
            else:
                login(request, user)
                context["result"] = "success"
        else:
            context["reason"] = "wrong"

    return HttpResponse(
        json.dumps(context),
        content_type='application/json'
    )

@login_required
def logout_request(request):
    logout(request)
    return HttpResponseRedirect("/")

def passwd_recovery(request):
    return HttpResponse("NOT IMPLEMENTED.")

def new_account_existence_checking(request):
    """
    Check if certain user attribute (e.g. username) has been taken by others
    If the existed account has expired, it will be removed
    """
    context = {"exist": True}

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
            activation_code = \
                random_string(HASH_KEY_LENGTH)

            new_user = MyUser.objects.create_user(
                username=data['username'],
                email=data['email'],
                password=data['password'],
                activation_code=activation_code,
            )
            new_user.save()
            context['result'] = 'success'
            context['reason'] = None

            mail = EmailMessage(
                subject="Activate your EE-Comment account",
                body= \
                    """
                    Dear %(user)s,

                        Please click the following link to activate your accout:

                            http://localhost:8000/users/activate/%(code)s

                        The link will expire in three days. If you fail to activate your account
                        in time, you will have to create another new account.

                        For more information, feel free to contact us via service@ee-comment.com

                    Sincerely,
                    EE-Comment
                    """ % {'user': data['username'], 'code': activation_code},
                to=[data['email']]
            )
            mail.send()

    return HttpResponse(
        json.dumps(context),
        content_type='application/json'
    )

def settings(request):
    if request.user.is_authenticated():
        user_type = request.user.type
    else:
        user_type = None

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
