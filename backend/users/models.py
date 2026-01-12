from django.contrib.auth.models import AbstractUser
from django.db import models
from cloudinary.models import CloudinaryField
import uuid

class User(AbstractUser):
    ROLE_CHOICES = [
        ('sponsor', 'Sponsor'),
        ('mentor', 'Mentor'),
        ('partner', 'Partner'),
        ('learner', 'Learner'),
        ('admin', 'Admin'),
        ('staff', 'Staff'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='learner')
    # first_name, last_name, email, username, password are already included in AbstractUser
    # Add any other relevant fields below
    phone = models.CharField(max_length=20, blank=True, null=True)
    organization = models.CharField(max_length=100, blank=True, null=True)
    unique_id = models.CharField(max_length=20, unique=True, blank=True, null=True)
    avatar = models.TextField(
        blank=True, 
        null=True,
        help_text="Cloudinary ID or external URL"
    )

    def save(self, *args, **kwargs):
        if not self.unique_id:
            self.unique_id = f'C2D-{uuid.uuid4().hex[:8].upper()}'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})" 