from django.apps import AppConfig


class AuthConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'vuet_auth'

    def ready(self):
        import vuet_auth.models.signals
