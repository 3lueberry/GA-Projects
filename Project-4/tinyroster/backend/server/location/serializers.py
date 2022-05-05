from rest_framework import serializers
from .models import Location


class AddAccountTypesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

    # def validate_type(self, value):
    #     return value.upper()