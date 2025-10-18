import django_filters
from .models import Vyapari

class VyapariFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(
        field_name='category__name', 
        lookup_expr='iexact'
    )
    subcategory = django_filters.CharFilter(
        field_name='subcategory__name', 
        lookup_expr='iexact'
    )

    city = django_filters.CharFilter(
        field_name='address__city', 
        lookup_expr='icontains',
        label='City (partial match)'
    )
    state = django_filters.CharFilter(
        field_name='address__state', 
        lookup_expr='iexact',
        label='State (exact match)'
    )
    district = django_filters.CharFilter(
        field_name='address__district', 
        lookup_expr='icontains'
    )

    class Meta:
        model = Vyapari
        fields = [
            'tags', 
            'category', 
            'subcategory', 
            'city', 
            'state', 
            'district'
        ]