from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import Notification, NotificationPreference
import threading
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Notification)
def send_notification_email(sender, instance, created, **kwargs):
    """
    Signal to send email when a new notification is created,
    respecting user preferences.
    """
    if not created:
        return
        
    # Check if we should send email
    if not should_send_email(instance):
        return
        
    # Send email asynchronously
    send_email_async(instance)

def should_send_email(notification):
    """Check user preferences for email notifications"""
    user = notification.user
    
    # Check global setting
    if not getattr(settings, 'EMAIL_NOTIFICATIONS_ENABLED', True):
        return False
        
    # Check user preferences
    try:
        prefs = user.notification_preferences
        return prefs.get_email_preference(notification.notification_type)
    except NotificationPreference.DoesNotExist:
        # Default to True if no preferences exist
        # Or create default preferences
        NotificationPreference.objects.create(user=user)
        return True

def send_email_async(notification):
    """Send email in a background thread"""
    def _send():
        try:
            subject = f"{settings.EMAIL_SUBJECT_PREFIX} {notification.title}"
            # Simple text message for now, can be HTML template later
            message = f"""
Hello {notification.user.first_name or notification.user.username},

{notification.message}

{f'Action: {notification.action_text}: {notification.action_url}' if notification.action_url else ''}

--
Code2Deploy Team
{settings.FRONTEND_URL}
"""
            
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [notification.user.email],
                fail_silently=False,
            )
            
            # Update status
            notification.sent_via_email = True
            notification.save(update_fields=['sent_via_email'])
            
            logger.info(f"Notification email sent to {notification.user.email}")
            
        except Exception as e:
            logger.error(f"Failed to send notification email: {str(e)}")
            
    thread = threading.Thread(target=_send)
    thread.daemon = True
    thread.start()
