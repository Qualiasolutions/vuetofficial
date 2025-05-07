from rest_framework import generics
from rest_framework.viewsets import GenericViewSet
from vuet_auth.models.phone_validations import PhoneValidation
from vuet_auth.serializers.phone_validations import PhoneValidationSerializer


class PhoneValidationViewSet(GenericViewSet, generics.CreateAPIView, generics.UpdateAPIView):
    """The authentication flow should be as follows:

    - POST a phone_number to this viewset to create a PhoneValidation object
    - PATCH a `code` to the relevant PhoneValidation object - if it matches the
        auto-generated code then `validated` will be set to True on the object
    - The user is then able to register with Vuet using the `/register` views
    """
    queryset = PhoneValidation.objects.all()
    serializer_class = PhoneValidationSerializer
