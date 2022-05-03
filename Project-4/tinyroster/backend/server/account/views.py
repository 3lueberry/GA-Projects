from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import (IsAuthenticated, AllowAny, IsAdminUser)
from rest_framework import status

from . import serializers as srlzr
from .models import Account, AccountTypes

from django.contrib.auth import (authenticate, login, logout)
from django.contrib.auth.hashers import make_password
from django.db import IntegrityError

# Create your views here.
class Refresh(TokenRefreshView):
    permission_class = (AllowAny,)
    # serializer_class = srlzr.TokenSerializer


class Login(APIView):
    permission_class = (AllowAny,)
    serializer_class = srlzr.UserLoginSerializer

    def post(self, request):
        username = request.data.get("username", "")
        password = request.data.get("password", None)
        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response(
                data = { "message": "invalid username or password" },
                status = status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            return Response(
                data = { "message": "account is inactive" },
                status = status.HTTP_401_UNAUTHORIZED
            )

        login(request, user)
        refresh = RefreshToken.for_user(user)
        serializer = srlzr.TokenSerializer(
            data={
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            })

        if not serializer.is_valid():
            return Response(
                data = { "message": "something went wrong" },
                status = status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(
                data = serializer.data,
                status=status.HTTP_200_OK
            )


class Logout(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        try:
            token = RefreshToken(request.data.get("refresh", ""))
            token.blacklist()

            tokens = OutstandingToken.objects.filter(user_id=request.user.id)
            for token in tokens:
                try:
                    BlacklistedToken.objects.get(token_id=token.id)
                except:
                    blacklist = RefreshToken(token.token)
                    blacklist.blacklist()

            logout(request)
            return Response(
                data={
                    "access": None,
                    "refresh": None,
                },
                status=status.HTTP_205_RESET_CONTENT
            )
        except:
            return Response(
                data = { "message": "something went wrong" },
                status = status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class Create(APIView):
    permission_classes = (IsAdminUser,)

    def put(self, request):
        if not request.user.has_perm('account.add_account'):
            return Response(
                data = { "message": "permission denied" },
                status = status.HTTP_401_UNAUTHORIZED
            )

        username = request.data.get("username", "")
        if not username:
            return Response(
                data = { "message": "username is required" },
                status = status.HTTP_400_BAD_REQUEST
            )
        
        account_type = request.data.get("type", "")
        try:
            type = AccountTypes.objects.get(type = account_type.upper())
        except:
            return Response(
                data = { "message": "invalid account type" },
                status = status.HTTP_400_BAD_REQUEST
            )

        password = request.data.get("password", "")
        name = request.data.get("name", username.capitalize())
        contact = request.data.get("contact", "")

        try:
            user = Account.objects.create_user(
                username = username,
                name = name,
                type = type,
                password = password,
                contact = contact,
            )
        except ValueError as err:
            return Response(
                data = { "message": err },
                status = status.HTTP_400_BAD_REQUEST
            )
        except IntegrityError:
            return Response(
                data = { "message": f"account {username} already exists" },
                status = status.HTTP_400_BAD_REQUEST
            )
        except:
            return Response(
                data = { "message": "something went wrong" },
                status = status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        user.is_staff = request.data.get("is_staff", False)
        user.is_active = password != ""
        user.save()

        return Response(
            data = {
                "message": "user created",
                "user_id": user.id
            },
            status = status.HTTP_201_CREATED
        )


class ResetPassword(APIView):
    permission_classes = (AllowAny,)

    def patch(self, request):
        username = request.data.get("username", "")
        new_password = request.data.get("new_password", "")

        if not username or not new_password:
            return Response(
                data = { "message": "username and/or new password is required" },
                status = status.HTTP_400_BAD_REQUEST
            )

        password = request.data.get("password", "")

        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response(
                data = { "message": "invalid username or password" },
                status = status.HTTP_401_UNAUTHORIZED
            )
        
        serialized_user = srlzr.AccountSerializer(
            instance=user, 
            data={ "password": new_password, "is_active": True}, 
            partial=True
        )

        if not serialized_user.is_valid():
            return Response(
                data = { "message": "something went wrong" },
                status = status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        serialized_user.save()
        return Response(
            data = {
                "message": "password has been changed",
                "user_id": serialized_user.data['id']
            },
            status = status.HTTP_202_ACCEPTED
        )


class Delete(APIView):
    permission_classes = (IsAdminUser,)

    def delete(self, request, id):
        if not request.user.has_perm('account.delete_account'):
            return Response(
                data = { "message": "permission denied" },
                status = status.HTTP_401_UNAUTHORIZED
            )

        password = request.data.get("password", "")
        if not password:
            return Response(
                data = { "message": "admin password is required" },
                status = status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(request, username=request.user.username, password=password)
        if user is None:
            return Response(
                data = { "message": "invalid username or password" },
                status = status.HTTP_401_UNAUTHORIZED
            )

        try:
            account = Account.objects.get(id=id)
        except:
            return Response(
                data = { "message": "account not found" },
                status = status.HTTP_404_NOT_FOUND
            )

        try:
            account.delete()
            return Response(
                data = {
                    "message": "account deleted"
                },
                status = status.HTTP_200_OK
            )
        except:
            return Response(
                data = { "message": "something went wrong" },
                status = status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AccountList(APIView):
    permission_class = (IsAdminUser,)

    def get(self, request):
        accounts = Account.objects.all()
        serialized_accounts = srlzr.UserDetailsSerializer(accounts, many=True)
        return Response(data = serialized_accounts.data, status = status.HTTP_200_OK)


class AccountDetails(APIView):
    permission_class = (IsAuthenticated,)

    def get(self, request, id):
        try:
            account = Account.objects.get(id=id)
        except:
            return Response(
                data = { "message": "account not found" },
                status = status.HTTP_404_NOT_FOUND
            )

        serialized_account = srlzr.UserDetailsSerializer(account)
        return Response(data = serialized_account.data, status = status.HTTP_200_OK)


class Update(APIView):
    permission_classes = (IsAdminUser,)

    def patch(self, request, id):
        try:
            account = Account.objects.select_related('type').get(id=id)
        except:
            return Response(
                data = { "message": "account not found" },
                status = status.HTTP_404_NOT_FOUND
            )
        
        data = request.data
        account_type = request.data.get("type", "")
        if account_type != "":
            try:
                data['type'] = AccountTypes.objects.get(type = account_type.upper())
            except:
                return Response(
                    data = { "message": "invalid account type" },
                    status = status.HTTP_400_BAD_REQUEST
                )

        serialized_account = srlzr.AccountSerializer(
            instance = account, 
            data = data, 
            partial = True
        )

        if not serialized_account.is_valid():
            return Response(
                data = { "message": "something went wrong" },
                status = status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        serialized_account.save()
        return Response(
            data = {
                "message": "account has been updated",
                "user_id": serialized_account.data['id']
            },
            status = status.HTTP_202_ACCEPTED
        )



class Auth(APIView):
    permission_class = (IsAuthenticated,)

    def get(self, request):
        response = JWTAuthentication().authenticate(request)
        if response is not None:
            return Response( data = True, status = status.HTTP_200_OK )
        else:
            return Response( data = False, status = status.HTTP_401_UNAUTHORIZED )


class AccountTypeView(APIView):
    permission_class = (IsAdminUser,)

    def get(self, request):
        if not request.user.has_perm('account.view_accounttypes'):
            return Response(
                data = { "message": "permission denied" },
                status = status.HTTP_401_UNAUTHORIZED
            )
        try:
            account_types = AccountTypes.objects.all()
            serialized_account_types = srlzr.AddAccountTypesSerializer(account_types, many=True)
            return Response(data = serialized_account_types.data, status = status.HTTP_200_OK)
        except:
            return Response(
                data = { "message": "something went wrong" },
                status = status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    def post(self, request):
        if not request.user.has_perm('account.view_accounttypes'):
            return Response(
                data = { "message": "permission denied" },
                status = status.HTTP_401_UNAUTHORIZED
            )
        
        try:
            account_type = AccountTypes.objects.get(type = request.data.get('type', ""))
        except:
            return Response(
                data = { "message": "account type not found" },
                status = status.HTTP_404_NOT_FOUND
            )
        
        serialized_account_type = srlzr.AddAccountTypesSerializer(account_type)
        return Response(data = serialized_account_type.data, status = status.HTTP_200_OK)
        
    def put(self, request):
        if not request.user.has_perm('account.add_accounttypes'):
            return Response(
                data = { "message": "permission denied" },
                status = status.HTTP_401_UNAUTHORIZED
            )
        
        add_account_type = srlzr.AddAccountTypesSerializer(data = request.data)
        if add_account_type.is_valid():
            add_account_type.save()
            return Response(
                data = add_account_type.data,
                status = status.HTTP_201_CREATED
            )
        else:
            return Response(
                data = { "message": "invalid account type" },
                status = status.HTTP_400_BAD_REQUEST
            )
        
    def patch(self, request):
        if not request.user.has_perm('account.change_accounttypes'):
            return Response(
                data = { "message": "permission denied" },
                status = status.HTTP_401_UNAUTHORIZED
            )
        
        try:
            account_type = AccountTypes.objects.get(type = request.data.get('type', ""))
        except:
            return Response(
                data = { "message": "account type not found" },
                status = status.HTTP_404_NOT_FOUND
            )
        
        updated_account_type = srlzr.AddAccountTypesSerializer(instance=account_type, data=request.data, partial=True)
        if not updated_account_type.is_valid():
            return Response(
                data = { "message": "invalid account type" },
                status = status.HTTP_400_BAD_REQUEST
            )
        updated_account_type.save()
        return Response(data = updated_account_type.data, status = status.HTTP_202_ACCEPTED)
        
    
    def delete(self, request):
        if not request.user.has_perm('account.delete_accounttypes'):
            return Response(
                data = { "message": "permission denied" },
                status = status.HTTP_401_UNAUTHORIZED
            )
        
        try:
            account_type = AccountTypes.objects.get(type = request.data.get('type', ""))
        except:
            return Response(
                data = { "message": "account type not found" },
                status = status.HTTP_404_NOT_FOUND
            )

        try:
            account_type.delete()
            return Response(
                data = {
                    "message": "account type deleted"
                },
                status = status.HTTP_200_OK
            )
        except:
            return Response(
                data = { "message": "something went wrong" },
                status = status.HTTP_500_INTERNAL_SERVER_ERROR
            )
