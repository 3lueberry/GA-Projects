# Generated by Django 4.0.4 on 2022-05-05 13:53

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('timesheet', '0003_alter_timesheet_paid_on_alter_timesheet_staff_and_more'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='timesheet',
            unique_together={('staff', 'period')},
        ),
    ]
