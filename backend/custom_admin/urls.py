from django.urls import path
from .views import (
    AdminDashboardStatsView, AdminUserManagementView,
    AdminProgramManagementView, AdminEventManagementView,
    AdminCertificateManagementView, AdminBadgeManagementView,
    AdminMentorManagementView, AdminApplicationManagementView,
    ContactPageSettingsListView, ContactPageSettingsDetailView,
    ContactPageSettingsByTypeView, InitializeContactSettingsView,
    SiteSettingsView,
    HomePageSettingsView, AboutPageSettingsView,
    ProgramsPageSettingsView, EventsPageSettingsView,
    InitializeAllPageSettingsView
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
    
    # Contact Page Settings
    path('contact-settings/', ContactPageSettingsListView.as_view(), name='contact-settings-list'),
    path('contact-settings/initialize/', InitializeContactSettingsView.as_view(), name='contact-settings-init'),
    path('contact-settings/<int:pk>/', ContactPageSettingsDetailView.as_view(), name='contact-settings-detail'),
    path('contact-settings/type/<str:contact_type>/', ContactPageSettingsByTypeView.as_view(), name='contact-settings-by-type'),
    
    # Page Settings
    path('page-settings/home/', HomePageSettingsView.as_view(), name='home-page-settings'),
    path('page-settings/about/', AboutPageSettingsView.as_view(), name='about-page-settings'),
    path('page-settings/programs/', ProgramsPageSettingsView.as_view(), name='programs-page-settings'),
    path('page-settings/events/', EventsPageSettingsView.as_view(), name='events-page-settings'),
    path('page-settings/initialize/', InitializeAllPageSettingsView.as_view(), name='page-settings-init'),
    
    # Site Settings
    path('site-settings/', SiteSettingsView.as_view(), name='site-settings'),
] 