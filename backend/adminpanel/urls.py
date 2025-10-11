from django.urls import path 
from .views import ReferralListView, UserListView, UserDetailView, PaymentListView, PaymentDetailView

urlpatterns = [
    path('users/', UserListView.as_view(), name='user-list'),
    path('user/<int:id>/', UserDetailView.as_view(), name='user-detail'),
    path('payments/', PaymentListView.as_view(), name='payment-list'),
    path('payment/<int:id>/', PaymentDetailView.as_view(), name='payment-detail'),
    path('referrals/<str:user_id>/', ReferralListView.as_view(), name='referral-list'),
]