import os
import django
import sys

# Set up Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from events.models import Event

def check_events():
    events = Event.objects.all()
    for e in events:
        print(f"ID: {e.id}, Title: {e.title}, Image: '{e.image}'")

if __name__ == "__main__":
    check_events()
