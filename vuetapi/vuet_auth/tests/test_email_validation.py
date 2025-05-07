"""phone validation tests"""

# pylint: disable=wrong-import-position

import logging
from unittest.mock import MagicMock, patch

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIRequestFactory

from core.models.users.user_models import User
from vuet_auth.models.email_validations import EmailValidation
from vuet_auth.views.validate_email import EmailValidationViewSet

logger = logging.getLogger(__name__)


class TestEmailValidation(TestCase):
    """TestEmailValidation"""

    @patch("vuet_auth.models.signals.EmailClient")
    @patch("vuet_auth.serializers.phone_validations.generate_code")
    def test_start_validation(self, mgenerate_code, memail):
        """test_start_validation"""
        test_code = "123456"
        mgenerate_code.return_value = test_code
        memail.return_value.send_email = MagicMock()

        start_validation_view = EmailValidationViewSet.as_view({"post": "create"})

        test_email = "test@test.com"

        # Valid request gives 200 response and tokens
        request = APIRequestFactory().post("", {"email": test_email}, format="json")

        res = start_validation_view(request)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertFalse(res.data.get("code"))

        # Invalid email address gives 401
        bad_number_request = APIRequestFactory().post(
            "", {"email": "asd3"}, format="json"
        )

        bad_number_res = start_validation_view(bad_number_request)
        self.assertEqual(bad_number_res.status_code, status.HTTP_400_BAD_REQUEST)

        memail.return_value.send_email.assert_called_once_with(
            "Your Vuet Verification Code",
            "verification-code.html",
            test_email,
            plaintext_template="verification-code.txt",
            data={
                "code": test_code,
            },
        )

        # Can re-request code
        repeat_request = APIRequestFactory().post(
            "", {"email": test_email}, format="json"
        )
        repeat_res = start_validation_view(repeat_request)
        self.assertEqual(repeat_res.status_code, status.HTTP_201_CREATED)

        self.assertEqual(memail.return_value.send_email.call_count, 2)

    def test_cannot_create_duplicate(self):
        """test_cannot_create_duplicate"""
        test_email = "test@test.com"
        start_validation_view = EmailValidationViewSet.as_view({"post": "create"})

        User.objects.create(email=test_email)

        # Duplicate validation gives 400 response
        request = APIRequestFactory().post("", {"email": test_email}, format="json")

        res = start_validation_view(request)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(res.data["email"]["code"], "email_used")

    @patch("vuet_auth.models.signals.EmailClient")
    def test_validate_with_email(self, memail):
        """test_validate_with_phone"""
        memail.return_value.send_email = MagicMock()

        validate_view = EmailValidationViewSet.as_view({"patch": "partial_update"})

        test_email = "test@test.com"
        test_code = "123456"
        validation = EmailValidation.objects.create(email=test_email, code=test_code)

        # Incorrect validation gives 400
        bad_request = APIRequestFactory().patch("", {"code": "111111"}, format="json")
        bad_res = validate_view(bad_request, pk=validation.id)
        self.assertEqual(bad_res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(bad_res.data["code"]["code"], "invalid_code")

        # Correct validation gives 200 response and sets validated to True
        request = APIRequestFactory().patch("", {"code": test_code}, format="json")
        res = validate_view(request, pk=validation.id)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        updated_validation = EmailValidation.objects.get(pk=validation.id)
        self.assertEqual(updated_validation.validated, True)

        memail.return_value.send_email.assert_called_once_with(
            "Your Vuet Verification Code",
            "verification-code.html",
            test_email,
            plaintext_template="verification-code.txt",
            data={
                "code": test_code,
            },
        )
