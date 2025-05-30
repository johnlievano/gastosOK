from django.contrib import admin
from .models import *

# Register your models here.
class SavingsAdmin(admin.ModelAdmin):
    list_display = ('id', 'saving', 'user', 'date_time')
    list_display_links = ('id',)
    list_per_page = 25

admin.site.register(Savings, SavingsAdmin)
