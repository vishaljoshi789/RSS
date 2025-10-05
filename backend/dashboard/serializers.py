from rest_framework.serializers import ModelSerializer

from account.models import User
from payment.models import Payment

class UserInfoSerializer(ModelSerializer):
    class Meta:
        model = User
        exclude = ['password']  # Exclude password from being serialized

class PaymentSerializer(ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'