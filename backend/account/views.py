from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from django.contrib.auth.hashers import make_password
import uuid

from account.models import User
from rest_framework.generics import ListAPIView
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count
from dashboard.permissions import IsAdminOrIsStaff
from dashboard.serializers import UserInfoSerializer
from .serializers import UserJoinSerializer, UserMemberSerializer

def generate_user_id():
    return str(uuid.uuid4())[:8]

class UserJoinView(APIView):
    def post(self, request):
        data = request.data.copy()
        
        if "dob" not in data:
            return Response({"error": "Date of birth (dob) is required."}, status=status.HTTP_400_BAD_REQUEST)
        if "email" not in data:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=data["email"]).exists():
            return Response({"error": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)
        if "name" not in data:
            return Response({"error": "Name is required."}, status=status.HTTP_400_BAD_REQUEST)
        if "phone" not in data:
            return Response({"error": "Phone number is required."}, status=status.HTTP_400_BAD_REQUEST)
        password = data["dob"]
        data["password"] = make_password(password)
        data["username"] = data["email"]
        user_id = generate_user_id()
        while User.objects.filter(user_id=user_id).exists():
            user_id = generate_user_id()
        data["user_id"] = user_id
        serializer = UserJoinSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserMemberView(APIView):
    def post(self, request):
        data = request.data.copy()
        password = data["dob"].strftime("%d%m%Y")
        data["password"] = make_password(password)
        data["username"] = data["email"]
        user = User.objects.filter(email=data["email"]).first()
        if user:
            serializer = UserMemberSerializer(user, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user_id = generate_user_id()
        while User.objects.filter(user_id=user_id).exists():
            user_id = generate_user_id()
        data["user_id"] = user_id
        serializer = UserMemberSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserListView(ListAPIView):
    permission_classes = [IsAdminOrIsStaff]
    queryset = User.objects.annotate(referral_count=Count('referrals'))
    serializer_class = UserInfoSerializer
    filter_backends = [SearchFilter, DjangoFilterBackend]
    filterset_fields = ['is_verified', 'is_blocked', 'is_member_account', 'is_volunteer', 'is_business_account', 'is_staff_account', 'is_admin_account', 'user_id', 'id', 'email']
    search_fields = ['name', 'email', 'phone', 'user_id']

class UserDetailView(APIView):
    permission_classes = [IsAdminOrIsStaff]

    def get(self, request, id):
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UserInfoSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, id):
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def put(self, request, id):
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UserInfoSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)