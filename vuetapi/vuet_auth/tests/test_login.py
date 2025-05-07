import logging

import pytz
from django.contrib.auth.hashers import make_password
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIRequestFactory

from core.models.users.user_models import User
from vuet_auth.views.login import LoginView

utc = pytz.UTC


logger = logging.getLogger(__name__)


class TestLoginView(TestCase):
    """TestLoginView"""

    def setUp(self):
        self.test_phone_number = "+447814187441"
        self.test_email = "test@test.com"
        self.test_password = "TestPassword"
        self.user = User.objects.create(
            phone_number=self.test_phone_number,
            email=self.test_email,
            password=make_password(self.test_password),
        )
        self.login_view = LoginView.as_view()

    def test_login_with_phone_number(self):
        """Test can log in with phone number"""
        # Valid request gives 200 response and tokens
        request = APIRequestFactory().post(
            "",
            {"phone_number": self.test_phone_number, "password": self.test_password},
            format="json",
        )

        res = self.login_view(request)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data["access"])
        self.assertTrue(res.data["refresh"])

    def test_cannot_login_with_wrong_password(self):
        """test_cannot_login_with_wrong_password"""
        # Invalid password gives 401
        bad_password_request = APIRequestFactory().post(
            "",
            {"phone_number": self.test_phone_number, "password": "Incorrect Password"},
            format="json",
        )

        bad_password_res = self.login_view(bad_password_request)
        self.assertEqual(bad_password_res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_cannot_login_with_invalid_phone(self):
        # Invalid phone number gives 401
        bad_phone_request = APIRequestFactory().post(
            "",
            {"phone_number": "+441234567891", "password": self.test_password},
            format="json",
        )

        bad_phone_res = self.login_view(bad_phone_request)
        self.assertEqual(bad_phone_res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_with_email(self):
        """Test can log in with email"""
        # Valid request gives 200 response and tokens
        request = APIRequestFactory().post(
            "",
            {"email": self.test_email, "password": self.test_password},
            format="json",
        )

        res = self.login_view(request)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data["access"])
        self.assertTrue(res.data["refresh"])

    def test_login_with_uppercase_email(self):
        """Test can log in with email in different case"""
        # Valid request gives 200 response and tokens
        request = APIRequestFactory().post(
            "",
            {"email": self.test_email.upper(), "password": self.test_password},
            format="json",
        )

        res = self.login_view(request)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data["access"])
        self.assertTrue(res.data["refresh"])

    def test_cannot_login_with_email_and_wrong_password(self):
        """test_cannot_login_with_email_and_wrong_password"""
        # Invalid password gives 401
        bad_password_request = APIRequestFactory().post(
            "",
            {"email": self.test_email, "password": "Incorrect Password"},
            format="json",
        )

        bad_password_res = self.login_view(bad_password_request)
        self.assertEqual(bad_password_res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_cannot_login_with_invalid_email(self):
        """test_cannot_login_with_invalid_email"""
        # Invalid email gives 401
        bad_phone_request = APIRequestFactory().post(
            "",
            {"email": "fake@email.com", "password": self.test_password},
            format="json",
        )

        bad_phone_res = self.login_view(bad_phone_request)
        self.assertEqual(bad_phone_res.status_code, status.HTTP_401_UNAUTHORIZED)
