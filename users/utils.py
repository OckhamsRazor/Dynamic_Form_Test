# coding=utf-8

import string
import random

from .models import MyUser

def random_string(N):
    return ''.join(
        random.choice(string.ascii_letters + string.digits) for _ in range(N)
    )

def random_number(N):
    return ''.join(random.choice(string.digits) for _ in range(N))


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
            type=MyUser.TESTING,
        )
        new_user.save

def existence_checking(to_check, content):
    if to_check == "username":
        existed = MyUser.objects.filter(username=content)
    elif to_check == "email":
        existed = MyUser.objects.filter(email=content)
    else:
        existed = [0] # By default, returns True

    return len(existed) != 0

def confirmation_mail_content():
    pass

def send_mail(to):
    pass
