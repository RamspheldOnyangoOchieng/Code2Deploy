import os
import django
import sys
from datetime import date, timedelta

# Set up Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from mentors.models import Mentor, MentorProgram
from programs.models import Program
from custom_admin.models import TeamMember, ContactPageSettings, SiteSettings
import random

User = get_user_model()

def seed_mentors():
    print("\n--- Seeding Mentors ---")
    
    mentors_data = [
        {
            'username': 'ram_mentor',
            'email': 'ramspheld@mentor.com',
            'name': 'Ramspheld Onyango',
            'bio': 'Senior Software Architect with 10+ years of experience in AI and Cloud Computing.',
            'expertise': 'AI, Machine Learning, Python, Cloud Architect',
            'hourly_rate': 75.00,
            'years_experience': 12,
            'photo': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
        },
        {
            'username': 'sarah_web',
            'email': 'sarah@mentor.com',
            'name': 'Sarah Johnson',
            'bio': 'Full-stack developer passionate about building scalable web applications and mentoring African youth.',
            'expertise': 'React, Node.js, Frontend Architecture, UX/UI',
            'hourly_rate': 60.00,
            'years_experience': 8,
            'photo': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
        }
    ]

    for data in mentors_data:
        user, created = User.objects.get_or_create(
            username=data['username'],
            defaults={
                'email': data['email'],
                'role': 'mentor',
                'first_name': data['name'].split()[0],
                'last_name': data['name'].split()[-1] if len(data['name'].split()) > 1 else ''
            }
        )
        if created:
            user.set_password('Mentor@123!')
            user.save()
            print(f"Created user for mentor: {user.username}")
        
        mentor, created = Mentor.objects.get_or_create(
            user=user,
            defaults={
                'name': data['name'],
                'bio': data['bio'],
                'expertise': data['expertise'],
                'hourly_rate': data['hourly_rate'],
                'years_experience': data['years_experience'],
                'photo': data['photo']
            }
        )
        if created:
            print(f"Created mentor profile for: {mentor.name}")
        
        # Assign to some programs
        programs = Program.objects.all()
        if programs.exists():
            # Assign to 2 random programs
            p_to_assign = random.sample(list(programs), min(2, len(programs)))
            for p in p_to_assign:
                MentorProgram.objects.get_or_create(mentor=mentor, program=p)
            print(f"Assigned {mentor.name} to {len(p_to_assign)} programs")

def seed_team():
    print("\n--- Seeding Team Members ---")
    team_data = [
        {
            'name': 'Ramspheld Onyango',
            'role': 'Founder & CEO',
            'bio': 'Visionary leader dedicated to transforming African tech landscape.',
            'order': 1,
            'image': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400'
        },
        {
            'name': 'John Doe',
            'role': 'CTO',
            'bio': 'Technical expert with passion for education.',
            'order': 2,
            'image': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
        }
    ]
    
    for data in team_data:
        tm, created = TeamMember.objects.get_or_create(
            name=data['name'],
            defaults=data
        )
        if created:
            print(f"Created team member: {tm.name}")

def seed_contact_settings():
    print("\n--- Seeding Contact Page Settings ---")
    types = [
        ('general', 'General Contact', 'Get in touch with us for any inquiries.', 'Support Team'),
        ('sponsor', 'Partner as Sponsor', 'Join our mission to empower youth.', 'Sponsorship Team'),
        ('education', 'Education Partner', 'Collaborate with us on training programs.', 'Partnership Team')
    ]
    
    for c_type, title, desc, subject_prefix in types:
        settings, created = ContactPageSettings.objects.get_or_create(
            contact_type=c_type,
            defaults={
                'title': title,
                'subtitle': 'We would love to hear from you',
                'description': desc,
                'default_subject': f'Regarding {subject_prefix}',
                'button_text': 'Send Request'
            }
        )
        if created:
            print(f"Created contact settings for: {c_type}")

def seed_site_settings():
    print("\n--- Seeding Site Settings ---")
    site, created = SiteSettings.objects.get_or_create(id=1)
    site.site_name = "Code2Deploy"
    site.tagline = "Empowering The Next Generation of Tech Leaders"
    site.contact_email = "hello@code2deploy.com"
    site.contact_phone = "+254 700 000 000"
    site.address = "Tech Hub, 4th Floor, Innovation House, Nairobi, Kenya"
    site.facebook_url = "https://facebook.com/code2deploy"
    site.twitter_url = "https://twitter.com/code2deploy"
    site.linkedin_url = "https://linkedin.com/company/code2deploy"
    site.footer_text = "© 2024 Code2Deploy. All rights reserved."
    site.save()
    print("Updated site settings.")

if __name__ == "__main__":
    seed_site_settings()
    seed_contact_settings()
    seed_team()
    seed_mentors()
    print("\nAdditional seeding complete.")
