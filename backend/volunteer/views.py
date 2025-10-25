from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny
from django.db.models import Q 
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend

from dashboard.permissions import IsAdminOrIsStaff
from .models import Volunteer, Wing, Level, Designation
from .serializers import VolunteerSerializer, WingSerializer, LevelSerializer, DesignationSerializer

class WingListCreateView(ListCreateAPIView):
    queryset = Wing.objects.all()
    serializer_class = WingSerializer

    def get_permissions(self):
        if self.request.method in ['POST']:
            return [IsAdminOrIsStaff()]
        return [AllowAny()]
    
class WingDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Wing.objects.all()
    serializer_class = WingSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAdminOrIsStaff()]
        return [AllowAny()]