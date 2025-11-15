from django.urls import path
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)
from .views import UserJoinView, UserMemberView, UserListView, UserDetailView, VerifyUserView, CustomTokenObtainPairView, ChangePasswordView, ChangePasswordByAdminView

urlpatterns = [
    path('join/', UserJoinView.as_view(), name='user_join'),
    path('member/', UserMemberView.as_view(), name='user_member'),
    path('list/', UserListView.as_view(), name='user_list'),
    path('detail/<int:id>/', UserDetailView.as_view(), name='user_detail'),

    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('verify/<int:id>/', VerifyUserView.as_view(), name='verify_user'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('change-password/<int:id>/', ChangePasswordByAdminView.as_view(), name='change_password_by_admin'),
]