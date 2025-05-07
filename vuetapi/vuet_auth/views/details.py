from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated


class UserDetailsView(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request):
        return Response({
            "username": request.user.username,
            "email": request.user.email,
            "user_id": request.user.id
        }, status=status.HTTP_200_OK)
