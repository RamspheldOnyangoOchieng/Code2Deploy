import os
import threading
import logging
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from .serializers import UserCreateSerializer, UserProfileSerializer, MessageSerializer
from django.shortcuts import redirect
from rest_framework.throttling import AnonRateThrottle
from djoser.views import UserViewSet
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from .serializers import UserProfileSerializer
from programs.serializers import EnrollmentSerializer
from events.serializers import EventRegistrationSerializer
from programs.models import Enrollment
from events.models import EventRegistration
from rest_framework.generics import ListAPIView
from django.utils import timezone
from rest_framework.permissions import AllowAny

logger = logging.getLogger(__name__)


def send_email_async(subject, plain_message, from_email, recipient_list, html_message=None):
    """Send email in a background thread to prevent blocking the request."""
    def send():
        try:
            send_mail(
                subject,
                plain_message,
                from_email,
                recipient_list,
                fail_silently=False,
                html_message=html_message
            )
            logger.info(f"Email sent successfully to {recipient_list}")
        except Exception as e:
            logger.error(f"Failed to send email to {recipient_list}: {str(e)}")
    
    thread = threading.Thread(target=send)
    thread.daemon = True
    thread.start()

User = get_user_model()

CODE2DEPLOY_EMAIL_BRAND = """
<div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f7fafc; padding: 32px; border-radius: 12px; max-width: 480px; margin: 0 auto;">
  <div style="text-align: center;">
    <img src='https://code2deploy.tech/logo2-clear.png' alt='Code2Deploy' style='height: 48px; margin-bottom: 16px;' />
    <h2 style="color: #03325a; margin-bottom: 8px;">Welcome to Code2Deploy!</h2>
  </div>
  <p style="color: #222; font-size: 1.1em; margin-bottom: 24px;">{message}</p>
  <div style="text-align: center; margin-bottom: 24px;">
    <a href="{button_url}" style="background: linear-gradient(90deg,#30d9fe,#eec262); color: #03325a; font-weight: bold; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 1.1em; box-shadow: 0 2px 8px #30d9fe22;">{button_text}</a>
  </div>
  <p style="color: #888; font-size: 0.95em; text-align: center;">If you did not request this, you can safely ignore this email.<br/>Code2Deploy &copy; 2024</p>
</div>
"""

class RegisterRateThrottle(AnonRateThrottle):
    rate = '5/hour'

class ResendConfirmationRateThrottle(AnonRateThrottle):
    rate = '3/hour'

