from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework import status
from django.db.models import Count, Sum, Q
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from programs.models import Program, Enrollment
from events.models import Event, EventRegistration
from certificates.models import Certificate, Badge
from mentors.models import Mentor
from applications.models import Application
from rest_framework import serializers

User = get_user_model()


class MessageSerializer(serializers.Serializer):
    detail = serializers.CharField()

class AdminDashboardStatsSerializer(serializers.Serializer):
    users = serializers.DictField()
    programs = serializers.DictField()
    events = serializers.DictField()
    certificates = serializers.DictField()
    badges = serializers.DictField()
    mentors = serializers.DictField()
    applications = serializers.DictField()
    recent_activity = serializers.DictField()


class AdminDashboardStatsView(APIView):
    """Admin dashboard with comprehensive statistics"""
    permission_classes = [IsAdminUser]
    serializer_class = AdminDashboardStatsSerializer
    
    def get(self, request):
        # Get date ranges
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)
        seven_days_ago = now - timedelta(days=7)
        
        # User statistics
        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        new_users_30_days = User.objects.filter(date_joined__gte=thirty_days_ago).count()
        new_users_7_days = User.objects.filter(date_joined__gte=seven_days_ago).count()
        
        # Program statistics
        total_programs = Program.objects.count()
        total_enrollments = Enrollment.objects.count()
        active_enrollments = Enrollment.objects.filter(status='ongoing').count()
        completed_enrollments = Enrollment.objects.filter(status='completed').count()
        
        # Event statistics
        total_events = Event.objects.count()
        total_registrations = EventRegistration.objects.count()
        upcoming_events = Event.objects.filter(date__gte=now).count()
        past_events = Event.objects.filter(date__lt=now).count()
        
        # Certificate and Badge statistics
        total_certificates = Certificate.objects.count()
        issued_certificates = Certificate.objects.filter(status='issued').count()
        total_badges = Badge.objects.count()
        total_badge_points = Badge.objects.aggregate(total=Sum('points'))['total'] or 0
        
        # Mentor statistics
        total_mentors = Mentor.objects.count()
        
        # Application statistics
        total_applications = Application.objects.count()
        pending_applications = Application.objects.filter(status='pending').count()
        approved_applications = Application.objects.filter(status='approved').count()
        
        # Recent activity (last 7 days)
        recent_enrollments = Enrollment.objects.filter(enrolled_at__gte=seven_days_ago).count()
        recent_registrations = EventRegistration.objects.filter(registered_at__gte=seven_days_ago).count()
        recent_certificates = Certificate.objects.filter(issued_date__gte=seven_days_ago).count()
        recent_badges = Badge.objects.filter(awarded_date__gte=seven_days_ago).count()
        
        # User role distribution
        role_distribution = User.objects.values('role').annotate(count=Count('id'))
        
        # Top programs by enrollment
        top_programs = Program.objects.annotate(
            enrollment_count=Count('enrollments')
        ).order_by('-enrollment_count')[:5]
        
        # Top events by registration
        top_events = Event.objects.annotate(
            registration_count=Count('registrations')
        ).order_by('-registration_count')[:5]
        
        stats = {
            'users': {
                'total': total_users,
                'active': active_users,
                'new_30_days': new_users_30_days,
                'new_7_days': new_users_7_days,
                'role_distribution': list(role_distribution)
            },
            'programs': {
                'total': total_programs,
                'enrollments': {
                    'total': total_enrollments,
                    'active': active_enrollments,
                    'completed': completed_enrollments
                },
                'top_programs': [
                    {
                        'id': program.id,
                        'title': program.title,
                        'enrollment_count': program.enrollment_count
                    } for program in top_programs
                ]
            },
            'events': {
                'total': total_events,
                'registrations': {
                    'total': total_registrations,
                    'upcoming': upcoming_events,
                    'past': past_events
                },
                'top_events': [
                    {
                        'id': event.id,
                        'title': event.title,
                        'registration_count': event.registration_count
                    } for event in top_events
                ]
            },
            'certificates': {
                'total': total_certificates,
                'issued': issued_certificates
            },
            'badges': {
                'total': total_badges,
                'total_points': total_badge_points
            },
            'mentors': {
                'total': total_mentors
            },
            'applications': {
                'total': total_applications,
                'pending': pending_applications,
                'approved': approved_applications
            },
            'recent_activity': {
                'enrollments': recent_enrollments,
                'registrations': recent_registrations,
                'certificates': recent_certificates,
                'badges': recent_badges
            }
        }
        
        return Response(stats)


