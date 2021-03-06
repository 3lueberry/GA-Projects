# Generated by Django 4.0.4 on 2022-05-05 09:52

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('job', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='job',
            name='is_deleted',
            field=models.BooleanField(default=False, verbose_name='Job Deleted'),
        ),
        migrations.AlterField(
            model_name='jobuser',
            name='staff',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Staff ID'),
        ),
        migrations.AlterUniqueTogether(
            name='jobuser',
            unique_together={('staff', 'job')},
        ),
    ]