class RegisterView(APIView):
    throttle_classes = [RegisterRateThrottle]
    permission_classes = [AllowAny]
    serializer_class = MessageSerializer
    
    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            # Create user as inactive until email is confirmed
            user = serializer.save()
            user.is_active = False
            user.save()
            
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            
            # Build frontend confirmation URL instead of backend
            frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173')
            confirm_url = f'{frontend_url}/confirm-email?uid={uid}&token={token}'
            
            html_message = CODE2DEPLOY_EMAIL_BRAND.format(
                message="Thank you for signing up! Please confirm your email to activate your account.",
                button_url=confirm_url,
                button_text="Confirm Email"
            )
            
            # Send email asynchronously to prevent timeout
            send_email_async(
                'Confirm your Code2Deploy account',
                f'Please confirm your account: {confirm_url}',
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                html_message=html_message
            )
            
            return Response({
                'detail': '🎉 Signup successful! Please check your email and click the confirmation link to activate your account.',
                'email_sent': True,
                'requires_confirmation': True
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ConfirmEmailView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Handle email confirmation from link (redirects to frontend)"""
        uidb64 = request.GET.get('uid')
        token = request.GET.get('token')
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173')
        
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
            
        if user and default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            return redirect(f'{frontend_url}/confirmed?success=true')
        return redirect(f'{frontend_url}/confirmed?success=false&error=invalid_token')
    
    def post(self, request):
        """Handle email confirmation via API (for frontend SPA routing)"""
        uid = request.data.get('uid')
        token = request.data.get('token')
        
        if not uid or not token:
            return Response({'detail': 'Missing confirmation parameters.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            decoded_uid = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=decoded_uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'detail': 'Invalid confirmation link.'}, status=status.HTTP_400_BAD_REQUEST)
            
        if default_token_generator.check_token(user, token):
            if user.is_active:
                return Response({'detail': 'Email already confirmed. You can log in.', 'already_confirmed': True}, status=status.HTTP_200_OK)
            user.is_active = True
            user.save()
            return Response({'detail': '🎉 Email confirmed successfully! You can now log in.', 'confirmed': True}, status=status.HTTP_200_OK)
        return Response({'detail': 'Invalid or expired confirmation link.'}, status=status.HTTP_400_BAD_REQUEST)

class ResendConfirmationEmailView(APIView):
    throttle_classes = [ResendConfirmationRateThrottle]
    permission_classes = [AllowAny]
    serializer_class = MessageSerializer
    
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'detail': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(email=email, is_active=False)
        except User.DoesNotExist:
            # Don't reveal whether email exists for security
            return Response({'detail': 'If an account with this email exists and is not yet confirmed, a new confirmation email will be sent.'}, status=status.HTTP_200_OK)
        
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173')
        confirm_url = f'{frontend_url}/confirm-email?uid={uid}&token={token}'
        
        html_message = CODE2DEPLOY_EMAIL_BRAND.format(
            message="You requested a new confirmation email. Please confirm your email to activate your Code2Deploy account.",
            button_url=confirm_url,
            button_text="Confirm Email"
        )
        
        # Send email asynchronously
        send_email_async(
            'Resend: Confirm your Code2Deploy account',
            f'Please confirm your account: {confirm_url}',
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            html_message=html_message
        )
        
        return Response({'detail': 'A new confirmation email has been sent! Please check your inbox.'}, status=status.HTTP_200_OK)

class LoginRateThrottle(AnonRateThrottle):
    rate = '10/hour'

class CustomTokenCreateView(APIView):
    throttle_classes = [LoginRateThrottle]
    permission_classes = [AllowAny]
    
    def post(self, request):
        from rest_framework_simplejwt.tokens import RefreshToken
        from django.contrib.auth import authenticate
        
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({'detail': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(username=username, password=password)
        
        if not user:
            return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        if not user.is_active:
            return Response({'detail': 'Please confirm your email before logging in.'}, status=status.HTTP_400_BAD_REQUEST)
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'detail': '🎉 Login successful! Welcome back to Code2Deploy.'
        }, status=status.HTTP_200_OK)

class PasswordResetRateThrottle(AnonRateThrottle):
    rate = '10/hour'  # Increased for development

class CustomPasswordResetView(APIView):
    throttle_classes = [PasswordResetRateThrottle]
    permission_classes = [AllowAny]
    serializer_class = MessageSerializer
    
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'detail': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Don't reveal if email exists or not (security best practice)
            return Response({
                'detail': '✅ If your email is registered, a password reset link has been sent! Please check your inbox (and spam folder).'
            }, status=status.HTTP_200_OK)
        
        # Generate password reset token
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        
        # Create frontend reset URL
        frontend_reset_url = f'http://localhost:3000/reset-password?uid={uid}&token={token}'
        
        html_message = CODE2DEPLOY_EMAIL_BRAND.format(
            message=f"Hi {user.first_name or user.username},<br/><br/>You requested a password reset for your Code2Deploy account. Click the button below to reset your password. This link will expire in 24 hours.",
            button_url=frontend_reset_url,
            button_text="Reset Password"
        )
        
        try:
            send_mail(
                'Reset your Code2Deploy password',
                f'Reset your password: {frontend_reset_url}',
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
                html_message=html_message
            )
            return Response({
                'detail': '✅ Password reset link sent! Please check your email (and spam folder).'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            # For development, show the reset link in the response
            if settings.DEBUG:
                return Response({
                    'detail': '⚠️ Email service not configured. Use this link to reset password:',
                    'reset_url': frontend_reset_url,
                    'uid': uid,
                    'token': token
                }, status=status.HTTP_200_OK)
            return Response({
                'detail': '✅ If your email is registered, a password reset link has been sent! Please check your inbox (and spam folder).'
            }, status=status.HTTP_200_OK)


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    serializer_class = MessageSerializer
    def post(self, request):
        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        
        if not all([uidb64, token, new_password]):
            return Response({'detail': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'detail': 'Invalid reset link.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not default_token_generator.check_token(user, token):
            return Response({'detail': 'Invalid or expired reset link.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Set new password
        user.set_password(new_password)
        user.save()
        
        return Response({'detail': '🎉 Password reset successful! You can now login with your new password.'}, status=status.HTTP_200_OK)

class UserProfileView(RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class UserEnrollmentsView(ListAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.filter(user=self.request.user)

class UserEventRegistrationsView(ListAPIView):
    serializer_class = EventRegistrationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return EventRegistration.objects.filter(user=self.request.user)


class UserAccountDeletionView(APIView):
    """User: Request account deletion with confirmation"""
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer
    
    def post(self, request):
        user = request.user
        password = request.data.get('password')
        confirmation_text = request.data.get('confirmation_text')
        
        if not password:
            return Response({'detail': 'Password is required for account deletion.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not user.check_password(password):
            return Response({'detail': 'Invalid password.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if confirmation_text != 'DELETE MY ACCOUNT':
            return Response({'detail': 'Please type "DELETE MY ACCOUNT" to confirm.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Generate deletion token
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        deletion_url = request.build_absolute_uri(
            reverse('users:confirm-account-deletion') + f'?uid={uid}&token={token}'
        )
        
        html_message = CODE2DEPLOY_EMAIL_BRAND.format(
            message="You requested to delete your Code2Deploy account. Click the button below to permanently delete your account and all associated data.",
            button_url=deletion_url,
            button_text="Delete Account"
        )
        
        send_mail(
            'Confirm Account Deletion - Code2Deploy',
            f'Confirm account deletion: {deletion_url}',
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
            html_message=html_message
        )
        
        return Response({
            'detail': 'Account deletion confirmation email sent. Please check your inbox and click the confirmation link to permanently delete your account.'
        }, status=status.HTTP_200_OK)


class ConfirmAccountDeletionView(APIView):
    permission_classes = [AllowAny]
    serializer_class = MessageSerializer
    """User: Confirm account deletion and cleanup data"""
    
    def post(self, request):
        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        
        if not all([uidb64, token]):
            return Response({'detail': 'Invalid deletion request.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'detail': 'Invalid deletion link.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not default_token_generator.check_token(user, token):
            return Response({'detail': 'Invalid or expired deletion link.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Store user info for audit log (optional)
        deleted_user_info = {
            'username': user.username,
            'email': user.email,
            'unique_id': user.unique_id,
            'date_joined': user.date_joined,
            'deleted_at': timezone.now()
        }
        
        # Delete user and all related data
        user.delete()
        
        return Response({
            'detail': 'Account successfully deleted. All your data has been permanently removed from our systems.'
        }, status=status.HTTP_200_OK)


class UserDataExportView(APIView):
    """User: Export their data before deletion"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Collect user data
        user_data = {
            'profile': {
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'unique_id': user.unique_id,
                'role': user.role,
                'phone': user.phone,
                'organization': user.organization,
                'avatar': user.avatar,
                'date_joined': user.date_joined,
                'last_login': user.last_login,
            },
            'enrollments': [],
            'event_registrations': [],
            'certificates': [],
            'badges': [],
            'notifications': [],
            'export_date': timezone.now().isoformat()
        }
        
        # Add enrollments
        for enrollment in user.enrollments.all():
            user_data['enrollments'].append({
                'program_title': enrollment.program.title,
                'status': enrollment.status,
                'progress': enrollment.progress,
                'enrolled_at': enrollment.enrolled_at.isoformat()
            })
        
        # Add event registrations
        for registration in user.event_registrations.all():
            user_data['event_registrations'].append({
                'event_title': registration.event.title,
                'status': registration.status,
                'registered_at': registration.registered_at.isoformat()
            })
        
        # Add certificates
        for certificate in user.certificates.all():
            user_data['certificates'].append({
                'title': certificate.title,
                'certificate_type': certificate.certificate_type,
                'status': certificate.status,
                'issued_date': certificate.issued_date.isoformat(),
                'score': certificate.score
            })
        
        # Add badges
        for badge in user.badges.all():
            user_data['badges'].append({
                'title': badge.title,
                'badge_type': badge.badge_type,
                'points': badge.points,
                'awarded_date': badge.awarded_date.isoformat()
            })
        
        # Add recent notifications
        for notification in user.notifications.all()[:50]:  # Last 50 notifications
            user_data['notifications'].append({
                'title': notification.title,
                'message': notification.message,
                'notification_type': notification.notification_type,
                'created_at': notification.created_at.isoformat()
            })
        
        return Response(user_data) 