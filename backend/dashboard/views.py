from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from account.models import User

from .serializers import UserInfoSerializer, ReferralSerializer

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserInfoSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UserCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_user = User.objects.all().count()
        verified_user = User.objects.filter(is_verified=True).count()
        blocked_user = User.objects.filter(is_blocked=True).count()
        member_user = User.objects.filter(is_member_account=True).count()
        volunteer_user = User.objects.filter(is_volunteer=True).count()
        business_user = User.objects.filter(is_business_account=True).count()
        staff_user = User.objects.filter(is_staff_account=True).count()
        admin_user = User.objects.filter(is_admin_account=True).count()

        data = {
            "total_user": total_user,
            "verified_user": verified_user,
            "member_user": member_user,
            "volunteer_user": volunteer_user,
            "business_user": business_user,
            "staff_user": staff_user,
            "admin_user": admin_user,
            "blocked_user": blocked_user,
        }
        return Response(data, status=status.HTTP_200_OK)
    
class ReferralListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        referrals = User.objects.filter(referred_by=user)
        serializer = ReferralSerializer(referrals, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)