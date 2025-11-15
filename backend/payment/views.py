import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.db.models import Sum
from django.utils.timezone import now
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from rest_framework.generics import ListAPIView

from account.models import User
from account.tasks import send_async_email
from dashboard.pdf_builder.utils.builder import generate_pdf
from dashboard.pdf_builder.utils.templates import JOINING_LETTER_LAYOUT
from .models import Payment
from .serializers import PaymentSerializer
from dashboard.permissions import IsAdminOrIsStaff
from dashboard.filters import PaymentFilter

import razorpay

razorpay_client = razorpay.Client(auth=(settings.RAZOR_KEY_ID, settings.RAZOR_KEY_SECRET))

class OrderCreateView(APIView):
    def post(self, request):
        data = request.data.copy()
        if data['payment_for'] == 'member':
            user = User.objects.filter(email=data['email']).first()
            if user and user.is_member_account:
                return Response({"message": "User already a member."})
        razorpay_order = razorpay_client.order.create(dict(amount=data['amount'], currency=data.get('currency', 'INR'), payment_capture='1'))
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
            if payment.payment_for == "member":
                user = User.objects.filter(email=payment.email).first()
                if user:
                    user.is_member_account = True
                    user.save()
                    template_path = os.path.join(settings.BASE_DIR, "dashboard", "pdf_builder", "templates", "documents", "member_welcome_letter.pdf")
                    layout = JOINING_LETTER_LAYOUT
                    data = {
                        "name": user.name,
                        "address": f'{user.city}, {user.district}, {user.state}',
                        "joining_date": user.date_joined.strftime("%d-%m-%Y"),
                        "reg_no": f'{user.user_id}',
                    }
                    pdf_buffer = generate_pdf(template_path, data, document_type=None, layout=layout)
                    email_subject = "Welcome to RSS - Membership Confirmation"
                    email_message = f"Dear {user.name},\n\nWelcome to the RSS family! Please find attached your membership welcome letter.\n\nBest regards,\nRSS Team"
                    recipient_list = [user.email]
                    send_async_email.delay(email_subject, email_message, recipient_list, pdf_data=pdf_buffer.getvalue(), pdf_filename="member_welcome_letter.pdf")
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

class PaymentStatView(APIView):
    def get(self, request):
        current_month = now().month
        current_year = now().year

        total_revenue = (
            Payment.objects.filter(status='COMPLETED')
            .aggregate(total=Sum('amount'))['total'] or 0
        )

        monthly_revenue = (
            Payment.objects.filter(
                status='COMPLETED',
                timestamp__year=current_year,
                timestamp__month=current_month
            ).aggregate(total=Sum('amount'))['total'] or 0
        )

        total_transactions = Payment.objects.count()
        successful_transactions = Payment.objects.filter(status='COMPLETED').count()
        failed_transactions = Payment.objects.filter(status='FAILED').count()
        pending_transactions = Payment.objects.filter(status='PENDING').count()

        active_subscribers = Payment.objects.filter(payment_for__icontains='subscription').count()
        this_month_donations = Payment.objects.filter(
            payment_for__icontains='donation',
            timestamp__year=current_year,
            timestamp__month=current_month
        ).count()

        stats = {
            "totalRevenue": float(total_revenue),
            "monthlyRevenue": float(monthly_revenue),
            "totalTransactions": total_transactions,
            "successfulTransactions": successful_transactions,
            "failedTransactions": failed_transactions,
            "pendingTransactions": pending_transactions,
            "activeSubscribers": active_subscribers,
            "thisMonthDonations": this_month_donations,
        }

        return Response(stats)
    
class PaymentCreateView(APIView):
    permission_classes = [IsAdminOrIsStaff]
    def post(self, request):
        data = request.data
        serializer = PaymentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PaymentListView(ListAPIView):
    permission_classes = [IsAdminOrIsStaff]
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    filter_backends = [SearchFilter, DjangoFilterBackend]
    filterset_class = PaymentFilter
    search_fields = ['payment_id', 'order_id', 'name', 'email', 'phone']

class PaymentDetailView(APIView):
    permission_classes = [IsAdminOrIsStaff]

    def get(self, request, id):
        try:
            payment = Payment.objects.get(id=id)
        except Payment.DoesNotExist:
            return Response({"error": "Payment not found."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = PaymentSerializer(payment)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserPaymentListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentSerializer
    def get_queryset(self):
        user = self.request.user
        return Payment.objects.filter(email=user.email).order_by('-timestamp')