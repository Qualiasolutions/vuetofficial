"""Phone validation models"""

from django.db import models
from phonenumber_field.modelfields import PhoneNumberField  # type: ignore


class PhoneValidation(models.Model):
    """PhoneValidation"""

    phone_number = PhoneNumberField(null=False, blank=False, unique=True)
    code = models.CharField(null=True, blank=True, max_length=6)
    validated = models.BooleanField(default=False)
    created_at = models.DateTimeField(null=False, blank=False, auto_now=True)
