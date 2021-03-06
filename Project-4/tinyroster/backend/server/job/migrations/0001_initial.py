# Generated by Django 4.0.4 on 2022-05-05 03:49

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('location', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Job',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='User ID')),
                ('start_time', models.DateTimeField(verbose_name='Start')),
                ('end_time', models.DateTimeField(verbose_name='End')),
                ('no_staff', models.PositiveSmallIntegerField(blank=True, null=True, verbose_name='No. of Staffs')),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL, verbose_name='Created By')),
                ('location', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='location.location', verbose_name='Location ID')),
            ],
            options={
                'verbose_name': 'Job',
                'verbose_name_plural': 'Jobs',
            },
        ),
        migrations.CreateModel(
            name='JobStatus',
            fields=[
                ('status', models.CharField(max_length=30, primary_key=True, serialize=False)),
            ],
            options={
                'verbose_name': 'Job Status',
                'verbose_name_plural': 'Job Statuses',
            },
        ),
        migrations.CreateModel(
            name='JobUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('check_in', models.DateTimeField(verbose_name='Check-in Time')),
                ('check_out', models.DateTimeField(verbose_name='Check-out Time')),
                ('is_approved', models.BooleanField(default=False, verbose_name='Approved Status')),
                ('job', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='job.job', verbose_name='Job ID')),
                ('staff', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Staff ID')),
                ('status', models.ForeignKey(default='APPLIED', on_delete=django.db.models.deletion.DO_NOTHING, to='job.jobstatus', verbose_name='Status')),
            ],
            options={
                'verbose_name': 'Staffs for Job',
                'verbose_name_plural': 'Staffs for Jobs',
            },
        ),
    ]
