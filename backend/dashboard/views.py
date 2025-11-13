import os
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.generics import ListAPIView
from django.db.models import Count
from django.http import FileResponse
from django_filters.rest_framework import DjangoFilterBackend

from account.models import User
from dashboard.permissions import IsAdminOrIsStaff
from .serializers import UserInfoSerializer, ReferralSerializer
from vyapari.serializers import VyapariSerializer
from vyapari.models import Vyapari
from .models import District, State
from .serializers import DistrictSerializer, StateSerializer
from .pdf_builder.utils.builder import generate_pdf
from .pdf_builder.utils.templates import ID_CARD_LAYOUT, CERTIFICATE_LAYOUT, JOINING_LETTER_LAYOUT



class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.is_business_account:
            vyapari = Vyapari.objects.get(email=user.email)
            vyapari_serializer = VyapariSerializer(vyapari)
        user_serializer = UserInfoSerializer(user)
        data = {
            "user_info": user_serializer.data,
            "vyapari_info": vyapari_serializer.data if user.is_business_account else None,
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
    
class GetDocumentView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        doc_type = request.data.get("document_type")
        user = request.user
        photo = user.image if user.image else None
        if not doc_type:
            return Response({"error": "Missing document type"}, status=400)
        
        qr_text = f"{settings.FRONTEND_URL}/idcard-verify/{user.user_id}"
        if doc_type == "idcard":
            template_path = os.path.join(settings.BASE_DIR, "dashboard", "pdf_builder", "templates", "documents", "id_card.pdf")
            layout = ID_CARD_LAYOUT
            data = {
            "name": user.name,
            "reg_no": f'{user.user_id}',
            "in": user.volunteer.designation if user.is_volunteer else "Member",
            "mob": user.phone,
            "date": user.volunteer.joined_date.strftime("%d-%m-%Y") if user.is_volunteer else user.date_joined.strftime("%d-%m-%Y"),
            "block": f'{user.blood_group}',
            "district": user.district,
            "state": user.state,
            }
            pdf_buffer = generate_pdf(template_path, data, document_type=doc_type, layout=layout, image_file=photo, qr_text=qr_text)
        elif doc_type == "certificate":
            if not user.is_volunteer:
                return Response({"error": "User is not a volunteer"}, status=400)
            template_path = os.path.join(settings.BASE_DIR, "dashboard", "pdf_builder", "templates", "documents", "niyukti.pdf")
            layout = CERTIFICATE_LAYOUT
            data = {
                "image": user.volunteer.image,
                "name": user.volunteer.hindi_name if user.volunteer.hindi_name else user.name,
                "reg_no": f'{user.user_id}',
                "reg_date": user.volunteer.joined_date.strftime("%d-%m-%Y"),
                "valid_till": user.volunteer.joined_date.replace(year=user.volunteer.joined_date.year + 1).strftime("%d-%m-%Y"),
            }
            print(f"[DEBUG] Generating certificate for {data['name']} with reg_no {data['reg_no']}, image: {data['image']}")
            pdf_buffer = generate_pdf(template_path, data, document_type=doc_type, layout=layout, image_file=photo, qr_text=qr_text)
            
        # elif doc_type == "membership_certificate":
        #     if not user.is_member_account:
        #         return Response({"error": "User is not a member"}, status=400)
        #     template_path = os.path.join(settings.BASE_DIR, "dashboard", "pdf_builder", "templates", "documents", "member_welcome_letter.pdf")
        #     layout = JOINING_LETTER_LAYOUT
        #     data = {
        #         "name": user.name,
        #         "address": f'{user.city}, {user.district}, {user.state}',
        #         "joining_date": user.date_joined.strftime("%d-%m-%Y"),
        #         "reg_no": f'R{user.user_id}',
        #     }
        #     pdf_buffer = generate_pdf(template_path, data, document_type=doc_type, layout=layout, image_file=photo, qr_text=qr_text)
        else:
            return Response({"error": "Unknown document type"}, status=400)
        
       
        return FileResponse(
            pdf_buffer,
            as_attachment=True,
            filename=f"{doc_type}.pdf",
            content_type="application/pdf",
        )

class DistrictListView(ListAPIView):
    permission_classes = [AllowAny]
    queryset = District.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['state']
    serializer_class = DistrictSerializer

class StateListView(ListAPIView):
    permission_classes = [AllowAny]
    queryset = State.objects.all()
    serializer_class = StateSerializer