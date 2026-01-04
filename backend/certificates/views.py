from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db.models import Count, Sum
from .models import Certificate, Badge
from .serializers import (
    CertificateSerializer, BadgeSerializer,
    UserCertificatesSerializer, UserBadgesSerializer,
    MessageSerializer, CertificateStatsSerializer, BadgeStatsSerializer
)


class CertificateListCreateView(generics.ListCreateAPIView):
    """Admin: List all certificates or create new ones"""
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer
    permission_classes = [IsAdminUser]


class CertificateRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """Admin: Retrieve, update, or delete a specific certificate"""
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer
    permission_classes = [IsAdminUser]


class BadgeListCreateView(generics.ListCreateAPIView):
    """Admin: List all badges or create new ones"""
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer
    permission_classes = [IsAdminUser]


class BadgeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """Admin: Retrieve, update, or delete a specific badge"""
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer
    permission_classes = [IsAdminUser]


class UserCertificatesView(generics.ListAPIView):
    """User: Get their own certificates"""
    serializer_class = UserCertificatesSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Certificate.objects.filter(user=self.request.user)


class UserCertificatesWithFilterView(UserCertificatesView):
    """User: Get their certificates with filtering"""
    def get_queryset(self):
        qs = super().get_queryset()
        
        # Filter by status
        status_param = self.request.query_params.get('status')
        if status_param:
            qs = qs.filter(status=status_param)
        
        # Filter by certificate type
        cert_type = self.request.query_params.get('type')
        if cert_type:
            qs = qs.filter(certificate_type=cert_type)
        
        # Filter by program
        program_id = self.request.query_params.get('program')
        if program_id:
            qs = qs.filter(program_id=program_id)
        
        # Filter by event
        event_id = self.request.query_params.get('event')
        if event_id:
            qs = qs.filter(event_id=event_id)
        
        return qs


class UserBadgesView(generics.ListAPIView):
    """User: Get their own badges"""
    serializer_class = UserBadgesSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Badge.objects.filter(user=self.request.user)


class UserBadgesWithFilterView(UserBadgesView):
    """User: Get their badges with filtering"""
    def get_queryset(self):
        qs = super().get_queryset()
        
        # Filter by badge type
        badge_type = self.request.query_params.get('type')
        if badge_type:
            qs = qs.filter(badge_type=badge_type)
        
        # Filter by program
        program_id = self.request.query_params.get('program')
        if program_id:
            qs = qs.filter(program_id=program_id)
        
        # Filter by event
        event_id = self.request.query_params.get('event')
        if event_id:
            qs = qs.filter(event_id=event_id)
        
        return qs


class UserCertificateStatsView(APIView):
    """User: Get certificate statistics"""
    permission_classes = [IsAuthenticated]
    serializer_class = CertificateStatsSerializer
    
    def get(self, request):
        user = request.user
        certificates = Certificate.objects.filter(user=user)
        
        stats = {
            'total_certificates': certificates.count(),
            'issued_certificates': certificates.filter(status='issued').count(),
            'pending_certificates': certificates.filter(status='pending').count(),
            'expired_certificates': certificates.filter(status='expired').count(),
            'by_type': {},
            'total_points': 0,  # If certificates have points
        }
        
        # Count by certificate type
        for cert_type, _ in Certificate.CERTIFICATE_TYPES:
            stats['by_type'][cert_type] = certificates.filter(
                certificate_type=cert_type
            ).count()
        
        # Calculate total points (if certificates have scores)
        total_score = certificates.aggregate(
            total=Sum('score')
        )['total'] or 0
        stats['total_score'] = float(total_score)
        
        return Response(stats)


class UserBadgeStatsView(APIView):
    """User: Get badge statistics"""
    permission_classes = [IsAuthenticated]
    serializer_class = BadgeStatsSerializer
    
    def get(self, request):
        user = request.user
        badges = Badge.objects.filter(user=user)
        
        stats = {
            'total_badges': badges.count(),
            'total_points': badges.aggregate(total=Sum('points'))['total'] or 0,
            'by_type': {},
            'recent_badges': UserBadgesSerializer(
                badges.order_by('-awarded_date')[:5], many=True
            ).data
        }
        
        # Count by badge type
        for badge_type, _ in Badge.BADGE_TYPES:
            stats['by_type'][badge_type] = badges.filter(
                badge_type=badge_type
            ).count()
        
        return Response(stats)


class AwardCertificateView(APIView):
    """Admin: Award a certificate to a user"""
    permission_classes = [IsAdminUser]
    serializer_class = MessageSerializer
    
    def post(self, request):
        serializer = CertificateSerializer(data=request.data)
        if serializer.is_valid():
            certificate = serializer.save()
            return Response(
                {
                    'detail': f'🎉 Certificate "{certificate.title}" awarded to {certificate.user.username}!',
                    'certificate': CertificateSerializer(certificate).data
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AwardBadgeView(APIView):
    """Admin: Award a badge to a user"""
    permission_classes = [IsAdminUser]
    serializer_class = MessageSerializer
    
    def post(self, request):
        serializer = BadgeSerializer(data=request.data)
        if serializer.is_valid():
            badge = serializer.save()
            return Response(
                {
                    'detail': f'🏆 Badge "{badge.title}" awarded to {badge.user.username}!',
                    'badge': BadgeSerializer(badge).data
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CertificateDetailView(generics.RetrieveAPIView):
    """User: Get detailed view of their own certificate"""
    serializer_class = CertificateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Certificate.objects.filter(user=self.request.user)


class BadgeDetailView(generics.RetrieveAPIView):
    """User: Get detailed view of their own badge"""
    serializer_class = BadgeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Badge.objects.filter(user=self.request.user) 