# Generated by Django 4.0.4 on 2022-05-05 13:29

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('timesheet', '0002_alter_timesheetitem_approved_by'),
    ]

    operations = [
        migrations.AlterField(
            model_name='timesheet',
            name='paid_on',
            field=models.DateField(blank=True, null=True, verbose_name='Paid Date'),
        ),
        migrations.AlterField(
            model_name='timesheet',
            name='staff',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Staff ID'),
        ),
        migrations.AlterField(
            model_name='timesheetitem',
            name='timesheet',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='timesheet.timesheet', verbose_name='Time Sheet ID'),
        ),
    ]