from django.contrib import admin
from .models import *


class UsersAdmin(admin.ModelAdmin):
    list_display = ("id", "username",)
    list_display_links = ("username",)
    list_per_page = 25


admin.site.register(Users, UsersAdmin)
