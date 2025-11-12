from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from .views import UserJoinView, UserMemberView, UserListView, UserDetailView, VerifyUserView

urlpatterns = [
    path('join/', UserJoinView.as_view(), name='user_join'),
    path('member/', UserMemberView.as_view(), name='user_member'),
    path('list/', UserListView.as_view(), name='user_list'),
    path('detail/<int:id>/', UserDetailView.as_view(), name='user_detail'),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('verify/<int:id>/', VerifyUserView.as_view(), name='verify_user'),
]