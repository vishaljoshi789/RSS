from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.conf import settings

from .models import Payment
from .serializers import PaymentSerializer

import razorpay

razorpay_client = razorpay.Client(auth=(settings.RAZOR_KEY_ID, settings.RAZOR_KEY_SECRET))

class OrderCreateView(APIView):
    def post(self, request):
        data = request.data.copy()
        razorpay_order = razorpay_client.order.create(dict(amount=data['amount'], currency=data.get('currency', 'INR'), payment_capture='0'))
        razorpay_order_id = razorpay_order['id']
        data['order_id'] = razorpay_order_id
        data['payment_id'] = razorpay_order_id
        data['status'] = 'PENDING'
        serializer = PaymentSerializer(data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OrderVerifyView(APIView):
    def post(self, request):
        data = request.data
        try:
            payment = Payment.objects.get(order_id=data['order_id'])
        except Payment.DoesNotExist:
            return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        params_dict = {
            'razorpay_order_id': data['order_id'],
            'razorpay_payment_id': data['payment_id'],
            'razorpay_signature': data['signature']
        }

        try:
            razorpay_client.utility.verify_payment_signature(params_dict)
            payment_details = razorpay_client.payment.fetch(data['payment_id'])
            payment.payment_details = payment_details
            payment.status = 'COMPLETED'
            payment.payment_id = data['payment_id']
            payment.save()
            return Response({"message": "Payment verified successfully.", "payment_id": payment.payment_id, "order_id": payment.order_id, "status": payment.status}, status=status.HTTP_200_OK)
        except razorpay.errors.SignatureVerificationError:
            payment.status = 'FAILED'
            payment.save()
            return Response({"error": "Payment verification failed."}, status=status.HTTP_400_BAD_REQUEST)