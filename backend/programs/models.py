from django.db import models
from django.conf import settings
from cloudinary.models import CloudinaryField

# Create your models here.

class Program(models.Model):
    LEVEL_CHOICES = [
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ]

    MODE_CHOICES = [
        ('Online', 'Online'),
        ('Hybrid', 'Hybrid'),
        ('On-site', 'On-site'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    duration = models.CharField(max_length=50)  # e.g., '12 Weeks'
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    technologies = models.CharField(max_length=255, help_text='Comma-separated list of technologies')
    image = models.TextField(
        blank=True, 
        null=True,
        help_text="Cloudinary ID or external URL"
    )
    mode = models.CharField(max_length=20, choices=MODE_CHOICES, default='Online')
    sessions_per_week = models.IntegerField(default=3)
    has_certification = models.BooleanField(default=True)
    scholarship_available = models.BooleanField(default=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    is_paid = models.BooleanField(default=False)
    coupon = models.CharField(max_length=50, blank=True, null=True, default='%coupon')
    prerequisites = models.TextField(blank=True, null=True)
    modules = models.TextField(blank=True, null=True, help_text='Comma-separated list of modules')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Enrollment(models.Model):
    STATUS_CHOICES = [
        ('payment_pending', 'Payment Pending'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    PAYMENT_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
        ('waived', 'Waived'), # For scholarships
        ('none', 'None') # For free programs
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='enrollments')
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='enrollments')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ongoing')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default='none')
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    progress = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)  # percent
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'program')
