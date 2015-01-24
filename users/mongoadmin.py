# from django.contrib import admin
# from .models import MyUser

# class MyUserAdmin(admin.ModelAdmin):
#     fields = [
#         'username', 'password', 'first_name', 'last_name', 'email',
#         'type', 'profile_pic', 'login_ip', 'special_user_data'
#     ]

# admin.site.register(MyUser, MyUserAdmin)

from mongonaut.sites import MongoAdmin
from .models import MyUser

MyUser.mongoadmin = MongoAdmin()
