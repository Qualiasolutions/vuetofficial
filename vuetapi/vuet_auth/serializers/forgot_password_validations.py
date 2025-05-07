"""Forgot Password Validation serializers"""

from django.conf import settings
from phonenumber_field.serializerfields import PhoneNumberField  # type: ignore
from rest_framework import serializers
from twilio.rest import Client

from core.models.users.user_models import User
from utils.email_client import EmailClient
from vuet_auth.models.forgot_password_validations import ForgotPasswordValidation
from vuet_auth.utils.codes import generate_code


class ForgotPasswordValidationSerializer(serializers.ModelSerializer):
    """ForgotPasswordValidationSerializer"""

    email = serializers.EmailField(required=False)
    phone_number = PhoneNumberField(required=False)

    class Meta:
        model = ForgotPasswordValidation
        fields = ["email", "phone_number", "code"]
        extra_kwargs = {"code": {"write_only": True}}

    def create(self, validated_data):
        if validated_data.get("email"):
            user = User.objects.get(email=validated_data.get("email"))
        elif validated_data.get("phone_number"):
            user = User.objects.get(phone_number=validated_data.get("phone_number"))

        validation, _ = ForgotPasswordValidation.objects.update_or_create(
            user=user,
            defaults={"code": generate_code(), "validated": False},
        )

        if validated_data.get("email"):
            email_client = EmailClient()
            email_client.send_email(
                "Your Vuet Password Reset Code",
                "password-reset-code.html",
                validated_data.get("email"),
                plaintext_template="password-reset-code.txt",
                data={
                    "code": validation.code,
                },
            )
        elif validated_data.get("phone_number"):
            client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
            client.messages.create(
                to=str(validated_data.get("phone_number")),
                from_=settings.TWILIO_FROM_NUMBER,
                body=f"Your Vuet password reset code is {validation.code}",
            )

        return validation

    def validate_email(self, email):
        """Ensure that the email matches an existing user"""
        try:
            User.objects.get(email=email)
            return email
        except User.DoesNotExist as exc:
            raise serializers.ValidationError("No such user") from exc

    def validate_phone_number(self, phone_number):
        """Ensure that the phone number matches an existing user"""
        try:
            User.objects.get(phone_number=phone_number)
            return phone_number
        except User.DoesNotExist as exc:
            raise serializers.ValidationError("No such user") from exc

    def validate(self, attrs):
        if not attrs.get("phone_number") and not attrs.get("email"):
            raise serializers.ValidationError(
                {
                    "phone_number": {
                        "message": "Either phone number or email must be provided",
                        "code": "no_username",
                    }
                }
            )

        return super().validate(attrs)
