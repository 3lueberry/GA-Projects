from django.db import models
from account.models import Account
from location.models import Location

import uuid

# Create your models here.

class Job(models.Model):
    id = models.UUIDField(verbose_name='User ID',primary_key = True, default = uuid.uuid4, editable = False)
    
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, verbose_name='Location ID', blank=True, null=True)
    created_by = models.ForeignKey(Account, on_delete=models.SET_NULL, verbose_name='Created By', blank=True, null=True)

    start_time = models.DateTimeField(verbose_name='Start', auto_now=False)
    end_time = models.DateTimeField(verbose_name='End', auto_now=False)

    no_staff = models.PositiveSmallIntegerField(verbose_name='No. of Staffs', blank=True, null=True)
    is_deleted = models.BooleanField(verbose_name='Job Deleted', default=False)

    class Meta:
        verbose_name = "Job"
        verbose_name_plural = "Jobs"

    def __str__(self):
        return f'{self.id}: {self.start_time} to {self.end_time}'


class JobStatus(models.Model):
    status = models.CharField(max_length=30, primary_key=True)

    class Meta:
        verbose_name = "Job Status"
        verbose_name_plural = "Job Statuses"

    def __str__(self):
        return f'{self.status}'


class JobUser(models.Model):
    staff = models.ForeignKey(Account, on_delete=models.CASCADE, verbose_name='Staff ID')
    job = models.ForeignKey(Job, on_delete=models.SET_NULL, verbose_name='Job ID', blank=True, null=True)

    status = models.ForeignKey(JobStatus, on_delete=models.DO_NOTHING, verbose_name='Status', default="APPLIED")

    check_in = models.DateTimeField(verbose_name='Check-in Time', auto_now=False, blank=True, null=True, default=None)
    check_out = models.DateTimeField(verbose_name='Check-out Time', auto_now=False, blank=True, null=True, default=None)

    is_approved = models.BooleanField(verbose_name='Approved Status', default=False)

    class Meta:
        verbose_name = "Staffs for Job"
        verbose_name_plural = "Staffs for Jobs"
        unique_together = ('staff', 'job',)

    def __str__(self):
        return f'{self.staff.name}: {self.status}'

