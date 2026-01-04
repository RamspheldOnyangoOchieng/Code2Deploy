from django.db import models
from django.conf import settings


class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('program_enrollment', 'Program Enrollment'),
        ('event_registration', 'Event Registration'),
        ('certificate_issued', 'Certificate Issued'),
        ('badge_awarded', 'Badge Awarded'),
        ('application_update', 'Application Update'),
        ('system_announcement', 'System Announcement'),
        ('mentor_message', 'Mentor Message'),
        ('reminder', 'Reminder'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    STATUS_CHOICES = [
        ('unread', 'Unread'),
        ('read', 'Read'),
        ('archived', 'Archived'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='unread')
    
    # Optional related content
    program = models.ForeignKey('programs.Program', on_delete=models.SET_NULL, null=True, blank=True, related_name='notifications')
    event = models.ForeignKey('events.Event', on_delete=models.SET_NULL, null=True, blank=True, related_name='notifications')
    certificate = models.ForeignKey('certificates.Certificate', on_delete=models.SET_NULL, null=True, blank=True, related_name='notifications')
    badge = models.ForeignKey('certificates.Badge', on_delete=models.SET_NULL, null=True, blank=True, related_name='notifications')
    application = models.ForeignKey('applications.Application', on_delete=models.SET_NULL, null=True, blank=True, related_name='notifications')
    
    # Action data
    action_url = models.URLField(blank=True, null=True)  # URL to navigate to when clicked
    action_text = models.CharField(max_length=100, blank=True, null=True)  # Text for action button
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    sent_via_email = models.BooleanField(default=False)
    sent_via_push = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['notification_type']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"
    
    def mark_as_read(self):
        """Mark notification as read"""
        from django.utils import timezone
        if self.status == 'unread':
            self.status = 'read'
            self.read_at = timezone.now()
            self.save()
    
    def mark_as_archived(self):
        """Mark notification as archived"""
        self.status = 'archived'
        self.save()
    
    @classmethod
    def create_notification(cls, user, notification_type, title, message, **kwargs):
        """Create a new notification"""
        return cls.objects.create(
            user=user,
            notification_type=notification_type,
            title=title,
            message=message,
            **kwargs
        )
    
    @classmethod
    def send_bulk_notification(cls, users, notification_type, title, message, **kwargs):
        """Send notification to multiple users"""
        notifications = []
        for user in users:
            notifications.append(cls(
                user=user,
                notification_type=notification_type,
                title=title,
                message=message,
                **kwargs
            ))
        return cls.objects.bulk_create(notifications)


class NotificationPreference(models.Model):
    """User notification preferences"""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notification_preferences')
    
    # Email preferences
    email_enabled = models.BooleanField(default=True)
    email_program_updates = models.BooleanField(default=True)
    email_event_reminders = models.BooleanField(default=True)
    email_certificate_issued = models.BooleanField(default=True)
    email_badge_awarded = models.BooleanField(default=True)
    email_application_updates = models.BooleanField(default=True)
    email_system_announcements = models.BooleanField(default=True)
    
    # Push notification preferences
    push_enabled = models.BooleanField(default=True)
    push_program_updates = models.BooleanField(default=True)
    push_event_reminders = models.BooleanField(default=True)
    push_certificate_issued = models.BooleanField(default=True)
    push_badge_awarded = models.BooleanField(default=True)
    push_application_updates = models.BooleanField(default=True)
    push_system_announcements = models.BooleanField(default=True)
    
    # Frequency preferences
    digest_frequency = models.CharField(
        max_length=20,
        choices=[
            ('immediate', 'Immediate'),
            ('daily', 'Daily Digest'),
            ('weekly', 'Weekly Digest'),
        ],
        default='immediate'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Notification Preferences - {self.user.username}"
    
    def get_email_preference(self, notification_type):
        """Get email preference for specific notification type"""
        preference_map = {
            'program_enrollment': self.email_program_updates,
            'event_registration': self.email_event_reminders,
            'certificate_issued': self.email_certificate_issued,
            'badge_awarded': self.email_badge_awarded,
            'application_update': self.email_application_updates,
            'system_announcement': self.email_system_announcements,
        }
        return preference_map.get(notification_type, self.email_enabled)
    
    def get_push_preference(self, notification_type):
        """Get push preference for specific notification type"""
        preference_map = {
            'program_enrollment': self.push_program_updates,
            'event_registration': self.push_event_reminders,
            'certificate_issued': self.push_certificate_issued,
            'badge_awarded': self.push_badge_awarded,
            'application_update': self.push_application_updates,
            'system_announcement': self.push_system_announcements,
        }
        return preference_map.get(notification_type, self.push_enabled) 