import os
import django
import sys

# Set up Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from events.models import Event

def restore_event_images():
    # Restore Data Science Fundamentals Webinar image
    try:
        e = Event.objects.get(title="Data Science Fundamentals Webinar")
        e.image = "https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&w=800&q=80"
        e.save()
        print("Restored Data Science Fundamentals Webinar image.")
    except Event.DoesNotExist:
        print("Event not found.")

if __name__ == "__main__":
    restore_event_images()
