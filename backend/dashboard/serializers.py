from rest_framework.serializers import ModelSerializer

from account.models import User

class UserInfoSerializer(ModelSerializer):
    class Meta:
        model = User
        exclude = ['password']  # Exclude password from being serialized