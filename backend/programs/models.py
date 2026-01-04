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
    image = CloudinaryField('image', folder='programs', blank=True, null=True)
    mode = models.CharField(max_length=20, choices=MODE_CHOICES, default='Online')
    sessions_per_week = models.IntegerField(default=3)
    has_certification = models.BooleanField(default=True)
    scholarship_available = models.BooleanField(default=True)
    prerequisites = models.TextField(blank=True, null=True)
    modules = models.TextField(blank=True, null=True, help_text='Comma-separated list of modules')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Enrollment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='enrollments')
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='enrollments')
    status = models.CharField(max_length=20, choices=[('ongoing', 'Ongoing'), ('completed', 'Completed')], default='ongoing')
    progress = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)  # percent
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'program')