class AdminUserManagementView(APIView):
    """Admin user management with search and filtering"""
    permission_classes = [IsAdminUser]
    serializer_class = MessageSerializer
    
    def get(self, request):
        # Get query parameters
        search = request.query_params.get('search', '')
        role = request.query_params.get('role', '')
        status = request.query_params.get('status', '')
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 20))
        
        # Build queryset with consistent ordering for pagination
        users = User.objects.all().order_by('-date_joined')
        
        # Apply filters
        if search:
            users = users.filter(
                Q(username__icontains=search) |
                Q(email__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(unique_id__icontains=search)
            )
        
        if role:
            users = users.filter(role=role)
        
        if status == 'active':
            users = users.filter(is_active=True)
        elif status == 'inactive':
            users = users.filter(is_active=False)
        
        # Pagination
        start = (page - 1) * page_size
        end = start + page_size
        paginated_users = users[start:end]
        
        # Serialize users (simplified for admin view)
        user_data = []
        for user in paginated_users:
            user_data.append({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'unique_id': user.unique_id,
                'role': user.role,
                'is_active': user.is_active,
                'date_joined': user.date_joined,
                'last_login': user.last_login,
                'enrollment_count': user.enrollments.count(),
                'event_registration_count': user.event_registrations.count(),
                'certificate_count': user.certificates.count(),
                'badge_count': user.badges.count(),
            })
        
        return Response({
            'users': user_data,
            'total_count': users.count(),
            'page': page,
            'page_size': page_size,
            'total_pages': (users.count() + page_size - 1) // page_size
        })
    
    def patch(self, request, user_id):
        """Update user status or role"""
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        # Update fields
        if 'is_active' in request.data:
            user.is_active = request.data['is_active']
        
        if 'role' in request.data:
            user.role = request.data['role']
        
        user.save()
        
        return Response({
            'detail': f'User {user.username} updated successfully.',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'is_active': user.is_active
            }
        })


class AdminProgramManagementView(APIView):
    """Admin program management with statistics"""
    permission_classes = [IsAdminUser]
    serializer_class = MessageSerializer
    
    def get(self, request):
        programs = Program.objects.annotate(
            enrollment_count=Count('enrollments'),
            certificate_count=Count('certificates'),
            badge_count=Count('badges')
        )
        
        program_data = []
        for program in programs:
            program_data.append({
                'id': program.id,
                'title': program.title,
                'level': program.level,
                'duration': program.duration,
                'enrollment_count': program.enrollment_count,
                'certificate_count': program.certificate_count,
                'badge_count': program.badge_count,
                'created_at': program.created_at,
                'updated_at': program.updated_at
            })
        
        return Response(program_data)


class AdminEventManagementView(APIView):
    """Admin event management with statistics"""
    permission_classes = [IsAdminUser]
    serializer_class = MessageSerializer
    
    def get(self, request):
        search = request.query_params.get('search', '')
        category = request.query_params.get('category', '')
        status_filter = request.query_params.get('status', '')
        
        events = Event.objects.annotate(
            registration_count=Count('registrations'),
            certificate_count=Count('certificates'),
            badge_count=Count('badges')
        )
        
        if search:
            events = events.filter(title__icontains=search) | events.filter(description__icontains=search)
        
        if category:
            events = events.filter(category__iexact=category)
            
        if status_filter:
            if status_filter.lower() == 'active':
                events = events.filter(is_active=True)
            elif status_filter.lower() == 'inactive':
                events = events.filter(is_active=False)
        
        total_count = events.count()
        
        # Simple pagination if needed, but the frontend currently sends page/page_size
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 20))
        start = (page - 1) * page_size
        end = start + page_size
        
        paginated_events = events.order_by('-date')[start:end]
        
        event_data = []
        for event in paginated_events:
            image_url = ''
            if event.image:
                try:
                    image_url = event.image.url
                except AttributeError:
                    image_url = str(event.image)
                    
            event_data.append({
                'id': event.id,
                'title': event.title,
                'description': event.description,
                'category': event.category,
                'date': event.date,
                'time': event.time,
                'location': event.location,
                'format': event.format,
                'capacity': event.capacity,
                'price': float(event.price),
                'speaker': event.speaker,
                'topics': event.topics,
                'status': event.status,
                'is_active': event.is_active,
                'registration_count': event.registration_count,
                'certificate_count': event.certificate_count,
                'badge_count': event.badge_count,
                'image': image_url,
                'created_at': event.created_at,
                'updated_at': event.updated_at
            })
        
        return Response({
            'events': event_data,
            'total_count': total_count
        })


