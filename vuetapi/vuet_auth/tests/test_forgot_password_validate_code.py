import logging
from unittest.mock import MagicMock, patch

import pytz
from django.conf import settings
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIRequestFactory

from core.models.users.user_models import User
from vuet_auth.models.forgot_password_validations import ForgotPasswordValidation
from vuet_auth.views.forgot_password import (
    ForgotPasswordValidationViewSet,
    validate_code,
)

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

        self.test_code = "123456"
        self.validation = ForgotPasswordValidation.objects.create(
            user=self.user, code=self.test_code
        )

    def test_validate_via_email(self):
        """test_validate_via_email"""
        req = APIRequestFactory().post(
            "", {"email": self.user_email, "code": self.test_code}
        )
        res = validate_code(req)

        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_invalid_validate_via_email(self):
        """test_invalid_validate_via_email"""
        req = APIRequestFactory().post("", {"email": self.user_email, "code": "111111"})
        res = validate_code(req)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_validate_via_phone(self):
        """test_validate_via_phone"""
        req = APIRequestFactory().post(
            "", {"phone_number": self.user_phone, "code": self.test_code}
        )
        res = validate_code(req)

        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_invalid_validate_via_phone(self):
        """test_invalid_validate_via_phone"""
        req = APIRequestFactory().post(
            "", {"phone_number": self.user_phone, "code": "111111"}
        )
        res = validate_code(req)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
