from django.urls import path
from .views import DistrictCreateView

urlpatterns = [
    path('districts/create/', DistrictCreateView.as_view(), name='district-create'),
]