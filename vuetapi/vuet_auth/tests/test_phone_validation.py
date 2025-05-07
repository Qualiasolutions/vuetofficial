"""phone validation tests"""

# pylint: disable=wrong-import-position

from unittest.mock import MagicMock, patch
import django

django.setup()

from django.conf import settings
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIRequestFactory

from core.models.users.user_models import User
from vuet_auth.models.phone_validations import PhoneValidation
from vuet_auth.views.validate_phone import PhoneValidationViewSet


class TestStartValidationView(TestCase):
    """TestStartValidationView"""
    @patch("vuet_auth.models.signals.Client")
    @patch("vuet_auth.serializers.phone_validations.generate_code")
    def test_start_validation(self, mgenerate_code, mtwilio_client):
        """test_start_validation"""
        test_code = "123456"
        mgenerate_code.return_value = test_code
        twilio_client = MagicMock()
        mtwilio_client.return_value = twilio_client

        start_validation_view = PhoneValidationViewSet.as_view({"post": "create"})

        test_phone_number = "+447814187441"

        # Valid request gives 200 response and tokens
        request = APIRequestFactory().post(
            "", {"phone_number": test_phone_number}, format="json"
        )

        res = start_validation_view(request)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertFalse(res.data.get("code"))

        # Invalid phone_number gives 401
        bad_number_request = APIRequestFactory().post(
            "", {"phone_number": "asd3"}, format="json"
        )

        bad_number_res = start_validation_view(bad_number_request)
        self.assertEqual(bad_number_res.status_code, status.HTTP_400_BAD_REQUEST)

        # Can re-request code
        repeat_request = APIRequestFactory().post(
            "", {"phone_number": test_phone_number}, format="json"
        )
        repeat_res = start_validation_view(repeat_request)
        self.assertEqual(repeat_res.status_code, status.HTTP_201_CREATED)

        twilio_client.messages.create.assert_called_with(
            to=test_phone_number,
            from_=settings.TWILIO_FROM_NUMBER,
            body=f"Your Vuet App access code is {test_code}",
        )

    def test_cannot_create_duplicate(self):
        """test_cannot_create_duplicate"""
        test_phone_number = "+447814187441"
        start_validation_view = PhoneValidationViewSet.as_view({"post": "create"})

        User.objects.create(phone_number=test_phone_number)

        # Duplicate validation gives 400 response
        request = APIRequestFactory().post(
            "", {"phone_number": test_phone_number}, format="json"
        )

        res = start_validation_view(request)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(res.data["phone_number"]["code"], "phone_number_used")

    @patch("vuet_auth.models.signals.Client")
    def test_validate_with_phone(self, mtwilio_client):
        """test_validate_with_phone"""
        twilio_client = MagicMock()
        mtwilio_client.return_value = twilio_client

        validate_view = PhoneValidationViewSet.as_view({"patch": "partial_update"})

        test_phone_number = "+447814187441"
        test_code = "123456"
        validation = PhoneValidation.objects.create(
            phone_number=test_phone_number, code=test_code
        )

        # Incorrect validation gives 400
        bad_request = APIRequestFactory().patch("", {"code": "111111"}, format="json")
        bad_res = validate_view(bad_request, pk=validation.id)
        self.assertEqual(bad_res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(bad_res.data["code"]["code"], "invalid_code")

        # Correct validation gives 200 response and sets validated to True
        request = APIRequestFactory().patch("", {"code": test_code}, format="json")
        res = validate_view(request, pk=validation.id)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        updated_validation = PhoneValidation.objects.get(pk=validation.id)
        self.assertEqual(updated_validation.validated, True)

        twilio_client.messages.create.assert_called_with(
            to=test_phone_number,
            from_=settings.TWILIO_FROM_NUMBER,
            body=f"Your Vuet App access code is {test_code}",
        )
