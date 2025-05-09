"""vuet URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import os

from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("auth/", include("vuet_auth.urls")),
    path("core/", include("core.urls")),
    path("docs/", include("docs.urls")),
    path("notifications/", include("notifications.urls")),
    path("subscriptions/", include("subscriptions.urls")),
    path("contact/", include("contact.urls")),
    path("external-calendars/", include("external_calendars.urls")),
]

if os.getenv("USE_SILK_PROFILING", "FALSE").upper() == "TRUE":
    urlpatterns.append(path("silk/", include("silk.urls", namespace="silk")))
