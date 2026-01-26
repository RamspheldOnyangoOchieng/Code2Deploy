import os
import django
import sys
import random
from datetime import date, datetime, timedelta
from django.utils import timezone

# Set up Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from programs.models import Program, Enrollment
from events.models import Event, EventRegistration
from mentors.models import Mentor, MentorProgram, MentorSession, Assignment, AssignmentSubmission
from custom_admin.models import TeamMember, ContactPageSettings, SiteSettings, HomePageSettings
from applications.models import Application
from certificates.models import Certificate, Badge
from notifications.models import Notification, NotificationPreference
from contact.models import ContactMessage
from security.models import SystemHealth, AuditLog, SecurityEvent
from payments.models import PaymentMethod, PricingPlan, Order, Subscription, Coupon

User = get_user_model()

def deep_seed():
    print("\n[START] STARTING DEEP FOLDER-BY-FOLDER SEEDING [START]")

    # --- 1. USERS (Roles) ---
    print("\n--- [Users] ---")
    roles = ['sponsor', 'partner', 'learner', 'staff']
    for role in roles:
        for i in range(1, 3):
            username = f"{role}_{i}"
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'email': f"{username}@code2deploy.com",
                    'role': role,
                    'first_name': role.capitalize(),
                    'last_name': f"User {i}",
                    'is_active': True
                }
            )
            if created:
                user.set_password('C2DUser@123!')
                user.save()
                NotificationPreference.objects.get_or_create(user=user)
                print(f"Created {role} user: {username}")

    # --- 2. PAYMENTS (Methods, Plans, Coupons) ---
    print("\n--- [Payments] ---")
    methods = [
        ('PayPal', 'paypal', 'fab fa-paypal'),
        ('Stripe', 'stripe', 'fab fa-stripe'),
        ('M-Pesa', 'mpesa', 'fas fa-mobile-alt'),
        ('Bank Transfer', 'bank_transfer', 'fas fa-university')
    ]
    for name, provider, icon in methods:
        PaymentMethod.objects.get_or_create(
            provider=provider,
            defaults={'name': name, 'icon': icon, 'is_active': True}
        )

    programs = Program.objects.all()
    for p in programs:
        # Create a basic plan for each program
        PricingPlan.objects.get_or_create(
            program=p,
            name="Standard Access",
            defaults={
                'price': 49.99 if p.is_paid else 0.00,
                'currency': 'USD',
                'billing_cycle': 'one_time',
                'features': ['Full course access', 'Community support', 'Certificate of completion']
            }
        )
    
    Coupon.objects.get_or_create(
        code="WELCOME20",
        defaults={
            'description': "20% off for new students",
            'discount_type': 'percentage',
            'discount_value': 20.00,
            'valid_from': timezone.now() - timedelta(days=1),
            'valid_until': timezone.now() + timedelta(days=30),
            'is_active': True
        }
    )

    # --- 3. MENTORS (Detailing) ---
    print("\n--- [Mentors & Education] ---")
    mentors = Mentor.objects.all()
    for mentor in mentors:
        # Seed some sessions
        for i in range(2):
            MentorSession.objects.get_or_create(
                mentor=mentor,
                title=f"Office Hours with {mentor.name} #{i+1}",
                defaults={
                    'description': "Ask questions about current modules and career paths.",
                    'session_type': 'office_hours',
                    'scheduled_at': timezone.now() + timedelta(days=random.randint(1, 10), hours=random.randint(9, 17)),
                    'meeting_link': 'https://zoom.us/j/123456789'
                }
            )
        
        # Seed some Assignments
        for p_link in mentor.program_assignments.all():
            Assignment.objects.get_or_create(
                mentor=mentor,
                program=p_link.program,
                title=f"Initial Project: {p_link.program.title}",
                defaults={
                    'description': "Build a basic implementation demonstrating core concepts.",
                    'due_date': timezone.now() + timedelta(days=14)
                }
            )

    # --- 4. CONTACT (Messages) ---
    print("\n--- [Contact] ---")
    contact_subjects = [
        ('John Doe', 'john@example.com', 'Course Inquiry', 'I want to know more about the AI program.'),
        ('Jane Smith', 'jane@example.com', 'Sponsorship', 'Interested in sponsoring 10 students.'),
        ('Tech Corp', 'info@techcorp.com', 'Partnership', 'We want to hire your graduates.')
    ]
    for name, email, sub, msg in contact_subjects:
        ContactMessage.objects.create(
            name=name,
            email=email,
            subject=sub,
            message=msg,
            contact_type='general' if 'Inquiry' in sub else ('sponsor' if 'Sponsor' in sub else 'education')
        )

    # --- 5. NOTIFICATIONS ---
    print("\n--- [Notifications] ---")
    learners = User.objects.filter(role='learner')
    for learner in learners[:3]:
        Notification.create_notification(
            user=learner,
            notification_type='system_announcement',
            title='Welcome to Code2Deploy!',
            message='Thank you for joining our platform. Start exploring our programs today.',
            priority='high'
        )

    # --- 6. SECURITY (Health & Logs) ---
    print("\n--- [Security & Systems] ---")
    SystemHealth.objects.create(
        component='api_server',
        message='Core REST API endpoints performing within 200ms threshold.',
        status='healthy',
        response_time=185.2,
        uptime=100.0
    )

    # --- 7. ORDERS & SUBSCRIPTIONS ---
    print("\n--- [Orders & Subscriptions] ---")
    for learner in learners[:2]:
        plan = PricingPlan.objects.filter(price__gt=0).first()
        if plan:
            order = Order.objects.create(
                user=learner,
                pricing_plan=plan,
                amount=plan.price,
                status='paid',
                paid_at=timezone.now()
            )
            print(f"Created paid order for {learner.username}")
            
            Subscription.objects.create(
                user=learner,
                pricing_plan=plan,
                provider='stripe',
                status='active',
                current_period_start=timezone.now(),
                current_period_end=timezone.now() + timedelta(days=30)
            )
            print(f"Created subscription for {learner.username}")

    # --- 8. ASSIGNMENT SUBMISSIONS ---
    print("\n--- [Assignment Submissions] ---")
    assignments = Assignment.objects.all()
    for assignment in assignments[:3]:
        learner = learners[0]
        AssignmentSubmission.objects.get_or_create(
            assignment=assignment,
            student=learner,
            defaults={
                'submission_text': "Here is my project implementation using the concepts learned.",
                'submission_url': 'https://github.com/learner1/project',
                'status': 'submitted'
            }
        )
        print(f"Added submission for {learner.username} - {assignment.title}")

    print("\n[SUCCESS] DEEP SEEDING COMPLETE [SUCCESS]")

if __name__ == "__main__":
    deep_seed()
