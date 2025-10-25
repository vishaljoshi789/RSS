from django.urls import path
from .views import WingListCreateView, WingDetailView, LevelListCreateView, LevelDetailView, DesignationListCreateView, DesignationDetailView, VolunteerListCreateView, VolunteerDetailView, ApplicationListCreateView, ApplicationDetailView, WingDetailWithLevelsView

urlpatterns = [
    path('wings/', WingListCreateView.as_view(), name='wing-list-create'),
    path('wings/<int:pk>/', WingDetailView.as_view(), name='wing-detail'),
    path('wings/details/', WingDetailWithLevelsView.as_view(), name='wing-detail-with-levels'),

    path('levels/', LevelListCreateView.as_view(), name='level-list-create'),
    path('levels/<int:pk>/', LevelDetailView.as_view(), name='level-detail'),

    path('designations/', DesignationListCreateView.as_view(), name='designation-list-create'),
    path('designations/<int:pk>/', DesignationDetailView.as_view(), name='designation-detail'),

    path('volunteers/', VolunteerListCreateView.as_view(), name='volunteer-list-create'),
    path('volunteers/<int:pk>/', VolunteerDetailView.as_view(), name='volunteer-detail'),

    path('applications/', ApplicationListCreateView.as_view(), name='application-list-create'),
    path('applications/<int:pk>/', ApplicationDetailView.as_view(), name='application-detail'),
]