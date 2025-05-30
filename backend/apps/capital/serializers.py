from rest_framework import serializers
from .models import *

class CapitalsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Capitals
        fields = "__all__"