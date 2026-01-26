import os
import django
import sys
from datetime import datetime, timedelta

# Set up Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from security.models import SystemHealth, SecurityEvent, AuditLog
from django.contrib.auth import get_user_model

User = get_user_model()

def seed_system_data():
    print("\n--- Seeding System & Security Data ---")
    
    # 1. System Health
    components = [
        ('database', 'Database connection stable', 'healthy', 15.5, 0.01),
        ('cache', 'Redis cache response time optimal', 'healthy', 2.1, 0.0),
        ('storage', 'Cloudinary storage integration verified', 'healthy', 120.0, 0.05),
        ('email', 'SMTP server responsive', 'healthy', 45.0, 0.1)
    ]
    
    for comp, msg, status, resp, err in components:
        SystemHealth.objects.create(
            component=comp,
            message=msg,
            status=status,
            response_time=resp,
            error_rate=err,
            uptime=99.9
        )
        print(f"Added health record for {comp}")

    # 2. Security Events (Sample)
    SecurityEvent.objects.create(
        event_type='failed_login',
        severity='low',
        description='Multiple failed login attempts detected from IP 192.168.1.5',
        ip_address='192.168.1.5',
        details={'attempts': 3, 'username': 'unknown_user'}
    )
    print("Added sample security event.")

    # 3. Audit Logs
    admin = User.objects.filter(role='admin').first()
    if admin:
        AuditLog.objects.create(
            user=admin,
            action='admin_action',
            description='Updated site wide settings and seeded initial data',
            ip_address='127.0.0.1'
        )
        print("Added sample audit log.")

if __name__ == "__main__":
    seed_system_data()
    print("\nSystem data seeding complete.")
