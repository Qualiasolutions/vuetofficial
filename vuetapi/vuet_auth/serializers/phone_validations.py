"""Phone validation serializers"""

from phonenumber_field.serializerfields import PhoneNumberField  # type: ignore
from rest_framework import serializers

from core.models.users.user_models import User
from vuet_auth.models.phone_validations import PhoneValidation
from vuet_auth.utils.codes import generate_code


class PhoneValidationSerializer(serializers.ModelSerializer):
    """PhoneValidationSerializer"""

    phone_number = PhoneNumberField(required=True)

    class Meta:
        model = PhoneValidation
        fields = "__all__"
        extra_kwargs = {"code": {"write_only": True}}

    def create(self, validated_data):
        validation, _ = PhoneValidation.objects.update_or_create(
            phone_number=validated_data["phone_number"],
            defaults={"code": generate_code(), "validated": False},
        )

        return validation

    def validate_code(self, code):
        """Ensure that the code matches the existing code"""
        instance: PhoneValidation | None = self.instance  # type: ignore
        if instance and not (instance.code == code):
            raise serializers.ValidationError(
                {
                    "message": "invalid code",
                    "code": "invalid_code",
                },
                code="invalid_code",
            )
        return code

    def validate_phone_number(self, phone_number):
        """Ensure that the phone number is unique"""
        existing_users = User.objects.filter(phone_number=phone_number)

        if existing_users.exists():
            raise serializers.ValidationError(
                {
                    "message": "A user already exists for this phone number",
                    "code": "phone_number_used",
                }
            )

        return phone_number

    def update(self, instance, validated_data):
        validated_data["validated"] = True
        return super().update(instance, validated_data)
