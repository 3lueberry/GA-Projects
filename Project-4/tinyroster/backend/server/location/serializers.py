from rest_framework import serializers
from .models import Location
from account.serializers import UserDetailsSerializer


class LocationSerializer(serializers.ModelSerializer):
    manager = UserDetailsSerializer(read_only = True)

    class Meta:
        model = Location
        fields = '__all__'

    # def validate_type(self, value):
    #     return value.upper()


class CreateLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'
        # exclude = ('manager',)