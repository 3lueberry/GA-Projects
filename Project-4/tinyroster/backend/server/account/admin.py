from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Account, AccountTypes

# Register your models here.
class AccountInLine(admin.TabularInline):
    model = Account
    fields = ('name', 'contact', 'last_login')
    readonly_fields = ('name', 'contact', 'last_login')
    extra = 0


class AccountAdmin(UserAdmin):
    list_display = ('name', 'type', 'last_login', 'is_staff', 'is_active',)
    search_fields = ('name', )
    readonly_fields = ('id', 'date_joined', 'last_login',)
    ordering = ('username',)

    filter_horizontal = ()
    list_filter = ()

    fieldsets = (
        (None, {'fields': ('name', 'contact', 'type', 'date_joined', 'last_login')}),
        ('Permissions', {'fields': ('is_active', 'is_staff')}),
    )

    add_fieldsets = (
        (None, {'classes': ('wide',), 'fields': ('username', 'name', 'contact', 'type', 'password1', 'password2')}),
    )

admin.site.register(Account, AccountAdmin)

class AccountTypeAdmin(admin.ModelAdmin):
    list_display = ('type', 'is_fulltimer', 'is_manager', 'is_payroll', 'is_admin')
    search_fields = ('type', )
    ordering = ('type',)

    inlines = [AccountInLine]

    filter_horizontal = ()
    list_filter = ()

    fieldsets = (
        (None, {'fields': ('type',)}),
        ('Permissions', {'fields': ('is_fulltimer', 'is_manager', 'is_payroll', 'is_admin')}),
    )

    add_fieldsets = (
        (None, {'classes': ('wide',), 'fields': ('type',)}),
        ('Set Permissions', {'classes': ('wide',), 'fields': ('is_fulltimer', 'is_manager', 'is_payroll', 'is_admin')}),
    )

admin.site.register(AccountTypes, AccountTypeAdmin)