class AdminCertificateManagementView(APIView):
    """Admin certificate management with statistics"""
    permission_classes = [IsAdminUser]
    serializer_class = MessageSerializer
    
    def get(self, request):
        certificates = Certificate.objects.select_related('user', 'program', 'event')
        
        certificate_data = []
        for cert in certificates:
            certificate_data.append({
                'id': cert.id,
                'certificate_id': cert.certificate_id,
                'title': cert.title,
                'user': {
                    'id': cert.user.id,
                    'username': cert.user.username,
                    'unique_id': cert.user.unique_id
                },
                'certificate_type': cert.certificate_type,
                'status': cert.status,
                'issued_date': cert.issued_date,
                'score': cert.score,
                'program': cert.program.title if cert.program else None,
                'event': cert.event.title if cert.event else None
            })
        
        return Response(certificate_data)


class AdminBadgeManagementView(APIView):
    """Admin badge management with statistics"""
    permission_classes = [IsAdminUser]
    serializer_class = MessageSerializer
    
    def get(self, request):
        badges = Badge.objects.select_related('user', 'program', 'event')
        
        badge_data = []
        for badge in badges:
            badge_data.append({
                'id': badge.id,
                'title': badge.title,
                'badge_type': badge.badge_type,
                'points': badge.points,
                'color': badge.color,
                'user': {
                    'id': badge.user.id,
                    'username': badge.user.username,
                    'unique_id': badge.user.unique_id
                },
                'awarded_date': badge.awarded_date,
                'program': badge.program.title if badge.program else None,
                'event': badge.event.title if badge.event else None
            })
        
        return Response(badge_data)


class AdminMentorManagementView(APIView):
    """Admin mentor management with statistics"""
    permission_classes = [IsAdminUser]
    serializer_class = MessageSerializer
    
    def get(self, request):
        mentors = Mentor.objects.all()
        
        mentor_data = []
        for mentor in mentors:
            mentor_data.append({
                'id': mentor.id,
                'name': mentor.name,
                'email': mentor.email,
                'specialization': mentor.specialization,
                'is_active': mentor.is_active,
                'created_at': mentor.created_at,
                'updated_at': mentor.updated_at
            })
        
        return Response(mentor_data)


class AdminApplicationManagementView(APIView):
    """Admin application management with statistics"""
    permission_classes = [IsAdminUser]
    serializer_class = MessageSerializer
    
    def get(self, request):
        applications = Application.objects.all()
        
        application_data = []
        for app in applications:
            application_data.append({
                'id': app.id,
                'applicant_name': app.applicant_name,
                'email': app.email,
                'position': app.position,
                'status': app.status,
                'submitted_at': app.submitted_at,
                'updated_at': app.updated_at
            })
        
        return Response(application_data) 


# Import the models and serializers for contact page settings
from .models import ContactPageSettings, SiteSettings
from .serializers import ContactPageSettingsSerializer, SiteSettingsSerializer
from rest_framework.permissions import AllowAny


