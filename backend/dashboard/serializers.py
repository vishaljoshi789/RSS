from rest_framework.serializers import ModelSerializer
from rest_framework import serializers

from .models import District
from account.models import User
from payment.models import Payment

class UserInfoSerializer(ModelSerializer):
    referral_count = serializers.IntegerField(read_only=True)
    referred_by = serializers.SlugRelatedField(slug_field='user_id', read_only=True)
    class Meta:
        model = User
        exclude = ['password', 'groups', 'user_permissions', 'is_staff', 'is_active', 'first_name', 'last_name']

class ReferralSerializer(ModelSerializer):
    referral_count = serializers.IntegerField(read_only=True)
    class Meta:
        model = User
        fields = ['id', 'user_id', 'name', 'image', 'gender', 'profession', 'email', 'is_verified', 'is_blocked', 'is_member_account', 'is_volunteer', 'is_business_account', 'is_staff_account', 'is_admin_account', 'is_field_worker', 'date_joined', 'referral_count']

class DistrictSerializer(ModelSerializer):
    class Meta:
        model = District
        fields = '__all__'