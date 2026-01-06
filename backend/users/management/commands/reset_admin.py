from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Reset or create admin user'

    def add_arguments(self, parser):
        parser.add_argument('--email', type=str, default='admin@code2deploy.com')
        parser.add_argument('--password', type=str, default='Admin@123!')
        parser.add_argument('--username', type=str, default='admin')

    def handle(self, *args, **options):
        email = options['email']
        password = options['password']
        username = options['username']

        try:
            # Try to find existing user by email
            user = User.objects.filter(email=email).first()
            
            if user:
                # Reset password and activate
                user.set_password(password)
                user.is_active = True
                user.is_staff = True
                user.is_superuser = True
                user.role = 'admin'
                user.save()
                self.stdout.write(self.style.SUCCESS(
                    f'Successfully reset admin user: {email}'
                ))
            else:
                # Create new admin user
                user = User.objects.create_superuser(
                    username=username,
                    email=email,
                    password=password,
                    role='admin',
                    first_name='Admin',
                    last_name='User'
                )
                self.stdout.write(self.style.SUCCESS(
                    f'Successfully created admin user: {email}'
                ))
            
            self.stdout.write(f'Username: {user.username}')
            self.stdout.write(f'Email: {user.email}')
            self.stdout.write(f'Role: {user.role}')
            self.stdout.write(f'Is Active: {user.is_active}')
            self.stdout.write(f'Is Staff: {user.is_staff}')
            self.stdout.write(f'Is Superuser: {user.is_superuser}')
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {str(e)}'))
