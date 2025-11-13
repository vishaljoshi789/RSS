from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny
from django.db.models import Count
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status

from dashboard.permissions import IsAdminOrIsStaff
from .models import Volunteer, Wing, Level, Designation, Application
from .serializers import VolunteerSerializer, WingSerializer, LevelSerializer, DesignationSerializer, ApplicationSerializer, ApplicationDetailSerializer, Volunteer
from .filters import VolunteerFilter, LevelFilter, DesignationFilter
from account.models import User

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
    
    def create(self, request, *args, **kwargs):
        data = request.data
        wing = data.get("wing")
        levels = data.get("level")
        if not wing or not isinstance(levels, list):
            return Response(
                {"detail": "Invalid data. Expected {'wing': ..., 'level': [...]}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        level_objs = [Level(name=lvl, wing_id=wing) for lvl in levels]
        created_levels = Level.objects.bulk_create(level_objs)
        serializer = self.get_serializer(created_levels, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
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
    
class VolunteerWorkingAreaListCreateView(ListCreateAPIView):
    queryset = Volunteer.objects.all()
    serializer_class = VolunteerSerializer

    def get_permissions(self):
        if self.request.method in ['POST']:
            return [IsAdminOrIsStaff()]
        return [AllowAny()]
    
class ApplicationListCreateView(ListCreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['status', 'wing', 'level', 'designation']
    search_fields = ['user__name', 'user__email', 'user__user_id']

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        referred_by = data.get("referred_by_volunteer")
        referred_user = User.objects.filter(user_id=referred_by).first() if referred_by else None    
        if referred_by and not referred_user:
            return Response({'detail': 'Referring user does not exist.'}, status=400)
        if referred_by and not referred_user.is_volunteer:
            return Response({'detail': 'Referring user is not a volunteer.'}, status=400)
        data["referred_by_volunteer"] = referred_user.id if referred_user else None
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ApplicationDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationDetailSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAdminOrIsStaff()]
        return [AllowAny()]
    
class AssignVolunteerFromApplicationView(RetrieveUpdateDestroyAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

    def put(self, request, *args, **kwargs):
        application = self.get_object()
        referred_by = application.referred_by_volunteer
        volunteer, created = Volunteer.objects.get_or_create(
            user=application.user,
            defaults={
                'phone_number': application.phone_number,
                'wing': application.wing,
                'level': application.level,
                'designation': application.designation,
                'affidavit': application.affidavit,
                'aadhar_card_front': application.aadhar_card_front,
                'aadhar_card_back': application.aadhar_card_back,
                'image': application.image,
                'hindi_name': application.hindi_name,
                'referred_by_volunteer': referred_by,
            }
        )
        if not created:
            return Response({'detail': 'Volunteer already exists.'}, status=400)
        
        application.status = 'Approved'
        application.remarks = request.data.get('remarks', '')
        application.save()

        return Response({'detail': 'Volunteer assigned successfully.'}) 