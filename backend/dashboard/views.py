from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from django.db.models import Count

from account.models import User
from dashboard.permissions import IsAdminOrIsStaff
from .serializers import UserInfoSerializer, ReferralSerializer
from vyapari.serializers import VyapariSerializer
from vyapari.models import Vyapari

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.is_business_user:
            vyapari = Vyapari.objects.get(email=user.email)
            vyapari_serializer = VyapariSerializer(vyapari)
        user_serializer = UserInfoSerializer(user)
        data = {
            "user_info": user_serializer.data,
            "vyapari_info": vyapari_serializer.data if user.is_business_user else None,
        }
        return Response(data, status=status.HTTP_200_OK)

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
    
class ReferralListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ReferralSerializer
    def get_queryset(self):
        user = self.request.user
        return User.objects.filter(referred_by=user).order_by('-date_joined')
    
class UserReferralListView(ListAPIView):
    permission_classes = [IsAdminOrIsStaff]
    serializer_class = ReferralSerializer
    def get_queryset(self):
        user_id = self.kwargs['user_id']
        try:
            user = User.objects.get(user_id=user_id)
        except User.DoesNotExist:
            return User.objects.none()
        return User.objects.filter(referred_by=user).order_by('-date_joined').annotate(referral_count=Count('referrals'))