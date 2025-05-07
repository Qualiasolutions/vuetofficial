from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (  # type: ignore
    TokenRefreshView,
    TokenVerifyView,
)

from vuet_auth.views.details import UserDetailsView
from vuet_auth.views.forgot_password import (
    ForgotPasswordValidationViewSet,
    validate_code,
)
from vuet_auth.views.login import LoginView
from vuet_auth.views.logout import LogoutView
from vuet_auth.views.register import RegisterView
from vuet_auth.views.validate_email import EmailValidationViewSet
from vuet_auth.views.validate_phone import PhoneValidationViewSet

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("token/", LoginView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("token/blacklist/", LogoutView.as_view(), name="token_blacklist"),
    path("details/", UserDetailsView.as_view(), name="user_details"),
    path(
        "validate-password-reset-code/",
        validate_code,
        name="validate_password_reset_code",
    ),
]

router = DefaultRouter()
router.register(
    r"phone-validation",
    PhoneValidationViewSet,
    basename="phone_validation",
)
router.register(
    r"email-validation",
    EmailValidationViewSet,
    basename="email_validation",
)
router.register(
    r"password-reset-code",
    ForgotPasswordValidationViewSet,
    basename="password_reset_code",
)

urlpatterns += router.urls
