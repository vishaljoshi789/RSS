from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from dashboard.permissions import IsAdminOrIsStaff
from dashboard.models import District
from dashboard.serializers import DistrictSerializer

class DistrictCreateView(APIView):
    permission_classes = [IsAdminOrIsStaff]

    def post(self, request):
        data = request.data
        serializer = DistrictSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)