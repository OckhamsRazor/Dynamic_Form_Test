# coding=utf-8
from django import forms

from .models import MyUser, UserProfilePic

class SignUpForm(forms.ModelForm):
    class Meta:
        model = MyUser
        fields = [
            'username', 'password', 'email',
        ]

class UserProfilePictureForm(forms.ModelForm):
    class Meta:
        model = UserProfilePic
        fields = ['user', 'profile_pic']
        exclude = ('user',)
