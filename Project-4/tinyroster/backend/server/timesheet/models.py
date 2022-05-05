from django.db import models
from account.models import Account
from job.models import JobUser

# Create your models here.

class TimeSheet(models.Model):
    staff = models.ForeignKey(Account, on_delete=models.CASCADE, verbose_name='Staff ID', blank=True, null=True)
    period = models.DateTimeField(verbose_name='Period', auto_now=False)
    
    is_paid = models.BooleanField(verbose_name='Paid Status', default=False)
    paid_on = models.DateField(verbose_name='Paid Date', auto_now=False)
    paid_by = models.CharField(max_length=50, verbose_name='Paid By', blank=True, null=True)

    class Meta:
        verbose_name = "Time Sheet"
        verbose_name_plural = "Time Sheets"

    def __str__(self):
        return f"{self.staff.name}'s timesheet for period of {self.period}."


class TimeSheetItem(models.Model):
    timesheet = models.ForeignKey(TimeSheet, on_delete=models.CASCADE, verbose_name='Time Sheet ID', blank=True, null=True)
    job_item = models.ForeignKey(JobUser, on_delete=models.SET_NULL, verbose_name="Staff's Job ID", blank=True, null=True)

    total_hours = models.DurationField(verbose_name='Total Hours', blank=True, null=True)
    approved_by = models.ForeignKey(Account, on_delete=models.SET_NULL, verbose_name='Approved By', blank=True, null=True)

    class Meta:
        verbose_name = "Time Sheet Item"
        verbose_name_plural = "Time Sheet Items"

    def __str__(self):
        return f'{self.total_hours} approved by{self.approved_by}'