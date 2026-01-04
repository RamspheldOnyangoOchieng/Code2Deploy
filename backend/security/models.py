from django.db import models
from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey


class AuditLog(models.Model):
    """Audit log for tracking user actions and system events"""
    ACTION_TYPES = [
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('password_change', 'Password Change'),
        ('password_reset', 'Password Reset'),
        ('email_confirmation', 'Email Confirmation'),
        ('account_deletion', 'Account Deletion'),
        ('enrollment', 'Program Enrollment'),
        ('registration', 'Event Registration'),
        ('certificate_issued', 'Certificate Issued'),
        ('badge_awarded', 'Badge Awarded'),
        ('admin_action', 'Admin Action'),
        ('security_event', 'Security Event'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='audit_logs')
    action = models.CharField(max_length=50, choices=ACTION_TYPES)
    description = models.TextField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    
    # Generic foreign key for related objects
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey('content_type', 'object_id')
    
    # Additional metadata
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'action']),
            models.Index(fields=['created_at']),
            models.Index(fields=['ip_address']),
        ]
    
    def __str__(self):
        return f"{self.action} by {self.user} at {self.created_at}"


class SecurityEvent(models.Model):
    """Security events and alerts"""
    EVENT_TYPES = [
        ('failed_login', 'Failed Login'),
        ('suspicious_activity', 'Suspicious Activity'),
        ('rate_limit_exceeded', 'Rate Limit Exceeded'),
        ('unauthorized_access', 'Unauthorized Access'),
        ('data_breach', 'Data Breach'),
        ('malware_detected', 'Malware Detected'),
        ('account_compromise', 'Account Compromise'),
    ]
    
    SEVERITY_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    severity = models.CharField(max_length=20, choices=SEVERITY_LEVELS)
    description = models.TextField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='security_events')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    
    # Event details
    details = models.JSONField(default=dict, blank=True)
    resolved = models.BooleanField(default=False)
    resolved_at = models.DateTimeField(null=True, blank=True)
    resolved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='resolved_security_events')
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['event_type', 'severity']),
            models.Index(fields=['resolved']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.event_type} - {self.severity} at {self.created_at}"


class SystemHealth(models.Model):
    """System health monitoring data"""
    STATUS_CHOICES = [
        ('healthy', 'Healthy'),
        ('warning', 'Warning'),
        ('critical', 'Critical'),
        ('maintenance', 'Maintenance'),
    ]
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    component = models.CharField(max_length=100)  # e.g., 'database', 'cache', 'storage'
    message = models.TextField()
    
    # Metrics
    response_time = models.FloatField(null=True, blank=True)  # in milliseconds
    error_rate = models.FloatField(null=True, blank=True)  # percentage
    uptime = models.FloatField(null=True, blank=True)  # percentage
    
    # Additional data
    metrics = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['component', 'status']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.component} - {self.status} at {self.created_at}"


class RateLimitLog(models.Model):
    """Rate limiting logs for monitoring and analysis"""
    LIMIT_TYPES = [
        ('login', 'Login'),
        ('register', 'Register'),
        ('password_reset', 'Password Reset'),
        ('api_request', 'API Request'),
        ('email_send', 'Email Send'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='rate_limit_logs')
    limit_type = models.CharField(max_length=50, choices=LIMIT_TYPES)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    
    # Rate limit details
    request_count = models.PositiveIntegerField()
    limit_threshold = models.PositiveIntegerField()
    window_seconds = models.PositiveIntegerField()
    
    # Action taken
    action_taken = models.CharField(max_length=50, choices=[
        ('allowed', 'Allowed'),
        ('blocked', 'Blocked'),
        ('delayed', 'Delayed'),
    ])
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['limit_type', 'ip_address']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.limit_type} - {self.action_taken} for {self.ip_address}"


class DataPrivacyLog(models.Model):
    """Data privacy and GDPR compliance logging"""
    PRIVACY_ACTIONS = [
        ('data_export', 'Data Export'),
        ('data_deletion', 'Data Deletion'),
        ('consent_given', 'Consent Given'),
        ('consent_withdrawn', 'Consent Withdrawn'),
        ('data_access', 'Data Access'),
        ('data_rectification', 'Data Rectification'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='privacy_logs')
    action = models.CharField(max_length=50, choices=PRIVACY_ACTIONS)
    description = models.TextField()
    
    # Privacy details
    data_categories = models.JSONField(default=list, blank=True)  # List of data categories affected
    legal_basis = models.CharField(max_length=100, blank=True)  # Legal basis for the action
    retention_period = models.CharField(max_length=100, blank=True)  # How long data is retained
    
    # Metadata
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'action']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.action} for {self.user} at {self.created_at}" 