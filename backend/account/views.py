from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from django.contrib.auth.hashers import make_password
import uuid

from account.models import User

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
        password = data["dob"].replace("-", "")
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
        password = data["dob"].replace("-", "")
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