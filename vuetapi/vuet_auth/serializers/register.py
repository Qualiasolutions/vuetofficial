"""Register serializers"""
import logging
from datetime import datetime, timedelta

from django.contrib.auth.password_validation import validate_password
from phonenumber_field.serializerfields import PhoneNumberField  # type: ignore
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.tokens import RefreshToken  # type: ignore

from core.models.entities.lists import List
from core.models.entities.social import GuestListInvite
from core.models.tasks.anniversaries import UserBirthdayTask
from core.models.users.user_models import Family, User
from core.models.timeblocks.timeblocks import TimeBlock
from vuet_auth.models.email_validations import EmailValidation
from vuet_auth.models.phone_validations import PhoneValidation

logger = logging.getLogger(__name__)


class RegisterSerializer(serializers.ModelSerializer):
    """RegisterSerializer"""

    phone_number = PhoneNumberField(
        required=False,
        validators=[
            UniqueValidator(
                queryset=User.objects.all().filter(phone_number__isnull=False)
            )
        ],
    )
    email = serializers.EmailField(
        required=False,
        validators=[
            UniqueValidator(queryset=User.objects.all().filter(email__isnull=False))
        ],
    )

    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    access_token = serializers.CharField(read_only=True)

    refresh_token = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = (
            "password",
            "password2",
            "phone_number",
            "email",
            "access_token",
            "refresh_token",
        )

    def validate(self, attrs):
        if attrs.get("phone_number"):
            try:
                PhoneValidation.objects.get(
                    phone_number=attrs["phone_number"],
                    validated=True,
                    created_at__gte=datetime.now() - timedelta(minutes=15),
                )
            except Exception as exc:
                raise serializers.ValidationError(
                    {"phone_number": "Phone number not validated"}
                ) from exc
        elif attrs.get("email"):
            try:
                EmailValidation.objects.get(
                    email=attrs["email"],
                    validated=True,
                    created_at__gte=datetime.now() - timedelta(minutes=15),
                )
            except Exception as exc:
                raise serializers.ValidationError(
                    {"email": "Email not validated"}
                ) from exc
        else:
            raise serializers.ValidationError(
                {
                    "phone_number": {
                        "message": "Either phone number or email must be provided",
                        "code": "no_username",
                    }
                }
            )

        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )

        return attrs

    def create(self, validated_data):
        family = Family.objects.create()

        if validated_data.get("phone_number"):
            user = User.objects.create(
                username=validated_data["phone_number"],
                phone_number=validated_data["phone_number"],
                family=family,
            )

            guestlist_invites = GuestListInvite.objects.filter(
                user=None, phone_number=validated_data["phone_number"]
            )
            guestlist_invites.update(user=user)

        else:
            new_email = validated_data["email"].lower()
            user = User.objects.create(
                username=new_email,
                email=new_email,
                family=family,
            )
            guestlist_invites = GuestListInvite.objects.filter(
                user=None, email__iexact=new_email
            )

            guestlist_invites.update(user=user)

        user.set_password(validated_data["password"])
        user.save()

        default_list = List.objects.create(name="Main List", owner=user, category=1)
        default_list.members.set([user])

        for day in range(1, 8):
            for start, end in [
                ("00:00", "07:00"),
                ("07:00", "12:00"),
                ("12:00", "17:00"),
                ("17:00", "00:00"),
            ]:
                timeblock = TimeBlock.objects.create(
                    day=day,
                    start_time=start,
                    end_time=end,
                )
                timeblock.members.add(user)

        token = RefreshToken.for_user(user)
        user.refresh_token = str(token)  # type: ignore
        user.access_token = str(token.access_token)  # type: ignore

        return user
