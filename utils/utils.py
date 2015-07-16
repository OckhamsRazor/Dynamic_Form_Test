# coding=utf-8

import random
import string
import traceback

from django.db.utils import DatabaseError
from django.http import Http404
from django.shortcuts import get_object_or_404
from django.utils import timezone

from apps.users.models import MyUser


def random_string(N):
    return ''.join(
        random.choice(string.ascii_letters + string.digits) for _ in range(N)
    )


def random_number(N):
    return ''.join(random.choice(string.digits) for _ in range(N))


def general_exception_handling(e): # TODO
    print(traceback.format_exc())


def get_user(uid):
    try:
        return get_object_or_404(MyUser, id=uid)
    except (Http404, DatabaseError):
        return None


def generate_user(num):
    for _ in range(num):
        username = random_string(random.randint(4, 12))
        while existence_checking("username", username):
            username = random_string(random.randint(4, 12))

        password = "11111111"

        email = random_string(8) + "@ntu.edu.tw"
        while existence_checking("email", email):
            email = random_string(8) + "@ntu.edu.tw"

        first_name = random_string(8)
        last_name = random_string(4)

        new_user = MyUser.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            activation_code="",
            type=MyUser.TESTING,
        )
        new_user.save()


def existence_checking(to_check, content):
    if to_check == "username":
        existed = MyUser.objects.filter(username=content)
    elif to_check == "email":
        existed = MyUser.objects.filter(email=content)
    else:
        return False

    existed.exclude(activation_code__isnull=True).filter(
        activation_code_expired_time__lt=timezone.now()
    ).delete()

    return len(existed) != 0


def confirmation_mail_content(username, code):
    return \
    """
    Dear %(user)s,

        Please click the following link to activate your accout:

            http://localhost:8000/users/activate/%(code)s

        The link will expire in three days. If you fail to activate your account
        in time, you will have to create another new account.

        For more information, feel free to contact us via
        service@counselsior.com

    Sincerely,
    Counselsior
    """ % {'user': username, 'code': code}

