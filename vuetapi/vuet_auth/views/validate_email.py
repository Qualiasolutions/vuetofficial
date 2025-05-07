from rest_framework import generics
from rest_framework.viewsets import GenericViewSet
from vuet_auth.models.email_validations import EmailValidation
from vuet_auth.serializers.email_validations import EmailValidationSerializer


class EmailValidationViewSet(GenericViewSet, generics.CreateAPIView, generics.UpdateAPIView):
    """The authentication flow should be as follows:

    - POST a email to this viewset to create a EmailValidation object
    - PATCH a `code` to the relevant EmailValidation object - if it matches the
        auto-generated code then `validated` will be set to True on the object
    - The user is then able to register with Vuet using the `/register` views
    """
    queryset = EmailValidation.objects.all()
    serializer_class = EmailValidationSerializer
