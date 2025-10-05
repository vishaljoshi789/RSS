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
            
            # Fetch full payment details from Razorpay
            razorpay_payment = razorpay_client.payment.fetch(data['payment_id'])
            
            # Extract only necessary fields into structured JSON
            structured_payment_details = {
                'payment_id': razorpay_payment.get('id'),
                'order_id': razorpay_payment.get('order_id'),
                'amount': razorpay_payment.get('amount'),
                'currency': razorpay_payment.get('currency'),
                'status': razorpay_payment.get('status'),
                'method': razorpay_payment.get('method'),
                
                # Payment method specific details
                'method_details': {
                    # Card details
                    'card': {
                        'network': razorpay_payment.get('card', {}).get('network') if razorpay_payment.get('method') == 'card' else None,
                        'type': razorpay_payment.get('card', {}).get('type') if razorpay_payment.get('method') == 'card' else None,
                        'last4': razorpay_payment.get('card', {}).get('last4') if razorpay_payment.get('method') == 'card' else None,
                        'issuer': razorpay_payment.get('card', {}).get('issuer') if razorpay_payment.get('method') == 'card' else None,
                    } if razorpay_payment.get('method') == 'card' else None,
                    
                    # UPI details
                    'upi': {
                        'vpa': razorpay_payment.get('vpa'),
                    } if razorpay_payment.get('method') == 'upi' else None,
                    
                    # Net Banking details
                    'netbanking': {
                        'bank': razorpay_payment.get('bank'),
                    } if razorpay_payment.get('method') == 'netbanking' else None,
                    
                    # Wallet details
                    'wallet': {
                        'wallet': razorpay_payment.get('wallet'),
                    } if razorpay_payment.get('method') == 'wallet' else None,
                },
                
                # Bank transaction details from acquirer_data
                'acquirer_data': {
                    'bank_transaction_id': razorpay_payment.get('acquirer_data', {}).get('bank_transaction_id'),
                    'rrn': razorpay_payment.get('acquirer_data', {}).get('rrn'),
                    'auth_code': razorpay_payment.get('acquirer_data', {}).get('auth_code'),
                    'upi_transaction_id': razorpay_payment.get('acquirer_data', {}).get('upi_transaction_id'),
                },
                
                # Contact info
                'contact': razorpay_payment.get('contact'),
                'email': razorpay_payment.get('email'),
                
                # Additional info
                'description': razorpay_payment.get('description'),
                'notes': razorpay_payment.get('notes'),
                'created_at': razorpay_payment.get('created_at'),
                'fee': razorpay_payment.get('fee'),
                'tax': razorpay_payment.get('tax'),
            }
            
            # Remove None values and empty dicts from method_details
            if structured_payment_details['method_details'].get('card') and all(v is None for v in structured_payment_details['method_details']['card'].values()):
                structured_payment_details['method_details']['card'] = None
            
            # Store structured payment details
            payment.payment_details = structured_payment_details
            payment.method = razorpay_payment.get('method')
            payment.status = 'COMPLETED'
            payment.payment_id = data['payment_id']
            payment.save()
            
            return Response({
                "message": "Payment verified successfully.", 
                "payment_id": payment.payment_id, 
                "order_id": payment.order_id, 
                "status": payment.status
            }, status=status.HTTP_200_OK)
            
        except razorpay.errors.SignatureVerificationError:
            payment.status = 'FAILED'
            payment.save()
            return Response({"error": "Payment verification failed."}, status=status.HTTP_400_BAD_REQUEST)