from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Certificate, Badge

User = get_user_model()


class CertificateModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_certificate_creation(self):
        certificate = Certificate.objects.create(
            user=self.user,
            title='Test Certificate',
            description='Test description',
            certificate_type='program_completion',
            status='issued'
        )
        self.assertEqual(certificate.user, self.user)
        self.assertEqual(certificate.title, 'Test Certificate')
        self.assertTrue(certificate.certificate_id.startswith('CERT-'))
    
    def test_certificate_string_representation(self):
        certificate = Certificate.objects.create(
            user=self.user,
            title='Test Certificate',
            description='Test description',
            certificate_type='program_completion'
        )
        self.assertIn('Test Certificate', str(certificate))
        self.assertIn(self.user.username, str(certificate))


class BadgeModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_badge_creation(self):
        badge = Badge.objects.create(
            user=self.user,
            title='Test Badge',
            description='Test badge description',
            badge_type='achievement',
            points=100
        )
        self.assertEqual(badge.user, self.user)
        self.assertEqual(badge.title, 'Test Badge')
        self.assertEqual(badge.points, 100)
    
    def test_badge_string_representation(self):
        badge = Badge.objects.create(
            user=self.user,
            title='Test Badge',
            description='Test description',
            badge_type='achievement'
        )
        self.assertIn('Test Badge', str(badge))
        self.assertIn(self.user.username, str(badge))


class CertificateAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.certificate = Certificate.objects.create(
            user=self.user,
            title='Test Certificate',
            description='Test description',
            certificate_type='program_completion',
            status='issued'
        )
    
    def test_user_certificates_list(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/certificates/me/certificates/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_user_certificate_stats(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/certificates/me/certificates/stats/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_certificates'], 1)
        self.assertEqual(response.data['issued_certificates'], 1)


class BadgeAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.badge = Badge.objects.create(
            user=self.user,
            title='Test Badge',
            description='Test description',
            badge_type='achievement',
            points=100
        )
    
    def test_user_badges_list(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/certificates/me/badges/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_user_badge_stats(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/certificates/me/badges/stats/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_badges'], 1)
        self.assertEqual(response.data['total_points'], 100) 