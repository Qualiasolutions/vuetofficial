"""Email Validation serializers"""

from rest_framework import serializers

from core.models.users.user_models import User
from vuet_auth.models.email_validations import EmailValidation
from vuet_auth.utils.codes import generate_code


class EmailValidationSerializer(serializers.ModelSerializer):
    """EmailValidationSerializer"""

    email = serializers.EmailField(required=True)

    class Meta:
        model = EmailValidation
        fields = "__all__"
        extra_kwargs = {"code": {"write_only": True}}

    def create(self, validated_data):
        validation, _ = EmailValidation.objects.update_or_create(
            email=validated_data["email"],
            defaults={"code": generate_code(), "validated": False},
        )

        return validation

    def validate_code(self, code):
        """Ensure that the code matches the existing code"""
        instance: EmailValidation | None = self.instance  # type: ignore
        if instance and not (instance.code == code):
            raise serializers.ValidationError(
                {
                    "message": "invalid code",
                    "code": "invalid_code",
                },
                code="invalid_code",
            )
        return code

    def validate_email(self, email):
        """Ensure that the email is unique"""
        existing_users = User.objects.filter(email=email)

        if existing_users.exists():
            raise serializers.ValidationError(
                {
                    "message": "A user already exists for this email",
                    "code": "email_used",
                }
            )

        return email

    def update(self, instance, validated_data):
        validated_data["validated"] = True
        return super().update(instance, validated_data)
