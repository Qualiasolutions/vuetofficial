"""Viewsets relating to resetting the password"""

from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from core.models.users.user_models import User
from vuet_auth.models.forgot_password_validations import ForgotPasswordValidation
from vuet_auth.serializers.forgot_password_validations import (
    ForgotPasswordValidationSerializer,
)


class ForgotPasswordValidationViewSet(
    GenericViewSet, generics.CreateAPIView, generics.UpdateAPIView
):
    """ForgotPasswordValidationViewSet"""

    queryset = ForgotPasswordValidation.objects.all()
    serializer_class = ForgotPasswordValidationSerializer


@api_view(["POST"])
def validate_code(request):
    """Validate a code"""
    code = request.data.get("code")
    email = request.data.get("email")
    phone_number = request.data.get("phone_number")

    if email:
        user = User.objects.get(email=email)
    elif phone_number:
        user = User.objects.get(phone_number=phone_number)
    else:
        return Response(
            {"success": False, "error": "email of phone_number must be provided"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    val = ForgotPasswordValidation.objects.filter(user=user).first()

    if val:
        if val.code == code:
            val.validated = True
            val.save()
            return Response(
                {"success": True, "user": user.id},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"success": False, "error": "Invalid code"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    return Response(
        {"success": False, "error": "No code found"}, status=status.HTTP_400_BAD_REQUEST
    )
