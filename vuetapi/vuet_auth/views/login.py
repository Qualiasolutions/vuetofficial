import logging

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken  # type: ignore

from core.models.users.user_models import User
from notifications.utils.send_notification import send_push_message_if_valid

logger = logging.getLogger(__name__)


class LoginView(APIView):
    """A view for logging into Vuet"""

    def post(self, request: Request):
        """post"""
        try:
            user_phone_number = request.data.get("phone_number")
            email = request.data.get("email", "").lower()
            password = request.data.get("password")

            if not password:
                return Response(
                    {"success": False, "detail": "Missing authorization credentials"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            if user_phone_number:
                try:
                    user = User.objects.get(phone_number=user_phone_number)
                except User.DoesNotExist:
                    return Response(
                        {"success": False, "detail": "Invalid phone number"},
                        status=status.HTTP_401_UNAUTHORIZED,
                    )
            elif email:
                try:
                    user = User.objects.get(email__iexact=email)
                except User.DoesNotExist:
                    return Response(
                        {"success": False, "detail": "Invalid email address"},
                        status=status.HTTP_401_UNAUTHORIZED,
                    )
            else:
                return Response(
                    {"success": False, "detail": "Missing authorization credentials"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            if not user.check_password(password):
                return Response(
                    {"success": False, "detail": "Incorrect Password"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            token = RefreshToken.for_user(user)

            push_tokens = user.push_tokens.all()
            for push_token in push_tokens:
                send_push_message_if_valid(
                    push_token,
                    "You have just logged in on another device - was this you?",
                )

            return Response(
                {"refresh": str(token), "access": str(token.access_token)},
                status=status.HTTP_200_OK,
            )

        except Exception as exc:
            return Response(
                {"success": False, "detail": exc}, status=status.HTTP_400_BAD_REQUEST
            )
