from django.db import models
from django.conf import settings

class ContactMessage(models.Model):
    """Model to store contact form submissions"""
    
    CONTACT_TYPE_CHOICES = [
        ('general', 'General Inquiry'),
        ('sponsor', 'Partner as Sponsor'),
        ('education', 'Education Partner'),
        ('support', 'Support Request'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('new', 'New'),
        ('read', 'Read'),
        ('replied', 'Replied'),
        ('archived', 'Archived'),
    ]
    
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True, null=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    contact_type = models.CharField(
        max_length=20, 
        choices=CONTACT_TYPE_CHOICES, 
        default='general'
    )
    
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='new'
    )
    
    # Optional link to user if logged in
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='contact_messages'
    )
    
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Contact Message"
        verbose_name_plural = "Contact Messages"
    
    def __str__(self):
        return f"{self.name} - {self.subject} ({self.get_contact_type_display()})"
