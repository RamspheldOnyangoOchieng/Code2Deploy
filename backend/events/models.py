from django.db import models
from django.conf import settings

from cloudinary.models import CloudinaryField

# Create your models here.

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=100, blank=True, null=True)
    date = models.DateField()
    time = models.CharField(max_length=100, blank=True, null=True)
    location = models.CharField(max_length=255)
    format = models.CharField(max_length=20, choices=[('Online', 'Online'), ('In-person', 'In-person')], default='In-person')
    capacity = models.IntegerField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    speaker = models.CharField(max_length=200, blank=True, null=True)
    topics = models.CharField(max_length=255, blank=True, help_text='Comma-separated list of topics')
    status = models.CharField(max_length=20, default='Available')
    is_active = models.BooleanField(default=True)
    image = models.TextField(
        blank=True, 
        null=True,
        help_text="Cloudinary ID or external URL"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class EventRegistration(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='event_registrations')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    status = models.CharField(max_length=20, choices=[('upcoming', 'Upcoming'), ('attended', 'Attended')], default='upcoming')
    registered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'event')
