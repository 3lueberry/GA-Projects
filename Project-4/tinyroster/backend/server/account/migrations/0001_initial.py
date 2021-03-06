# Generated by Django 4.0.4 on 2022-04-30 11:18

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AccountTypes',
            fields=[
                ('type', models.CharField(max_length=30, primary_key=True, serialize=False)),
                ('is_fulltimer', models.BooleanField(default=False, verbose_name='FT Employee')),
                ('is_manager', models.BooleanField(default=False, verbose_name='Management')),
                ('is_payroll', models.BooleanField(default=False, verbose_name='HR')),
                ('is_admin', models.BooleanField(default=False, verbose_name='Admin')),
            ],
        ),
        migrations.CreateModel(
            name='Account',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='User ID')),
                ('username', models.CharField(max_length=30, unique=True, verbose_name='Username')),
                ('name', models.CharField(max_length=50, verbose_name='Name')),
                ('contact', models.CharField(max_length=8, verbose_name='Mobile No.')),
                ('date_joined', models.DateTimeField(auto_now_add=True, verbose_name='Date Joined')),
                ('last_login', models.DateTimeField(auto_now=True, verbose_name='Last Login')),
                ('is_active', models.BooleanField(default=True, verbose_name='Active')),
                ('is_staff', models.BooleanField(default=False, verbose_name='Staff')),
                ('is_superuser', models.BooleanField(default=False, verbose_name='Superuser')),
                ('type', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='account.accounttypes', verbose_name='Account Type')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
