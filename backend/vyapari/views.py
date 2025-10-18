from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny
from django.db.models import Q 
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import serializers

from .models import Vyapari, Category, SubCategory, Advertisement
from .serializers import VyapariSerializer, CategorySerializer, SubCategorySerializer, AdvertisementSerializer
from dashboard.permissions import IsAdminOrIsStaff
from account.models import User
from .filters import VyapariFilter

class VyapariListCreateView(ListCreateAPIView):
    queryset = Vyapari.objects.all()
    serializer_class = VyapariSerializer
    
    filter_backends = [DjangoFilterBackend, SearchFilter] 
    
    # 2. Specify the custom FilterSet for DjangoFilterBackend
    filterset_class = VyapariFilter
    search_fields = [
        'name', 
        'address', 
        'tags', 
        'category__name',
        'subcategory__name'
    ]

    def perform_create(self, serializer):
        request = self.request
        referred_by_user = None

        if getattr(request.user, 'is_field_worker', False):
            referred_by_user = request.user
        elif 'referred_by' in request.data:
            referred_by_id = request.data['referred_by']
            try:
                user = User.objects.get(user_id=referred_by_id) 
                if getattr(user, 'is_field_worker', False):
                    referred_by_user = user
                else:
                    raise serializers.ValidationError(
                        {"referred_by": ["The specified user is not a valid field worker."]}
                    )
            except User.DoesNotExist:
                raise serializers.ValidationError(
                    {"referred_by": [f"User with ID {referred_by_id} not found."]}
                )
        if referred_by_user:
            serializer.save(referred_by=referred_by_user)
        else:
            serializer.save()

class VyapariDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Vyapari.objects.all()
    serializer_class = VyapariSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminOrIsStaff()]

class CategoryListCreateView(ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdminOrIsStaff()]
        return [AllowAny()]


class CategoryDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminOrIsStaff()]


class SubCategoryListCreateView(ListCreateAPIView):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdminOrIsStaff()]
        return [AllowAny()]


class SubCategoryDetailView(RetrieveUpdateDestroyAPIView):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminOrIsStaff()]

class AdvertisementListCreateView(ListCreateAPIView):
    queryset = Advertisement.objects.all()
    serializer_class = AdvertisementSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdminOrIsStaff()]
        return [AllowAny()]

    def get_queryset(self):
        queryset = self.queryset
        query_params = self.request.query_params
        
        state = query_params.get('state')
        district = query_params.get('district')
        category_name = query_params.get('category')
        subcategory_name = query_params.get('subcategory')
        is_global_request = query_params.get('type') == 'global'

        has_specific_filter = any([state, district, category_name, subcategory_name])

        if not has_specific_filter and not is_global_request:
            return queryset
        if is_global_request and not has_specific_filter:
            return queryset.filter(ad_type='global')
        
        q_objects = Q()

        if state:
            q_objects &= Q(ad_type='state', vyapari__address__state__iexact=state)
        if district:
            q_objects &= Q(ad_type='district', vyapari__address__district__iexact=district)
        if subcategory_name:
            q_objects &= Q(ad_type='subcategory', vyapari__subcategory__name__iexact=subcategory_name)
        elif category_name:
            q_objects &= Q(ad_type='category', vyapari__category__name__iexact=category_name)
        
        if q_objects:
            queryset = queryset.filter(q_objects).distinct()
        else:
            pass

        return queryset
    
class AdvertisementDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Advertisement.objects.all()
    serializer_class = AdvertisementSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminOrIsStaff()]