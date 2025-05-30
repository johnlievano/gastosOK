from django.contrib.auth.models import AbstractUser
from django.db import models


class Users(AbstractUser):
    email = models.EmailField(max_length=200, unique=True)
    first_name = models.CharField(max_length=200, blank=True, default='')
    last_name = models.CharField(max_length=200, blank=True, default='')
    number_phone = models.CharField(max_length=10, blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)

    
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return f"{self.id} user: {self.username} full name: {self.first_name} {self.last_name}"
