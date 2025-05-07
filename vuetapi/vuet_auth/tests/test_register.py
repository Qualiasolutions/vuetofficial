import datetime as dt
import logging

import pytz
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIRequestFactory

from core.models.entities.social import Event, GuestListInvite
from core.models.users.user_models import User
from core.utils.categories import Categories
from vuet_auth.models.email_validations import EmailValidation
from vuet_auth.models.phone_validations import PhoneValidation
from vuet_auth.views.register import RegisterView

utc = pytz.UTC


logger = logging.getLogger(__name__)


class TestRegisterView(TestCase):
    """TestRegisterView"""

    def setUp(self):
        # Just make a couple of users to start with
        User.objects.create(phone_number="+447123234345", username="+447123234345")
        User.objects.create(
            email="existing@test.com",
            username="existing@test.com",
        )

    def test_register_with_phone(self):
        """Valid request gives 201 response"""
        test_phone_number = "+447814187441"
        PhoneValidation.objects.create(
            phone_number=test_phone_number, code="123456", validated=True
        )

        register_view = RegisterView.as_view()

        request = APIRequestFactory().post(
            "",
            {
                "phone_number": test_phone_number,
                "password": "test_password",
                "password2": "test_password",
            },
            format="json",
        )

        res = register_view(request)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(res.data["access_token"], "Returns access token")
        self.assertTrue(res.data["refresh_token"], "Returns refresh token")

        created_user = User.objects.get(phone_number=test_phone_number)
        self.assertTrue(created_user.family, "User has a family")

    def test_passwords_dont_match(self):
        """Non-matching passwords gives 400"""
        test_phone_number = "+447814187441"
        PhoneValidation.objects.create(
            phone_number=test_phone_number, code="123456", validated=True
        )

        register_view = RegisterView.as_view()

        bad_password_request = APIRequestFactory().post(
            "",
            {
                "phone_number": test_phone_number,
                "password": "test_password",
                "password2": "test_passworddddddd",
            },
            format="json",
        )

        bad_password_res = register_view(bad_password_request)
        self.assertEqual(bad_password_res.status_code, status.HTTP_400_BAD_REQUEST)

        self.assertEqual(
            bad_password_res.data["password"][0], "Password fields didn't match."
        )

    def test_unvalidated_phone_number(self):
        """Unvalidated phone number gives 400"""
        register_view = RegisterView.as_view()

        bad_phone_request = APIRequestFactory().post(
            "",
            {
                "phone_number": "+447814187111",
                "password": "test_password",
                "password2": "test_password",
            },
            format="json",
        )

        bad_phone_res = register_view(bad_phone_request)
        self.assertEqual(bad_phone_res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            bad_phone_res.data["phone_number"][0], "Phone number not validated"
        )

    def test_register_with_email(self):
        """Valid request gives 201 response"""
        test_email = "test@test.com"
        EmailValidation.objects.create(email=test_email, code="123456", validated=True)

        register_view = RegisterView.as_view()

        request = APIRequestFactory().post(
            "",
            {
                "email": test_email,
                "password": "test_password",
                "password2": "test_password",
            },
            format="json",
        )

        res = register_view(request)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(res.data["access_token"], "Returns access token")
        self.assertTrue(res.data["refresh_token"], "Returns refresh token")

        created_user = User.objects.get(email=test_email)
        self.assertTrue(created_user.family, "User has a family")

    def test_register_with_uppercase_email(self):
        """Valid request gives 201 response"""
        test_email = "TEST@test.com"
        EmailValidation.objects.create(email=test_email, code="123456", validated=True)

        register_view = RegisterView.as_view()

        request = APIRequestFactory().post(
            "",
            {
                "email": test_email,
                "password": "test_password",
                "password2": "test_password",
            },
            format="json",
        )

        res = register_view(request)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(res.data["access_token"], "Returns access token")
        self.assertTrue(res.data["refresh_token"], "Returns refresh token")

        created_user = User.objects.get(email=test_email.lower())
        self.assertTrue(created_user.family, "User has a family")

    def test_unvalidated_email(self):
        """Unvalidated email gives 400"""
        register_view = RegisterView.as_view()

        bad_email_request = APIRequestFactory().post(
            "",
            {
                "email": "test@test.com",
                "password": "test_password",
                "password2": "test_password",
            },
            format="json",
        )

        bad_phone_res = register_view(bad_email_request)
        self.assertEqual(bad_phone_res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(bad_phone_res.data["email"][0], "Email not validated")

    def test_gets_guestlist_invites_for_email(self):
        """Test that invites for the signup email
        are assigned to the new user"""
        test_email = "TEST@test.com"
        user = User.objects.create(
            phone_number="+447123234111", username="+447123234111"
        )
        event = Event.objects.create(
            name="Test Event",
            category=Categories.SOCIAL_INTERESTS.value,
            start_datetime=dt.datetime(year=2023, month=8, day=4, hour=12, minute=30),
            end_datetime=dt.datetime(year=2023, month=8, day=4, hour=16, minute=30),
            owner=user,
        )
        guest_list_invite = GuestListInvite.objects.create(
            entity=event, email=test_email
        )
        EmailValidation.objects.create(email=test_email, code="123456", validated=True)

        register_view = RegisterView.as_view()

        request = APIRequestFactory().post(
            "",
            {
                "email": test_email,
                "password": "test_password",
                "password2": "test_password",
            },
            format="json",
        )

        res = register_view(request)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(res.data["access_token"], "Returns access token")
        self.assertTrue(res.data["refresh_token"], "Returns refresh token")

        created_user = User.objects.get(email=test_email.lower())
        self.assertTrue(created_user.family, "User has a family")

        guest_list_invite.refresh_from_db()
        self.assertEqual(guest_list_invite.user, created_user)

    def test_gets_guestlist_invites_for_phone_number(self):
        """Test that invites for the signup phone number
        are assigned to the new user"""
        test_phone = "+447345678123"
        user = User.objects.create(
            phone_number="+447123234111", username="+447123234111"
        )
        event = Event.objects.create(
            name="Test Event",
            category=Categories.SOCIAL_INTERESTS.value,
            start_datetime=dt.datetime(year=2023, month=8, day=4, hour=12, minute=30),
            end_datetime=dt.datetime(year=2023, month=8, day=4, hour=16, minute=30),
            owner=user,
        )
        guest_list_invite = GuestListInvite.objects.create(
            entity=event, phone_number=test_phone
        )
        PhoneValidation.objects.create(
            phone_number=test_phone, code="123456", validated=True
        )

        register_view = RegisterView.as_view()

        request = APIRequestFactory().post(
            "",
            {
                "phone_number": test_phone,
                "password": "test_password",
                "password2": "test_password",
            },
            format="json",
        )

        res = register_view(request)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(res.data["access_token"], "Returns access token")
        self.assertTrue(res.data["refresh_token"], "Returns refresh token")

        created_user = User.objects.get(phone_number=test_phone)
        self.assertTrue(created_user.family, "User has a family")

        guest_list_invite.refresh_from_db()
        self.assertEqual(guest_list_invite.user, created_user)
