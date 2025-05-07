"""Phone validation models"""

from django.conf import settings
from django.db import models


class ForgotPasswordValidation(models.Model):
    """ForgotPasswordValidation"""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=False, blank=False
    )
    code = models.CharField(null=True, blank=True, max_length=6)
    validated = models.BooleanField(default=False)
    created_at = models.DateTimeField(null=False, blank=False, auto_now=True)
