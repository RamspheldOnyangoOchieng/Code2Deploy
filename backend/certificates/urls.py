from django.urls import path
from .views import (
    CertificateListCreateView, CertificateRetrieveUpdateDestroyView,
    BadgeListCreateView, BadgeRetrieveUpdateDestroyView,
    UserCertificatesView, UserCertificatesWithFilterView,
    UserBadgesView, UserBadgesWithFilterView,
    UserCertificateStatsView, UserBadgeStatsView,
    AwardCertificateView, AwardBadgeView,
    CertificateDetailView, BadgeDetailView
)

app_name = 'certificates'

urlpatterns = [
    # Admin endpoints
    path('admin/certificates/', CertificateListCreateView.as_view(), name='admin-certificate-list'),
    path('admin/certificates/<int:pk>/', CertificateRetrieveUpdateDestroyView.as_view(), name='admin-certificate-detail'),
    path('admin/badges/', BadgeListCreateView.as_view(), name='admin-badge-list'),
    path('admin/badges/<int:pk>/', BadgeRetrieveUpdateDestroyView.as_view(), name='admin-badge-detail'),
    path('admin/award-certificate/', AwardCertificateView.as_view(), name='award-certificate'),
    path('admin/award-badge/', AwardBadgeView.as_view(), name='award-badge'),
    
    # User endpoints
    path('me/certificates/', UserCertificatesView.as_view(), name='user-certificates'),
    path('me/certificates/filter/', UserCertificatesWithFilterView.as_view(), name='user-certificates-filter'),
    path('me/badges/', UserBadgesView.as_view(), name='user-badges'),
    path('me/badges/filter/', UserBadgesWithFilterView.as_view(), name='user-badges-filter'),
    path('me/certificates/stats/', UserCertificateStatsView.as_view(), name='user-certificate-stats'),
    path('me/badges/stats/', UserBadgeStatsView.as_view(), name='user-badge-stats'),
    path('me/certificates/<int:pk>/', CertificateDetailView.as_view(), name='user-certificate-detail'),
    path('me/badges/<int:pk>/', BadgeDetailView.as_view(), name='user-badge-detail'),
] 