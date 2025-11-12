from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from datetime import datetime
from django.contrib.auth.hashers import make_password
import uuid
from rest_framework.permissions import IsAuthenticated
from django.db.models import Max

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
        dob_str = data["dob"]
        dob = datetime.strptime(dob_str, "%Y-%m-%d")  # convert string → datetime
        password = dob.strftime("%d%m%Y")
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
        dob_str = data["dob"]  # e.g., "1999-12-05"
        dob = datetime.strptime(dob_str, "%Y-%m-%d")  # convert string → datetime
        password = dob.strftime("%d%m%Y")
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
    queryset = User.objects.annotate(referral_count=Count('user_referrals')).order_by('-date_joined')
    serializer_class = UserInfoSerializer
    filter_backends = [SearchFilter, DjangoFilterBackend]
    filterset_fields = ['is_verified', 'is_blocked', 'is_member_account', 'is_volunteer', 'is_business_account', 'is_staff_account', 'is_admin_account', 'user_id', 'id', 'email']
    search_fields = ['name', 'email', 'phone', 'user_id']

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

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

class VerifyUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        user.is_verified = True
        last_user = User.objects.filter(user_id__startswith="R").aggregate(Max("user_id"))["user_id__max"]
        if last_user:
            last_num = int(last_user[1:])
            new_num = last_num + 1
        else:
            new_num = 1
        user.user_id = f"R{new_num:07d}"
        user.username = user.user_id
        user.save()
        return Response(
            {
                "message": "User verified successfully.",
                "new_user_id": user.user_id
            },
            status=status.HTTP_200_OK,
        )
