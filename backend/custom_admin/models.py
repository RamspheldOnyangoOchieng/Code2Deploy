from django.db import models


class ContactPageSettings(models.Model):
    """Model to store contact page settings for different contact types"""
    
    CONTACT_TYPE_CHOICES = [
        ('general', 'General Contact'),
        ('sponsor', 'Partner as Sponsor'),
        ('education', 'Education & Training Partner'),
    ]
    
    contact_type = models.CharField(
        max_length=20, 
        choices=CONTACT_TYPE_CHOICES, 
        unique=True,
        help_text="Type of contact page"
    )
    title = models.CharField(max_length=200, help_text="Main title displayed on the page")
    subtitle = models.CharField(max_length=300, help_text="Subtitle below the main title")
    description = models.TextField(help_text="Detailed description text")
    default_subject = models.CharField(
        max_length=200, 
        blank=True, 
        null=True,
        help_text="Pre-filled subject for the contact form"
    )
    default_message = models.TextField(
        blank=True, 
        null=True,
        help_text="Pre-filled message for the contact form"
    )
    button_text = models.CharField(
        max_length=100, 
        default="Send Message",
        help_text="Text for the submit button"
    )
    
    # Contact Info Section - "Ping Our Network"
    contact_info_title = models.CharField(
        max_length=100,
        default="Ping Our Network",
        help_text="Title for the contact info section"
    )
    visit_label = models.CharField(
        max_length=100,
        default="Visit Us",
        help_text="Label for the address section"
    )
    visit_address = models.TextField(
        default="123 Tech Hub, Innovation Street\nLagos, Nigeria",
        help_text="Physical address"
    )
    email_label = models.CharField(
        max_length=100,
        default="Email Us",
        help_text="Label for the email section"
    )
    primary_email = models.EmailField(
        default="info@code2deploy.com",
        help_text="Primary contact email"
    )
    secondary_email = models.EmailField(
        blank=True,
        null=True,
        default="support@code2deploy.com",
        help_text="Secondary contact email (optional)"
    )
    phone_label = models.CharField(
        max_length=100,
        default="Call Us",
        help_text="Label for the phone section"
    )
    phone_number = models.CharField(
        max_length=50,
        default="+254 743 864 7890",
        help_text="Contact phone number"
    )
    phone_hours = models.CharField(
        max_length=100,
        default="Mon-Fri: 9AM-6PM WAT",
        help_text="Business hours"
    )
    
    is_active = models.BooleanField(default=True, help_text="Whether this contact type is active")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Contact Page Setting"
        verbose_name_plural = "Contact Page Settings"
        ordering = ['contact_type']
    
    def __str__(self):
        return f"{self.get_contact_type_display()} - {self.title}"


class SiteSettings(models.Model):
    """General site settings"""
    
    site_name = models.CharField(max_length=200, default="Code2Deploy")
    tagline = models.CharField(max_length=300, blank=True, null=True)
    contact_email = models.EmailField(default="info@code2deploy.com")
    contact_phone = models.CharField(max_length=50, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    facebook_url = models.URLField(blank=True, null=True)
    twitter_url = models.URLField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    instagram_url = models.URLField(blank=True, null=True)
    youtube_url = models.URLField(blank=True, null=True)
    footer_text = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Site Setting"
        verbose_name_plural = "Site Settings"
    
    def __str__(self):
        return self.site_name
    
    def save(self, *args, **kwargs):
        # Ensure only one instance exists
        if not self.pk and SiteSettings.objects.exists():
            raise ValueError("Only one SiteSettings instance is allowed")
        super().save(*args, **kwargs)
