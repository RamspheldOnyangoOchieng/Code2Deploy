from django.db import models
from cloudinary.models import CloudinaryField


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


class HomePageSettings(models.Model):
    """Model to store home page settings"""
    
    # Hero Section
    hero_title_line1 = models.CharField(max_length=100, default="From")
    hero_title_highlight1 = models.CharField(max_length=100, default="Hello World")
    hero_title_line2 = models.CharField(max_length=100, default="to")
    hero_title_highlight2 = models.CharField(max_length=100, default="Hello AI")
    hero_description = models.TextField(
        default="Empowering African youth with cutting-edge tech skills to build solutions that matter. Join our community of innovators today."
    )
    hero_button1_text = models.CharField(max_length=50, default="Join a Program")
    hero_button1_link = models.CharField(max_length=200, default="/programs")
    hero_button2_text = models.CharField(max_length=50, default="Upcoming Events")
    hero_button2_link = models.CharField(max_length=200, default="/events")
    hero_image = CloudinaryField(
        'hero_image', 
        folder='code2deploy/home', 
        blank=True, 
        null=True,
        transformation=[
            {'width': 1920, 'height': 1080, 'crop': 'limit'},
            {'quality': 'auto', 'fetch_format': 'auto'}
        ]
    )
    
    @property
    def hero_image_url(self):
        if self.hero_image:
            try:
                if hasattr(self.hero_image, 'url'):
                    return self.hero_image.url
                return str(self.hero_image)
            except Exception:
                return str(self.hero_image)
        return None
    
    # Our Approach Section
    approach_title = models.CharField(max_length=100, default="Our Approach")
    approach_description = models.TextField(
        default="Most courses stop at code. We take you further. By the end of our program, you'll have:"
    )
    
    # What We Do Section  
    what_we_do_title = models.CharField(max_length=100, default="What We Do")
    
    # Programs Section
    programs_section_title = models.CharField(max_length=100, default="Our Programs")
    
    # CTA Section
    cta_title = models.CharField(max_length=200, default="Ready to Start Your Tech Journey?")
    cta_description = models.TextField(
        default="Join our community of learners and innovators today. Take the first step toward a future in technology."
    )
    cta_button1_text = models.CharField(max_length=50, default="Apply Now")
    cta_button1_link = models.CharField(max_length=200, default="/programs")
    cta_button2_text = models.CharField(max_length=50, default="Schedule a Call")
    cta_button2_link = models.CharField(max_length=200, default="/contact")
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Home Page Setting"
        verbose_name_plural = "Home Page Settings"
    
    def __str__(self):
        return "Home Page Settings"
    
    def save(self, *args, **kwargs):
        if not self.pk and HomePageSettings.objects.exists():
            # Update existing instead of creating new
            existing = HomePageSettings.objects.first()
            self.pk = existing.pk
        super().save(*args, **kwargs)


class AboutPageSettings(models.Model):
    """Model to store about page settings"""
    
    # Hero Section
    hero_title = models.CharField(max_length=200, default="About Code2Deploy")
    hero_subtitle = models.CharField(
        max_length=300, 
        default="Empowering African youth with cutting-edge tech skills"
    )
    hero_image = CloudinaryField(
        'hero_image', 
        folder='code2deploy/about', 
        blank=True, 
        null=True,
        transformation=[
            {'width': 1920, 'height': 1080, 'crop': 'limit'},
            {'quality': 'auto', 'fetch_format': 'auto'}
        ]
    )
    
    @property
    def hero_image_url(self):
        if self.hero_image:
            try:
                if hasattr(self.hero_image, 'url'):
                    return self.hero_image.url
                return str(self.hero_image)
            except Exception:
                return str(self.hero_image)
        return None
    
    # Mission & Vision
    mission_title = models.CharField(max_length=100, default="Our Mission")
    mission_description = models.TextField(
        default="To bridge the digital skills gap in Africa by providing world-class technology education and creating pathways to successful careers in the global tech industry."
    )
    vision_title = models.CharField(max_length=100, default="Our Vision")
    vision_description = models.TextField(
        default="To be Africa's leading technology education platform, empowering the next generation of tech leaders and innovators who will drive the continent's digital transformation."
    )
    
    # Journey Section
    journey_title = models.CharField(max_length=100, default="Our Journey")
    
    # Team Section
    team_title = models.CharField(max_length=100, default="Our Leadership Team")
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "About Page Setting"
        verbose_name_plural = "About Page Settings"
    
    def __str__(self):
        return "About Page Settings"
    
    def save(self, *args, **kwargs):
        if not self.pk and AboutPageSettings.objects.exists():
            existing = AboutPageSettings.objects.first()
            self.pk = existing.pk
        super().save(*args, **kwargs)


