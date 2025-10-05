from rest_framework.serializers import ModelSerializer
from rest_framework import serializers

from account.models import User
from payment.models import Payment

class UserInfoSerializer(ModelSerializer):
    referral_count = referral_count = serializers.IntegerField(read_only=True)
    class Meta:
        model = User
        exclude = ['password', 'groups', 'user_permissions', 'is_staff', 'is_active', 'first_name', 'last_name']

class PaymentSerializer(ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'