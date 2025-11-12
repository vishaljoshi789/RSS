# users/auth_backends.py
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()

class MultiFieldAuthBackend(ModelBackend):
    """
    Authenticate using email, phone, or user_id.
    """

    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None or password is None:
            return None

        try:
            user = (
                User.objects.filter(email__iexact=username).first()
                or User.objects.filter(phone=username).first()
                or User.objects.filter(user_id=username).first()
            )
        except User.DoesNotExist:
            return None

        if user and user.check_password(password):
            return user
        return None