class ProgramsPageSettings(models.Model):
    """Model to store programs page settings"""
    
    # Hero Section
    hero_title = models.CharField(max_length=200, default="Our Programs")
    hero_subtitle = models.CharField(
        max_length=300,
        default="Discover world-class technology programs designed for African youth"
    )
    hero_description = models.TextField(
        default="From beginner to advanced, our programs are designed to take you from where you are to where you want to be in tech.",
        blank=True
    )
    hero_image = CloudinaryField(
        'hero_image', 
        folder='code2deploy/programs_page', 
        blank=True, 
        null=True,
        transformation=[
            {'width': 1920, 'height': 1080, 'crop': 'limit'},
            {'quality': 'auto', 'fetch_format': 'auto'}
        ]
    )
    
    @property
    def hero_image_url(self):
        if self.hero_image:
            try:
                if hasattr(self.hero_image, 'url'):
                    return self.hero_image.url
                return str(self.hero_image)
            except Exception:
                return str(self.hero_image)
        return None
    
    # Programs Section
    programs_section_title = models.CharField(max_length=100, default="Available Programs")
    no_programs_message = models.CharField(
        max_length=200,
        default="No programs available at the moment. Check back soon!"
    )
    
    # CTA Section
    cta_title = models.CharField(max_length=200, default="Ready to Start Your Journey?")
    cta_description = models.TextField(
        default="Join thousands of students who have transformed their careers through our programs."
    )
    cta_button_text = models.CharField(max_length=50, default="Apply Now")
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Programs Page Setting"
        verbose_name_plural = "Programs Page Settings"
    
    def __str__(self):
        return "Programs Page Settings"
    
    def save(self, *args, **kwargs):
        if not self.pk and ProgramsPageSettings.objects.exists():
            existing = ProgramsPageSettings.objects.first()
            self.pk = existing.pk
        super().save(*args, **kwargs)


class EventsPageSettings(models.Model):
    """Model to store events page settings"""
    
    # Hero Section
    hero_title = models.CharField(max_length=200, default="Upcoming Events")
    hero_subtitle = models.CharField(
        max_length=300,
        default="Join us for exciting tech events, workshops, and networking opportunities"
    )
    hero_description = models.TextField(
        default="Stay connected with the Code2Deploy community through our events.",
        blank=True
    )
    hero_image = CloudinaryField(
        'hero_image', 
        folder='code2deploy/events_page', 
        blank=True, 
        null=True,
        transformation=[
            {'width': 1920, 'height': 1080, 'crop': 'limit'},
            {'quality': 'auto', 'fetch_format': 'auto'}
        ]
    )
    
    @property
    def hero_image_url(self):
        if self.hero_image:
            try:
                if hasattr(self.hero_image, 'url'):
                    return self.hero_image.url
                return str(self.hero_image)
            except Exception:
                return str(self.hero_image)
        return None
    
    # Events Section
    events_section_title = models.CharField(max_length=100, default="All Events")
    no_events_message = models.CharField(
        max_length=200,
        default="No upcoming events at the moment. Check back soon!"
    )
    
    # CTA Section
    cta_title = models.CharField(max_length=200, default="Want to Host an Event?")
    cta_description = models.TextField(
        default="Partner with us to bring tech events to your community."
    )
    cta_button_text = models.CharField(max_length=50, default="Contact Us")
    cta_button_link = models.CharField(max_length=200, default="/contact")
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Events Page Setting"
        verbose_name_plural = "Events Page Settings"
    
    def __str__(self):
        return "Events Page Settings"
    
    def save(self, *args, **kwargs):
        if not self.pk and EventsPageSettings.objects.exists():
            existing = EventsPageSettings.objects.first()
            self.pk = existing.pk
        super().save(*args, **kwargs)


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
