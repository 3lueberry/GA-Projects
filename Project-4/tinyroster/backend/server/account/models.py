from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

import uuid

# Create your models here.
class AccountManager(BaseUserManager):
    def create_user(self, username=None, name=None, type=None, password=None, contact=''):
        if not username:
            raise ValueError('User must have a valid username.')

        elif not name:
            raise ValueError('User must have a valid name.')
        
        elif not type:
            raise ValueError('User must have a valid account type.')

        user = self.model(
            username = username.lower(),
            name = name,
            contact = contact,
            type = type,
        )
        user.set_password(password)
        user.save(using = self._db)
        return user

    def create_superuser(self, username, name, password, contact=''):
        type = AccountTypes(type='ADMIN')

        user = self.create_user(
            username = username,
            password = password,
            name = name,
            contact = contact,
            type = type,
        )
        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using = self._db)
        return user

    def get_by_natural_key(self, username):
        return self.get(username__iexact=username)


class AccountTypes(models.Model):
    type = models.CharField(max_length=30, primary_key=True)
    is_fulltimer = models.BooleanField(verbose_name='FullTime Employee', default=False)
    is_manager = models.BooleanField(verbose_name='Management', default=False)
    is_payroll = models.BooleanField(verbose_name='HR', default=False)
    is_admin = models.BooleanField(verbose_name='Admin', default=False)

    class Meta:
        verbose_name = "Account Type"
        verbose_name_plural = "Account Types"

    def __str__(self):
        return f'{self.type}'

    
    # def has_perm(self, perm, obj=None):
    #     return self.is_admin


class Account(AbstractBaseUser):
    id = models.UUIDField(verbose_name='User ID',primary_key = True, default = uuid.uuid4, editable = False)
    username = models.CharField(verbose_name='Username', max_length=30, unique=True)
    name = models.CharField(verbose_name='Name', max_length=50)
    contact = models.CharField(verbose_name='Mobile No.', max_length=8, blank=True, null=True)
    date_joined = models.DateTimeField(verbose_name='Date Joined', auto_now_add=True)
    last_login = models.DateTimeField(verbose_name='Last Login', auto_now=True)
    
    type = models.ForeignKey(AccountTypes, on_delete=models.SET_NULL, verbose_name='Account Type', blank=True, null=True)

    is_active = models.BooleanField(verbose_name='Active', default=False)
    is_staff = models.BooleanField(verbose_name='Staff', default=False)
    is_superuser = models.BooleanField(verbose_name='Superuser', default=False)

    objects = AccountManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['name', 'contact',]

    class Meta:
        verbose_name = "Account"
        verbose_name_plural = "Accounts"

    def __str__(self):
        return f'{self.name}'

    def has_perm(self, perm, obj=None):
        print(perm)
        if perm.find('token_blacklist') == 0 or perm.find('auth') == 0:
            return self.is_superuser

        if perm.find('view') > 0:
            return self.is_staff

        return self.type.is_admin
    
    def has_module_perms(self, app_label):
        return True
