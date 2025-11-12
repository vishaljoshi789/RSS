from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

class UserJoinSerializer(serializers.ModelSerializer):
    referred_by = serializers.SlugRelatedField(slug_field='user_id', queryset=User.objects.all(), required=False, allow_null=True)
    class Meta:
        model = User
        fields = ['email', 'password', 'name', 'phone', 'dob', 'user_id', 'username', 'referred_by']
        extra_kwargs = {'password': {'write_only': True}}

class UserMemberSerializer(serializers.ModelSerializer):
    referred_by = serializers.SlugRelatedField(slug_field='user_id', queryset=User.objects.all(), required=False, allow_null=True)
    class Meta:
        model = User
        fields = ['email', 'name', 'phone', 'dob', 'user_id', 'username', 'password', 'is_member_account', 'gender', 'profession', 'image', 'aadhar_number', 'pan_number', 'street', 'sub_district', 'district', 'city', 'state', 'country', 'postal_code', 'referred_by', 'blood_group']

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        user = authenticate(username=username, password=password)
        if not user:
            raise serializers.ValidationError("Invalid credentials. Please check username or password.")
        if not user.is_active:
            raise serializers.ValidationError("User account is disabled.")
        if user.is_blocked:
            raise serializers.ValidationError("User is blocked by admin.")

        refresh = RefreshToken.for_user(user)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
