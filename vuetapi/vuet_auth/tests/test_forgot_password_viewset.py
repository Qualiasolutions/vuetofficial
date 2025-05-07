import logging
from unittest.mock import MagicMock, patch

import pytz
from django.conf import settings
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIRequestFactory

from core.models.users.user_models import User
from vuet_auth.models.forgot_password_validations import ForgotPasswordValidation
from vuet_auth.views.forgot_password import ForgotPasswordValidationViewSet

utc = pytz.UTC


logger = logging.getLogger(__name__)


class TestForgotPasswordViewset(TestCase):
    """TestRegisterView"""

    def setUp(self):
        # Just make a couple of users to start with
        User.objects.create(phone_number="+447123234345", username="+447123234345")
        self.user_email = "existing@test.com"
        self.user_phone = "+447123888999"
        self.user = User.objects.create(
            email=self.user_email,
            username=self.user_email,
            phone_number=self.user_phone,
        )
        self.create_view = ForgotPasswordValidationViewSet.as_view({"post": "create"})

    @patch("vuet_auth.serializers.forgot_password_validations.EmailClient")
    @patch("vuet_auth.serializers.forgot_password_validations.generate_code")
    def test_can_get_reset_code_from_email(self, mgenerate_code, memail):
        """Test can get a reset code via email"""
        test_code = "123456"
        mgenerate_code.return_value = test_code
        memail.return_value.send_email = MagicMock()

        req = APIRequestFactory().post("", {"email": self.user_email})
        res = self.create_view(req)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        # Just need to not error here
        ForgotPasswordValidation.objects.get(user=self.user)

        memail.return_value.send_email.assert_called_once_with(
            "Your Vuet Password Reset Code",
            "password-reset-code.html",
            self.user_email,
            plaintext_template="password-reset-code.txt",
            data={
                "code": test_code,
            },
        )

    @patch("vuet_auth.serializers.forgot_password_validations.Client")
    @patch("vuet_auth.serializers.forgot_password_validations.generate_code")
    def test_can_get_reset_code_from_phone(self, mgenerate_code, mtwilio_client):
        """Test can get a reset code via phone"""
        test_code = "123456"
        mgenerate_code.return_value = test_code
        twilio_client = MagicMock()
        mtwilio_client.return_value = twilio_client

        req = APIRequestFactory().post("", {"phone_number": self.user_phone})
        res = self.create_view(req)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        # Just need to not error here
        ForgotPasswordValidation.objects.get(user=self.user)

        twilio_client.messages.create.assert_called_with(
            to=self.user_phone,
            from_=settings.TWILIO_FROM_NUMBER,
            body=f"Your Vuet password reset code is {test_code}",
        )
