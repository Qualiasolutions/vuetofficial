"""Logout view"""
import logging

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken  # type: ignore


class LogoutView(APIView):
    """LogoutView"""

    def post(self, request):
        """post"""
        try:
            refresh_token = request.data["refresh"]
            refresh_obj = RefreshToken(refresh_token)
            refresh_obj.blacklist()

            return Response({"success": True}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as exc:
            logging.info(exc)
            return Response({"success": False}, status=status.HTTP_400_BAD_REQUEST)
