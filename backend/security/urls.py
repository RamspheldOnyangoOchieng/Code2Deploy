from django.urls import path
from .views import (
    SecurityDashboardView, AuditLogView, SecurityEventView,
    SystemHealthView, RateLimitMonitoringView, DataPrivacyView
)

app_name = 'security'

urlpatterns = [
    path('dashboard/', SecurityDashboardView.as_view(), name='security-dashboard'),
    path('audit-logs/', AuditLogView.as_view(), name='audit-logs'),
    path('security-events/', SecurityEventView.as_view(), name='security-events'),
    path('security-events/<int:event_id>/', SecurityEventView.as_view(), name='security-event-detail'),
    path('system-health/', SystemHealthView.as_view(), name='system-health'),
    path('rate-limit-monitoring/', RateLimitMonitoringView.as_view(), name='rate-limit-monitoring'),
    path('data-privacy/', DataPrivacyView.as_view(), name='data-privacy'),
] 