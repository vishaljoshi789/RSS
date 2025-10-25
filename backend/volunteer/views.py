from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny
from django.db.models import Q, Count
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend

from dashboard.permissions import IsAdminOrIsStaff
from .models import Volunteer, Wing, Level, Designation, Application
from .serializers import VolunteerSerializer, WingSerializer, LevelSerializer, DesignationSerializer, ApplicationSerializer
from .filters import VolunteerFilter, LevelFilter, DesignationFilter

class WingListCreateView(ListCreateAPIView):
    queryset = Wing.objects.all()
    serializer_class = WingSerializer
    search_fields = ['name', 'description']

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
    
class LevelListCreateView(ListCreateAPIView):
    queryset = Level.objects.all()
    serializer_class = LevelSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = LevelFilter
    search_fields = ['name']

    def get_permissions(self):
        if self.request.method in ['POST']:
            return [IsAdminOrIsStaff()]
        return [AllowAny()]
    
class LevelDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Level.objects.all()
    serializer_class = LevelSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAdminOrIsStaff()]
        return [AllowAny()]

class DesignationListCreateView(ListCreateAPIView):
    queryset = Designation.objects.all().annotate(volunteer_count=Count('volunteers'))
    serializer_class = DesignationSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['title']
    filterset_class = DesignationFilter

    def get_permissions(self):
        if self.request.method in ['POST']:
            return [IsAdminOrIsStaff()]
        return [AllowAny()]
    
class DesignationDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Designation.objects.all()
    serializer_class = DesignationSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAdminOrIsStaff()]
        return [AllowAny()]

class VolunteerListCreateView(ListCreateAPIView):
    queryset = Volunteer.objects.all()
    serializer_class = VolunteerSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = VolunteerFilter
    search_fields = ['user__name', 'user__email', 'user__user_id', 'phone_number']

    def get_permissions(self):
        if self.request.method in ['POST']:
            return [IsAdminOrIsStaff()]
        return [AllowAny()]
    
class VolunteerDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Volunteer.objects.all()
    serializer_class = VolunteerSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAdminOrIsStaff()]
        return [AllowAny()]
    
class ApplicationListCreateView(ListCreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['status', 'wing', 'level', 'designation']
    search_fields = ['user__name', 'user__email', 'user__user_id']

class ApplicationDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAdminOrIsStaff()]
        return [AllowAny()]