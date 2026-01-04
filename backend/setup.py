#!/usr/bin/env python3
"""
Code2Deploy Backend Setup Script
This script helps you configure the backend environment variables and database.
"""

import os
import sys
import secrets
from pathlib import Path

def generate_secret_key():
    """Generate a secure Django secret key"""
    return secrets.token_urlsafe(50)

def create_env_file():
    """Create .env file from template"""
    env_example = Path('env.example')
    env_file = Path('.env')
    
    if env_file.exists():
        print("⚠️  .env file already exists. Skipping creation.")
        return
    
    if not env_example.exists():
        print("❌ env.example file not found!")
        return
    
    # Read template
    with open(env_example, 'r') as f:
        content = f.read()
    
    # Replace placeholder values
    content = content.replace('your-secret-key-here', generate_secret_key())
    content = content.replace('your_db_user', 'postgres')
    content = content.replace('your_db_password', 'your_password_here')
    content = content.replace('your_email@gmail.com', 'your_email@gmail.com')
    content = content.replace('your_app_password', 'your_gmail_app_password')
    content = content.replace('your_supabase_anon_key', 'your_supabase_anon_key_here')
    
    # Write .env file
    with open(env_file, 'w') as f:
        f.write(content)
    
    print("✅ .env file created successfully!")
    print("📝 Please update the .env file with your actual values:")

def print_setup_instructions():
    """Print setup instructions"""
    print("\n" + "="*60)
    print("🚀 CODE2DEPLOY BACKEND SETUP INSTRUCTIONS")
    print("="*60)
    
    print("\n📋 STEP 1: Configure Environment Variables")
    print("Edit the .env file with your actual values:")
    print("   - Database credentials")
    print("   - Email settings (Gmail recommended)")
    print("   - Supabase configuration")
    print("   - Secret key (already generated)")
    
    print("\n📋 STEP 2: Database Setup")
    print("1. Install PostgreSQL if not already installed")
    print("2. Create a database: CREATE DATABASE code2deploy_db;")
    print("3. Update .env with your database credentials")
    
    print("\n📋 STEP 3: Email Configuration")
    print("For Gmail:")
    print("1. Enable 2-factor authentication")
    print("2. Generate an App Password")
    print("3. Update EMAIL_HOST_USER and EMAIL_HOST_PASSWORD in .env")
    
    print("\n📋 STEP 4: Supabase Configuration")
    print("1. Get your Supabase anon key from dashboard")
    print("2. Update SUPABASE_ANON_KEY in .env")
    
    print("\n📋 STEP 5: Run Migrations")
    print("python manage.py migrate")
    
    print("\n📋 STEP 6: Create Superuser")
    print("python manage.py createsuperuser")
    
    print("\n📋 STEP 7: Start Development Server")
    print("python manage.py runserver 0.0.0.0:8000")
    
    print("\n🔗 Useful URLs:")
    print("   - API Documentation: http://0.0.0.0:8000/api/docs/")
    print("   - Admin Interface: http://0.0.0.0:8000/admin/")
    print("   - API Schema: http://0.0.0.0:8000/api/schema/")
    
    print("\n" + "="*60)

def check_dependencies():
    """Check if required packages are installed"""
    package_imports = {
        'django': 'django',
        'djangorestframework': 'rest_framework',
        'djangorestframework-simplejwt': 'rest_framework_simplejwt',
        'django-cors-headers': 'corsheaders',
        'djoser': 'djoser',
        'drf-spectacular': 'drf_spectacular',
        'psycopg2-binary': 'psycopg2',
        'python-dotenv': 'dotenv'
    }
    
    missing_packages = []
    
    for package, import_name in package_imports.items():
        try:
            __import__(import_name)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print("❌ Missing required packages:")
        for package in missing_packages:
            print(f"   - {package}")
        print("\nInstall missing packages with:")
        print("pip install " + " ".join(missing_packages))
        return False
    
    print("✅ All required packages are installed!")
    return True

def main():
    """Main setup function"""
    print("🔧 Code2Deploy Backend Setup")
    print("="*40)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Create .env file
    create_env_file()
    
    # Print instructions
    print_setup_instructions()

if __name__ == "__main__":
    main() 