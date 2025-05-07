"""Email validation models"""

from django.db import models


class EmailValidation(models.Model):
    """EmailValidation"""

    email = models.EmailField(null=False, blank=False, unique=True)
    code = models.CharField(null=True, blank=True, max_length=6)
    validated = models.BooleanField(default=False)
    created_at = models.DateTimeField(null=False, blank=False, auto_now=True)
