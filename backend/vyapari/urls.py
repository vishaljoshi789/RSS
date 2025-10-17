from django.urls import path
from .views import (
    VyapariListCreateView, VyapariDetailView, 
    CategoryListCreateView, CategoryDetailView, 
    SubCategoryListCreateView, SubCategoryDetailView, 
    AdvertisementListCreateView, AdvertisementDetailView
)

urlpatterns = [
    path('vyapari/', VyapariListCreateView.as_view(), name='vyapari-list'),
    path('vyapari/<int:pk>/', VyapariDetailView.as_view(), name='vyapari-detail'),

    path('category/', CategoryListCreateView.as_view(), name='category-list'),
    path('category/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),

    path('subcategory/', SubCategoryListCreateView.as_view(), name='subcategory-list'),
    path('subcategory/<int:pk>/', SubCategoryDetailView.as_view(), name='subcategory-detail'),

    path('advertisement/', AdvertisementListCreateView.as_view(), name='advertisement-list'),
    path('advertisement/<int:pk>/', AdvertisementDetailView.as_view(), name='advertisement-detail'),
]