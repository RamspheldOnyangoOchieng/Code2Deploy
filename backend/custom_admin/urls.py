from django.urls import path
from .views import (
    AdminDashboardStatsView, AdminUserManagementView,
    AdminProgramManagementView, AdminEventManagementView,
    AdminCertificateManagementView, AdminBadgeManagementView,
    AdminMentorManagementView, AdminApplicationManagementView
)

app_name = 'custom_admin'

urlpatterns = [
    path('dashboard/stats/', AdminDashboardStatsView.as_view(), name='dashboard-stats'),
    path('users/', AdminUserManagementView.as_view(), name='user-management'),
    path('users/<int:user_id>/', AdminUserManagementView.as_view(), name='user-detail'),
    path('programs/', AdminProgramManagementView.as_view(), name='program-management'),
    path('events/', AdminEventManagementView.as_view(), name='event-management'),
    path('certificates/', AdminCertificateManagementView.as_view(), name='certificate-management'),
    path('badges/', AdminBadgeManagementView.as_view(), name='badge-management'),
    path('mentors/', AdminMentorManagementView.as_view(), name='mentor-management'),
    path('applications/', AdminApplicationManagementView.as_view(), name='application-management'),
] 