from django.urls import path
from .views import WingListCreateView, WingDetailView

urlpatterns = [
    path('wings/', WingListCreateView.as_view(), name='wing-list-create'),
    path('wings/<int:pk>/', WingDetailView.as_view(), name='wing-detail'),
]