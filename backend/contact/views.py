from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from django.core.mail import send_mail
from django.conf import settings
from .models import ContactMessage
from .serializers import ContactMessageSerializer
import threading
import logging

logger = logging.getLogger(__name__)

class ContactSubmissionView(generics.CreateAPIView):
    """
    Public endpoint for submitting contact forms.
    Sends an email notification to admins and a confirmation to the user.
    """
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]
    
    def perform_create(self, serializer):
        # Save IP and User Agent if available
        x_forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = self.request.META.get('REMOTE_ADDR')
            
        user_agent = self.request.META.get('HTTP_USER_AGENT')
        
        # Link user if authenticated
        user = self.request.user if self.request.user.is_authenticated else None
        
        instance = serializer.save(
            ip_address=ip,
            user_agent=user_agent,
            user=user
        )
        
        # Send emails asynchronously
        self.send_notification_emails(instance)

    def send_notification_emails(self, instance):
        """Send email notifications in a separate thread"""
        def _send():
            try:
                # 1. Email to Admin
                admin_subject = f"New Contact Message: {instance.subject} [{instance.get_contact_type_display()}]"
                admin_message = f"""
New contact message received from {instance.name} ({instance.email}).

Type: {instance.get_contact_type_display()}
Subject: {instance.subject}
Phone: {instance.phone or 'N/A'}

Message:
{instance.message}

--
View in Admin Panel: {settings.FRONTEND_URL}/admin
"""
                send_mail(
                    admin_subject,
                    admin_message,
                    settings.DEFAULT_FROM_EMAIL,
                    [settings.DEFAULT_FROM_EMAIL], # Send to support/admin email
                    fail_silently=False,
                )
                
                # 2. Confirmation Email to User
                user_subject = f"We've received your message: {instance.subject}"
                user_message = f"""
Hi {instance.name},

Thank you for contacting Code2Deploy. We have received your message regarding "{instance.subject}".

Our team will review your inquiry and get back to you as soon as possible.

Best regards,
Code2Deploy Team
"""
                send_mail(
                    user_subject,
                    user_message,
                    settings.DEFAULT_FROM_EMAIL,
                    [instance.email],
                    fail_silently=False,
                )
                logger.info(f"Contact emails sent for message {instance.id}")
                
            except Exception as e:
                logger.error(f"Failed to send contact emails: {str(e)}")

        thread = threading.Thread(target=_send)
        thread.daemon = True
        thread.start()

class ContactMessageListView(generics.ListAPIView):
    """Admin-only view to list contact messages"""
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['contact_type', 'status']
    search_fields = ['name', 'email', 'subject', 'message']
