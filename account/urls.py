from django.urls import path
from .views import UserJoinView

urlpatterns = [
    path('join/', UserJoinView.as_view(), name='user-join'),
]