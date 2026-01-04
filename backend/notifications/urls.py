from django.urls import path
from .views import (
    UserNotificationsView, NotificationDetailView, MarkNotificationReadView,
    MarkAllNotificationsReadView, ArchiveNotificationView, NotificationStatsView,
    NotificationPreferencesView, AdminNotificationManagementView,
    AdminNotificationStatsView, AdminNotificationsListView,
    DeleteNotificationView, ClearAllNotificationsView
)

app_name = 'notifications'

urlpatterns = [
    # User endpoints
    path('me/', UserNotificationsView.as_view(), name='user-notifications'),
    path('me/<int:pk>/', NotificationDetailView.as_view(), name='notification-detail'),
    path('me/<int:notification_id>/read/', MarkNotificationReadView.as_view(), name='mark-read'),
    path('me/<int:notification_id>/archive/', ArchiveNotificationView.as_view(), name='archive'),
    path('me/<int:notification_id>/delete/', DeleteNotificationView.as_view(), name='delete'),
    path('me/read-all/', MarkAllNotificationsReadView.as_view(), name='mark-all-read'),
    path('me/clear/', ClearAllNotificationsView.as_view(), name='clear-all'),
    path('me/stats/', NotificationStatsView.as_view(), name='notification-stats'),
    path('me/preferences/', NotificationPreferencesView.as_view(), name='notification-preferences'),
    
    # Admin endpoints
    path('admin/', AdminNotificationsListView.as_view(), name='admin-list'),
    path('admin/send/', AdminNotificationManagementView.as_view(), name='admin-send'),
    path('admin/stats/', AdminNotificationStatsView.as_view(), name='admin-stats'),
] 