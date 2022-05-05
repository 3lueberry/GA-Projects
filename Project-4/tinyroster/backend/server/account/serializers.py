from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.hashers import make_password

from .models import Account, AccountTypes

class TokenSerializer(serializers.Serializer):
    access = serializers.CharField(max_length=255)
    refresh = serializers.CharField(max_length=255)


class GetTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        return token


class AddAccountTypesSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountTypes
        fields = '__all__'

    def validate_type(self, value):
        return value.upper()


class AccountTypesSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountTypes
        fields = ('type',)


class UserLoginSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = Account
        fields = ('username', 'password')


class UserDetailsSerializer(serializers.ModelSerializer):
    type = AccountTypesSerializer(read_only = True)

    class Meta:
        model = Account
        fields = ('id', 'name', 'contact', 'type', 'last_login')


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'

    def validate_username(self, value):
        return value.lower()

    def validate_password(self, value):
        return make_password(value)
