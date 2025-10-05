from django.urls import path 
from .views import UserListView, UserDetailView

urlpatterns = [
    path('users/', UserListView.as_view(), name='user-list'),
    path('user/<int:id>/', UserDetailView.as_view(), name='user-detail'),
]