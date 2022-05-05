from django.db import models
from account.models import Account


# Create your models here.

class Location(models.Model):
    name = models.CharField(verbose_name='Location Name', max_length=100, unique=True)
    address = models.CharField(verbose_name='Street Address', max_length=255, blank=True, null=True)
    unit_no = models.CharField(verbose_name='Unit No.', max_length=10, blank=True, null=True)
    postal = models.CharField(verbose_name='Postal', max_length=6, blank=True, null=True)

    manager = models.OneToOneField(Account, on_delete=models.SET_NULL, verbose_name='Manager ID', blank=True, null=True)

    class Meta:
        verbose_name = "Location"
        verbose_name_plural = "Locations"

    def __str__(self):
        return f'{self.name}: {self.address}, {self.unit_no}, Postal: {self.postal}.'