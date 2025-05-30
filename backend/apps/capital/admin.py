from django.contrib import admin
from .models import *

# Register your models here.
class CapitalsAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'income', 'date_time')
    list_display_links = ('id', 'user')
    list_per_page = 25

admin.site.register(Capitals, CapitalsAdmin)