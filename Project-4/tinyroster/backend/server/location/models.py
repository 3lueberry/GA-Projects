from django.db import models
from account.models import Account


# Create your models here.

class Location(models.Model):
    name = models.CharField(verbose_name='Location Name', max_length=100)
    address = models.CharField(verbose_name='Street Address', max_length=255)
    unit_no = models.CharField(verbose_name='Unit No.', max_length=10)
    postal = models.CharField(verbose_name='Postal', max_length=6)

    manager = models.ForeignKey(Account, on_delete=models.SET_NULL, verbose_name='Manager ID', blank=True, null=True)

    class Meta:
        verbose_name = "Location"
        verbose_name_plural = "Locations"

    def __str__(self):
        return f'{self.name}: {self.address}, {self.unit_no}, Postal: {self.postal}.'