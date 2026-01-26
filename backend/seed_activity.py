import os
import django
import sys
from datetime import date, timedelta

# Set up Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from programs.models import Program, Enrollment
from events.models import Event, EventRegistration
from certificates.models import Certificate, Badge
from applications.models import Application
import random

User = get_user_model()

def seed_activity():
    print("\n--- Seeding User Activity ---")
    
    # 1. Create some learners
    learners = []
    for i in range(1, 6):
        user, created = User.objects.get_or_create(
            username=f'learner_{i}',
            defaults={
                'email': f'learner{i}@example.com',
                'role': 'learner',
                'first_name': f'Learner{i}',
                'last_name': 'Student'
            }
        )
        if created:
            user.set_password('Learner@123!')
            user.save()
            print(f"Created learner: {user.username}")
        learners.append(user)
    
    programs = list(Program.objects.all())
    events = list(Event.objects.all())
    
    if not programs or not events:
        print("Required base data (programs/events) missing. Run other seeds first.")
        return

    # 2. Seed Enrollments
    print("Seeding Enrollments...")
    for learner in learners:
        # Enroll in 1-2 random programs
        enrolled_programs = random.sample(programs, random.randint(1, 2))
        for p in enrolled_programs:
            Enrollment.objects.get_or_create(
                user=learner,
                program=p,
                defaults={'status': 'active'}
            )
            print(f"Enrolled {learner.username} in {p.title}")
            
    # 3. Seed Event Registrations
    print("Seeding Event Registrations...")
    for learner in learners:
        # Register for 1-2 random events
        registered_events = random.sample(events, random.randint(1, 2))
        for e in registered_events:
            EventRegistration.objects.get_or_create(
                user=learner,
                event=e,
                defaults={'status': 'upcoming'}
            )
            print(f"Registered {learner.username} for {e.title}")
            
    # 4. Seed Applications
    print("Seeding Applications...")
    for i in range(3):
        p = random.choice(programs)
        Application.objects.create(
            applicant_name=f"Applicant {i+1}",
            applicant_email=f"applicant{i+1}@example.com",
            program=p,
            status='Pending',
            notes="I am very interested in this program!"
        )
    
    # 5. Seed some accomplishments (Badges/Certificates)
    print("Seeding Accomplishments...")
    for learner in learners[:3]: # First 3 learners get something
        # Badge
        Badge.objects.get_or_create(
            user=learner,
            title="Fast Learner",
            defaults={
                'description': "Awarded for completing the first module in record time.",
                'badge_type': 'achievement',
                'points': 100
            }
        )
        
        # Certificate
        p = random.choice(programs)
        Certificate.objects.get_or_create(
            user=learner,
            title=f"Completion: {p.title}",
            defaults={
                'description': f"Successfully completed the {p.title} program.",
                'certificate_type': 'program_completion',
                'status': 'issued',
                'program': p
            }
        )
        print(f"Awarded badge and certificate to {learner.username}")

if __name__ == "__main__":
    seed_activity()
    print("\nUser activity seeding complete.")
