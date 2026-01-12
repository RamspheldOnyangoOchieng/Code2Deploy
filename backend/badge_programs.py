import os
import django
import sys

# Set up Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from programs.models import Program

def badge_existing_programs():
    print("--- Badging Existing Programs ---")
    
    # Update logic:
    # If scholarship_available is True -> Scholarship
    # If scholarship_available is False -> Paid
    # All get coupon '%coupon'
    
    programs = Program.objects.all()
    updated_count = 0
    
    for program in programs:
        # Determine if paid or scholarship
        if program.scholarship_available:
            program.is_paid = False
            program.price = 0.00
            status = "Scholarship"
        else:
            program.is_paid = True
            # Set a default price if it's paid and currently 0
            if program.price == 0:
                program.price = 99.99
            status = "Paid"
            
        program.coupon = "%coupon"
        program.save()
        updated_count += 1
        print(f"Badged '{program.title}' as {status} (Coupon: {program.coupon})")
    
    print(f"\nSuccessfully badged {updated_count} programs.")

if __name__ == "__main__":
    badge_existing_programs()