class ContactPageSettingsListView(APIView):
    """List all contact page settings or create a new one"""
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminUser()]
    
    def get(self, request):
        """Public endpoint to get all contact page settings"""
        settings = ContactPageSettings.objects.filter(is_active=True)
        serializer = ContactPageSettingsSerializer(settings, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        """Admin endpoint to create new contact page settings"""
        serializer = ContactPageSettingsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ContactPageSettingsDetailView(APIView):
    """Get, update or delete a specific contact page setting"""
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminUser()]
    
    def get_object(self, pk=None, contact_type=None):
        try:
            if pk:
                return ContactPageSettings.objects.get(pk=pk)
            elif contact_type:
                return ContactPageSettings.objects.get(contact_type=contact_type)
        except ContactPageSettings.DoesNotExist:
            return None
    
    def get(self, request, pk=None, contact_type=None):
        """Public endpoint to get a specific contact page setting by ID or type"""
        setting = self.get_object(pk=pk, contact_type=contact_type)
        if not setting:
            return Response(
                {'error': 'Contact page setting not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = ContactPageSettingsSerializer(setting)
        return Response(serializer.data)
    
    def put(self, request, pk=None, contact_type=None):
        """Admin endpoint to update a contact page setting"""
        setting = self.get_object(pk=pk, contact_type=contact_type)
        if not setting:
            return Response(
                {'error': 'Contact page setting not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = ContactPageSettingsSerializer(setting, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk=None, contact_type=None):
        """Admin endpoint to delete a contact page setting"""
        setting = self.get_object(pk=pk, contact_type=contact_type)
        if not setting:
            return Response(
                {'error': 'Contact page setting not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        setting.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ContactPageSettingsByTypeView(APIView):
    """Get contact page settings by type (public endpoint)"""
    permission_classes = [AllowAny]
    
    def get(self, request, contact_type):
        """Get contact settings by type: general, sponsor, or education"""
        try:
            setting = ContactPageSettings.objects.get(contact_type=contact_type, is_active=True)
            serializer = ContactPageSettingsSerializer(setting)
            return Response(serializer.data)
        except ContactPageSettings.DoesNotExist:
            # Return default values if not configured
            defaults = {
                'general': {
                    'contact_type': 'general',
                    'title': 'Get in Touch',
                    'subtitle': "We'd love to hear from you",
                    'description': "Whether you're ready to enroll, curious about our programs, or just want to say hi — drop us a line!",
                    'default_subject': '',
                    'default_message': '',
                    'button_text': 'Send Message',
                    'is_active': True
                },
                'sponsor': {
                    'contact_type': 'sponsor',
                    'title': 'Become a Sponsor',
                    'subtitle': 'Partner with us to empower African youth in tech',
                    'description': 'Join us in our mission to transform African youth through technology education. Your sponsorship will help provide scholarships, resources, and opportunities for aspiring developers.',
                    'default_subject': 'Partnership Inquiry - Sponsor',
                    'default_message': 'I am interested in becoming a sponsor for Code2Deploy programs and events.',
                    'button_text': 'Submit Sponsorship Inquiry',
                    'is_active': True
                },
                'education': {
                    'contact_type': 'education',
                    'title': 'Become an Education & Training Partner',
                    'subtitle': 'Collaborate with us to expand tech education across Africa',
                    'description': 'Partner with Code2Deploy to deliver world-class technology education. Together, we can create innovative learning programs, share resources, and empower the next generation of African developers.',
                    'default_subject': 'Partnership Inquiry - Education & Training Partner',
                    'default_message': 'I am interested in becoming an education and training partner with Code2Deploy.',
                    'button_text': 'Submit Partnership Inquiry',
                    'is_active': True
                }
            }
            return Response(defaults.get(contact_type, defaults['general']))


class InitializeContactSettingsView(APIView):
    """Initialize default contact page settings (admin only)"""
    permission_classes = [IsAdminUser]
    
    def post(self, request):
        """Create default contact settings if they don't exist"""
        defaults = [
            {
                'contact_type': 'general',
                'title': 'Get in Touch',
                'subtitle': "We'd love to hear from you",
                'description': "Whether you're ready to enroll, curious about our programs, or just want to say hi — drop us a line!",
                'default_subject': '',
                'default_message': '',
                'button_text': 'Send Message',
                'contact_info_title': 'Ping Our Network',
                'visit_label': 'Visit Us',
                'visit_address': '123 Tech Hub, Innovation Street\nLagos, Nigeria',
                'email_label': 'Email Us',
                'primary_email': 'info@code2deploy.com',
                'secondary_email': 'support@code2deploy.com',
                'phone_label': 'Call Us',
                'phone_number': '+254 743 864 7890',
                'phone_hours': 'Mon-Fri: 9AM-6PM WAT'
            },
            {
                'contact_type': 'sponsor',
                'title': 'Become a Sponsor',
                'subtitle': 'Partner with us to empower African youth in tech',
                'description': 'Join us in our mission to transform African youth through technology education. Your sponsorship will help provide scholarships, resources, and opportunities for aspiring developers.',
                'default_subject': 'Partnership Inquiry - Sponsor',
                'default_message': 'I am interested in becoming a sponsor for Code2Deploy programs and events.',
                'button_text': 'Submit Sponsorship Inquiry',
                'contact_info_title': 'Ping Our Network',
                'visit_label': 'Visit Us',
                'visit_address': '123 Tech Hub, Innovation Street\nLagos, Nigeria',
                'email_label': 'Email Us',
                'primary_email': 'info@code2deploy.com',
                'secondary_email': 'support@code2deploy.com',
                'phone_label': 'Call Us',
                'phone_number': '+254 743 864 7890',
                'phone_hours': 'Mon-Fri: 9AM-6PM WAT'
            },
            {
                'contact_type': 'education',
                'title': 'Become an Education & Training Partner',
                'subtitle': 'Collaborate with us to expand tech education across Africa',
                'description': 'Partner with Code2Deploy to deliver world-class technology education. Together, we can create innovative learning programs, share resources, and empower the next generation of African developers.',
                'default_subject': 'Partnership Inquiry - Education & Training Partner',
                'default_message': 'I am interested in becoming an education and training partner with Code2Deploy.',
                'button_text': 'Submit Partnership Inquiry',
                'contact_info_title': 'Ping Our Network',
                'visit_label': 'Visit Us',
                'visit_address': '123 Tech Hub, Innovation Street\nLagos, Nigeria',
                'email_label': 'Email Us',
                'primary_email': 'info@code2deploy.com',
                'secondary_email': 'support@code2deploy.com',
                'phone_label': 'Call Us',
                'phone_number': '+254 743 864 7890',
                'phone_hours': 'Mon-Fri: 9AM-6PM WAT'
            }
        ]
        
        created = []
        for default in defaults:
            obj, was_created = ContactPageSettings.objects.get_or_create(
                contact_type=default['contact_type'],
                defaults=default
            )
            if was_created:
                created.append(default['contact_type'])
        
        if created:
            return Response({
                'message': f'Created settings for: {", ".join(created)}',
                'created': created
            }, status=status.HTTP_201_CREATED)
        return Response({
            'message': 'All contact settings already exist',
            'created': []
        })


class SiteSettingsView(APIView):
    """Get or update site settings"""
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminUser()]
    
    def get(self, request):
        """Get site settings"""
        settings = SiteSettings.objects.first()
        if not settings:
            # Return defaults
            return Response({
                'site_name': 'Code2Deploy',
                'tagline': 'Empowering African Youth Through Technology',
                'contact_email': 'info@code2deploy.com',
                'contact_phone': '',
                'address': '123 Tech Hub, Innovation Street, Lagos, Nigeria'
            })
        serializer = SiteSettingsSerializer(settings)
        return Response(serializer.data)
    
    def put(self, request):
        """Update site settings"""
        settings = SiteSettings.objects.first()
        if not settings:
            settings = SiteSettings.objects.create(**request.data)
            serializer = SiteSettingsSerializer(settings)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        serializer = SiteSettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Import additional models and serializers for page settings
from .models import HomePageSettings, AboutPageSettings, ProgramsPageSettings, EventsPageSettings
from .serializers import (
    HomePageSettingsSerializer, AboutPageSettingsSerializer,
    ProgramsPageSettingsSerializer, EventsPageSettingsSerializer
)


class HomePageSettingsView(APIView):
    """Get or update home page settings"""
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminUser()]
    
    def get(self, request):
        """Get home page settings"""
        settings = HomePageSettings.objects.first()
        if not settings:
            # Return defaults
            return Response({
                'hero_title_line1': 'From',
                'hero_title_highlight1': 'Hello World',
                'hero_title_line2': 'to',
                'hero_title_highlight2': 'Hello AI',
                'hero_description': 'Empowering African youth with cutting-edge tech skills to build solutions that matter. Join our community of innovators today.',
                'hero_button1_text': 'Join a Program',
                'hero_button1_link': '/programs',
                'hero_button2_text': 'Upcoming Events',
                'hero_button2_link': '/events',
                'hero_image_url': None,
                'approach_title': 'Our Approach',
                'approach_description': "Most courses stop at code. We take you further. By the end of our program, you'll have:",
                'what_we_do_title': 'What We Do',
                'is_active': True
            })
        serializer = HomePageSettingsSerializer(settings)
        return Response(serializer.data)
    
    def put(self, request):
        """Update home page settings"""
        settings = HomePageSettings.objects.first()
        if not settings:
            settings = HomePageSettings.objects.create(**request.data)
            serializer = HomePageSettingsSerializer(settings)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        serializer = HomePageSettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AboutPageSettingsView(APIView):
    """Get or update about page settings"""
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminUser()]
    
    def get(self, request):
        """Get about page settings"""
        settings = AboutPageSettings.objects.first()
        if not settings:
            return Response({
                'hero_title': 'About Code2Deploy',
                'hero_subtitle': 'Empowering African youth with cutting-edge tech skills',
                'hero_image_url': None,
                'mission_title': 'Our Mission',
                'mission_description': 'To bridge the digital skills gap in Africa by providing world-class technology education and creating pathways to successful careers in the global tech industry.',
                'vision_title': 'Our Vision',
                'vision_description': "To be Africa's leading technology education platform, empowering the next generation of tech leaders and innovators who will drive the continent's digital transformation.",
                'journey_title': 'Our Journey',
                'team_title': 'Our Leadership Team',
                'is_active': True
            })
        serializer = AboutPageSettingsSerializer(settings)
        return Response(serializer.data)
    
    def put(self, request):
        """Update about page settings"""
        settings = AboutPageSettings.objects.first()
        if not settings:
            settings = AboutPageSettings.objects.create(**request.data)
            serializer = AboutPageSettingsSerializer(settings)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        serializer = AboutPageSettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProgramsPageSettingsView(APIView):
    """Get or update programs page settings"""
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminUser()]
    
    def get(self, request):
        """Get programs page settings"""
        settings = ProgramsPageSettings.objects.first()
        if not settings:
            return Response({
                'hero_title': 'Our Programs',
                'hero_subtitle': 'Discover world-class technology programs designed for African youth',
                'hero_description': 'From beginner to advanced, our programs are designed to take you from where you are to where you want to be in tech.',
                'programs_section_title': 'Available Programs',
                'no_programs_message': 'No programs available at the moment. Check back soon!',
                'cta_title': 'Ready to Start Your Journey?',
                'cta_description': 'Join thousands of students who have transformed their careers through our programs.',
                'cta_button_text': 'Apply Now',
                'is_active': True
            })
        serializer = ProgramsPageSettingsSerializer(settings)
        return Response(serializer.data)
    
    def put(self, request):
        """Update programs page settings"""
        settings = ProgramsPageSettings.objects.first()
        if not settings:
            settings = ProgramsPageSettings.objects.create(**request.data)
            serializer = ProgramsPageSettingsSerializer(settings)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        serializer = ProgramsPageSettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EventsPageSettingsView(APIView):
    """Get or update events page settings"""
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminUser()]
    
    def get(self, request):
        """Get events page settings"""
        settings = EventsPageSettings.objects.first()
        if not settings:
            return Response({
                'hero_title': 'Upcoming Events',
                'hero_subtitle': 'Join us for exciting tech events, workshops, and networking opportunities',
                'hero_description': 'Stay connected with the Code2Deploy community through our events.',
                'events_section_title': 'All Events',
                'no_events_message': 'No upcoming events at the moment. Check back soon!',
                'cta_title': 'Want to Host an Event?',
                'cta_description': 'Partner with us to bring tech events to your community.',
                'cta_button_text': 'Contact Us',
                'cta_button_link': '/contact',
                'is_active': True
            })
        serializer = EventsPageSettingsSerializer(settings)
        return Response(serializer.data)
    
    def put(self, request):
        """Update events page settings"""
        settings = EventsPageSettings.objects.first()
        if not settings:
            settings = EventsPageSettings.objects.create(**request.data)
            serializer = EventsPageSettingsSerializer(settings)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        serializer = EventsPageSettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InitializeAllPageSettingsView(APIView):
    """Initialize all page settings at once (admin only)"""
    permission_classes = [IsAdminUser]
    
    def post(self, request):
        """Create default settings for all pages if they don't exist"""
        created = []
        
        # Home Page
        if not HomePageSettings.objects.exists():
            HomePageSettings.objects.create()
            created.append('home')
        
        # About Page
        if not AboutPageSettings.objects.exists():
            AboutPageSettings.objects.create()
            created.append('about')
        
        # Programs Page
        if not ProgramsPageSettings.objects.exists():
            ProgramsPageSettings.objects.create()
            created.append('programs')
        
        # Events Page
        if not EventsPageSettings.objects.exists():
            EventsPageSettings.objects.create()
            created.append('events')
        
        if created:
            return Response({
                'message': f'Created settings for: {", ".join(created)}',
                'created': created
            }, status=status.HTTP_201_CREATED)
        return Response({
            'message': 'All page settings already exist',
            'created': []
        }) 