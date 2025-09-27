from rest_framework import serializers
from .models import User

class UserJoinSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password', 'name', 'phone', 'dob', 'user_id']
        extra_kwargs = {'password': {'write_only': True}}