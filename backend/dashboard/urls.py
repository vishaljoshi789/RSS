from django.urls import path
from .views import DashboardView, DistrictListView, UserCountView, ReferralListView, UserReferralListView, GetDocumentView

urlpatterns = [
    path('', DashboardView.as_view(), name='dashboard'),
    path('user-count/', UserCountView.as_view(), name='user-count'),
    path('referrals/', ReferralListView.as_view(), name='referral-list'),
    path('referrals/<str:user_id>/', UserReferralListView.as_view(), name='user-referral-list'),
    path('documents/generate/', GetDocumentView.as_view(), name='generate-document'),
    path('districts/', DistrictListView.as_view(), name='district-list'),
]