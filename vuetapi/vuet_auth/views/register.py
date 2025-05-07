from rest_framework import generics

from core.models.users.user_models import User
from vuet_auth.serializers.register import RegisterSerializer


class RegisterView(generics.CreateAPIView):
    """RegisterView"""

    queryset = User.objects.all()
    serializer_class = RegisterSerializer
