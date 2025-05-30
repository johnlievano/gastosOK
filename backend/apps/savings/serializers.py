from rest_framework import serializers
from .models import *

class SavingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Savings
        fields = "__all__"