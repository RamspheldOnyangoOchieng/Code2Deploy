from django.db import models

# Create your models here.

class Mentor(models.Model):
    name = models.CharField(max_length=100)
    bio = models.TextField()
    expertise = models.CharField(max_length=255, help_text='Comma-separated list of expertise areas')
    photo = models.URLField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    twitter = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
