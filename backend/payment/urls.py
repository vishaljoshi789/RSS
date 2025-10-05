from django.urls import path

from .views import OrderCreateView, OrderVerifyView, PaymentStatView

urlpatterns = [
    path('init/', OrderCreateView.as_view(), name='payment-list'),
    path('verify/', OrderVerifyView.as_view(), name='payment-verify'),
    path('stats/', PaymentStatView.as_view, name='payment-stats')
]
