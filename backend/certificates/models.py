from django.db import models
from django.conf import settings
from cloudinary.models import CloudinaryField


class Certificate(models.Model):
    CERTIFICATE_TYPES = [
        ('program_completion', 'Program Completion'),
        ('event_attendance', 'Event Attendance'),
        ('skill_achievement', 'Skill Achievement'),
        ('special_recognition', 'Special Recognition'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('issued', 'Issued'),
        ('expired', 'Expired'),
        ('revoked', 'Revoked'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='certificates')
    title = models.CharField(max_length=200)
    description = models.TextField()
    certificate_type = models.CharField(max_length=50, choices=CERTIFICATE_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Optional relationships
    program = models.ForeignKey('programs.Program', on_delete=models.SET_NULL, null=True, blank=True, related_name='certificates')
    event = models.ForeignKey('events.Event', on_delete=models.SET_NULL, null=True, blank=True, related_name='certificates')
    
    # Certificate details
    issued_date = models.DateTimeField(auto_now_add=True)
    expiry_date = models.DateTimeField(null=True, blank=True)
    certificate_url = models.URLField(blank=True, null=True)  # Link to downloadable certificate
    certificate_id = models.CharField(max_length=50, unique=True, blank=True)
    
    # Metadata
    skills_covered = models.JSONField(default=list, blank=True)  # List of skills
    score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)  # Optional score/grade
    issued_by = models.CharField(max_length=100, default='Code2Deploy')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        if not self.certificate_id:
            import uuid
            self.certificate_id = f'CERT-{uuid.uuid4().hex[:12].upper()}'
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"
    
    class Meta:
        ordering = ['-issued_date']


class Badge(models.Model):
    BADGE_TYPES = [
        ('achievement', 'Achievement'),
        ('participation', 'Participation'),
        ('skill', 'Skill'),
        ('milestone', 'Milestone'),
        ('special', 'Special'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='badges')
    title = models.CharField(max_length=100)
    description = models.TextField()
    badge_type = models.CharField(max_length=20, choices=BADGE_TYPES)
    
    # Badge details
    icon = CloudinaryField(
        'badge', 
        folder='code2deploy/badges', 
        blank=True, 
        null=True,
        transformation=[
            {'width': 400, 'height': 400, 'crop': 'limit'},
            {'quality': 'auto', 'fetch_format': 'auto'}
        ]
    )
    color = models.CharField(max_length=7, default='#30d9fe')  # Hex color
    points = models.IntegerField(default=0)  # Points awarded for this badge
    
    # Optional relationships
    program = models.ForeignKey('programs.Program', on_delete=models.SET_NULL, null=True, blank=True, related_name='badges')
    event = models.ForeignKey('events.Event', on_delete=models.SET_NULL, null=True, blank=True, related_name='badges')
    
    # Metadata
    awarded_date = models.DateTimeField(auto_now_add=True)
    criteria = models.JSONField(default=dict, blank=True)  # Criteria for earning this badge
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"
    
    class Meta:
        ordering = ['-awarded_date']
        unique_together = ('user', 'title')  # Prevent duplicate badges for same user 