"""Signals for auth models"""
import logging

from django.conf import settings
from django.db.models.signals import post_save
from twilio.rest import Client

from utils.email_client import EmailClient
from vuet_auth.models.email_validations import EmailValidation
from vuet_auth.models.phone_validations import PhoneValidation

logger = logging.getLogger(__name__)


def phone_validation_post_save(sender, instance, created, **kwargs):
    """When a PhoneValidation object is created we should send an SMS
    to the associated phone number.
    """
    if not instance.validated:
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        client.messages.create(
            to=str(instance.phone_number),
            from_=settings.TWILIO_FROM_NUMBER,
            body=f"Your Vuet App access code is {instance.code}",
        )


post_save.connect(phone_validation_post_save, sender=PhoneValidation)


def email_validation_post_save(sender, instance, created, **kwargs):
    """When an EmailValidation object is created we should send an SMS
    to the associated email.
    """
    if not instance.validated:
        email_client = EmailClient()
        email_client.send_email(
            "Your Vuet Verification Code",
            "verification-code.html",
            instance.email,
            plaintext_template="verification-code.txt",
            data={
                "code": instance.code,
            },
        )


post_save.connect(email_validation_post_save, sender=EmailValidation)
