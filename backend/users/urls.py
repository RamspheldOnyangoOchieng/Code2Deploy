from django.urls import path
from .views import RegisterView, ConfirmEmailView, ResendConfirmationEmailView, CustomTokenCreateView, CustomPasswordResetView, PasswordResetConfirmView, UserProfileView, UserEnrollmentsView, UserEventRegistrationsView, UserAccountDeletionView, ConfirmAccountDeletionView, UserDataExportView

app_name = 'users'

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('confirm-email/', ConfirmEmailView.as_view(), name='confirm-email'),
    path('resend-confirmation/', ResendConfirmationEmailView.as_view(), name='resend-confirmation'),
    path('jwt/create/', CustomTokenCreateView.as_view(), name='jwt-create'),
    path('password/reset/', CustomPasswordResetView.as_view(), name='password-reset'),
    path('password/reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('me/', UserProfileView.as_view(), name='me'),
    path('me/programs/', UserEnrollmentsView.as_view(), name='me-programs'),
    path('me/events/', UserEventRegistrationsView.as_view(), name='me-events'),
    path('me/delete/', UserAccountDeletionView.as_view(), name='account-deletion'),
    path('me/delete/confirm/', ConfirmAccountDeletionView.as_view(), name='confirm-account-deletion'),
    path('me/export/', UserDataExportView.as_view(), name='data-export'),
] 