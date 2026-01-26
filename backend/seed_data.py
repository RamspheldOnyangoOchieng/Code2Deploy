import os
import django
import sys
import requests
from django.core.files.base import ContentFile
from datetime import date, timedelta

# Set up Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dotenv import load_dotenv

# Set up Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
# Load .env explicitly
load_dotenv()
django.setup()

from events.models import Event
from custom_admin.models import HomePageSettings, AboutPageSettings, ProgramsPageSettings, EventsPageSettings, SiteSettings

import cloudinary.uploader

def upload_image_from_url(model_instance, field_name, url, filename):
    try:
        print(f"Uploading image for {model_instance} from {url}...")
        # Try Cloudinary upload
        upload_result = cloudinary.uploader.upload(
            url,
            folder=f"code2deploy/{model_instance.__class__.__name__.lower()}"
        )
        if upload_result and 'public_id' in upload_result:
            setattr(model_instance, field_name, upload_result['public_id'])
            model_instance.save()
            return True
    except Exception as e:
        print(f"Failed to upload to Cloudinary, falling back to URL string: {e}")
        setattr(model_instance, field_name, url)
        model_instance.save()
    return False

def is_invalid_image(img_val):
    if not img_val: return True
    img_str = str(img_val)
    # Check if it's a truncated Unsplash URL
    if img_str.startswith("https://images.unsplash") and len(img_str) < 50:
        return True
    return False

def seed_page_settings():
    print("\n--- Seeding Page Settings ---")
    
    # Home Page
    home, created = HomePageSettings.objects.get_or_create(id=1)
    if created or is_invalid_image(home.hero_image):
        home.hero_title_line1 = "Transforming"
        home.hero_title_highlight1 = "Skills"
        home.hero_title_line2 = "Into"
        home.hero_title_highlight2 = "Intelligent Systems"
        home.hero_description = "Building the next generation of technologists worldwide. This is where builders become founders, ideas become companies, and technology becomes leverage."
        home.save()
        upload_image_from_url(home, 'hero_image', "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1920&q=80", "home_hero.jpg")
    
    # About Page
    about, created = AboutPageSettings.objects.get_or_create(id=1)
    if created or is_invalid_image(about.hero_image):
        about.hero_title = "About Code2Deploy"
        about.hero_subtitle = "Empowering African youth with cutting-edge tech skills"
        about.save()
        upload_image_from_url(about, 'hero_image', "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80", "about_hero.jpg")
        
    # Programs Page
    prog, created = ProgramsPageSettings.objects.get_or_create(id=1)
    if created or is_invalid_image(prog.hero_image):
        prog.hero_title = "Our Programs"
        prog.hero_subtitle = "Discover world-class technology programs designed for African youth"
        prog.save()
        upload_image_from_url(prog, 'hero_image', "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1920&q=80", "programs_hero.jpg")
        
    # Events Page
    ev_page, created = EventsPageSettings.objects.get_or_create(id=1)
    if created or is_invalid_image(ev_page.hero_image):
        ev_page.hero_title = "Upcoming Events"
        ev_page.hero_subtitle = "Discover workshops, webinars, and tech meetups to enhance your skills"
        ev_page.save()
        upload_image_from_url(ev_page, 'hero_image', "https://images.unsplash.com/photo-1540575861501-7c0011e9a28f?auto=format&fit=crop&w=1920&q=80", "events_hero.jpg")

    # Site Settings
    site, created = SiteSettings.objects.get_or_create(id=1)
    if created:
        site.site_name = "Code2Deploy"
        site.contact_email = "info@code2deploy.com"
        site.save()

def seed_events():
    print("\n--- Seeding Events ---")
    
    events_data = [
        {
            "title": "Web Development Workshop",
            "date": date.today() + timedelta(days=5),
            "time": "10:00 AM - 2:00 PM",
            "format": "In-person",
            "category": "Workshop",
            "description": "Learn modern web development techniques with React and Node.js in this hands-on workshop.",
            "location": "Tech Hub, Lagos",
            "topics": "React, Node.js, Frontend",
            "speaker": "Sarah Johnson",
            "status": "Available",
            "capacity": 50,
            "price": 0,
            "image_url": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80"
        },
        {
            "title": "Data Science Fundamentals Webinar",
            "date": date.today() + timedelta(days=10),
            "time": "3:00 PM - 5:00 PM",
            "format": "Online",
            "category": "Webinar",
            "description": "Introduction to data analysis, visualization, and machine learning concepts for beginners.",
            "location": "Zoom",
            "topics": "Python, Data Analysis, Machine Learning",
            "speaker": "Dr. Michael Chen",
            "status": "Available",
            "capacity": 200,
            "price": 0,
            "image_url": "https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&w=800&q=80"
        },
        {
            "title": "AI & Machine Learning Meetup",
            "date": date.today() + timedelta(days=15),
            "time": "6:00 PM - 8:30 PM",
            "format": "In-person",
            "category": "Meetup",
            "description": "Network with AI professionals and learn about the latest advancements in machine learning.",
            "location": "Innovation Center, Accra",
            "topics": "AI, Deep Learning, Neural Networks",
            "speaker": "Prof. Ada Okonkwo",
            "status": "Available",
            "capacity": 100,
            "price": 10,
            "image_url": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"
        }
    ]

    for data in events_data:
        image_url = data.pop('image_url')
        event, created = Event.objects.get_or_create(
            title=data['title'],
            defaults=data
        )
        force_update = len(sys.argv) > 1 and sys.argv[1] == 'force_update'
        
        if created or is_invalid_image(event.image) or force_update:
            print(f"Updating image for event: {event.title}")
            upload_image_from_url(event, 'image', image_url, f"event_{event.id}.jpg")
        else:
            print(f"Event already exists with image: {event.title}")

if __name__ == "__main__":
    seed_page_settings()
    seed_events()
    print("\nSeeding complete.")
