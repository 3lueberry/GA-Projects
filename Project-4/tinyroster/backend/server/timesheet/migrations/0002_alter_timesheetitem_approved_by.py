# Generated by Django 4.0.4 on 2022-05-05 13:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('timesheet', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='timesheetitem',
            name='approved_by',
            field=models.CharField(blank=True, max_length=50, null=True, verbose_name='Approved By'),
        ),
    ]