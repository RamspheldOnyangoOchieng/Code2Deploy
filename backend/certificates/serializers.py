from rest_framework import serializers
from .models import Certificate, Badge
from programs.serializers import ProgramSerializer
from events.serializers import EventSerializer


class CertificateSerializer(serializers.ModelSerializer):
    program = ProgramSerializer(read_only=True)
    event = EventSerializer(read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    user_unique_id = serializers.CharField(source='user.unique_id', read_only=True)
    
    class Meta:
        model = Certificate
        fields = [
            'id', 'certificate_id', 'title', 'description', 'certificate_type',
            'status', 'program', 'event', 'issued_date', 'expiry_date',
            'certificate_url', 'skills_covered', 'score', 'issued_by',
            'user_username', 'user_unique_id', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'certificate_id', 'issued_date', 'created_at', 'updated_at']


class BadgeSerializer(serializers.ModelSerializer):
    program = ProgramSerializer(read_only=True)
    event = EventSerializer(read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    user_unique_id = serializers.CharField(source='user.unique_id', read_only=True)
    
    class Meta:
        model = Badge
        fields = [
            'id', 'title', 'description', 'badge_type', 'icon', 'color',
            'points', 'program', 'event', 'awarded_date', 'criteria',
            'user_username', 'user_unique_id'
        ]
        read_only_fields = ['id', 'awarded_date']
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # icon is now a TextField (URL string), so just include it as-is
        return data


class UserCertificatesSerializer(serializers.ModelSerializer):
    """Simplified serializer for user's certificates list"""
    program_title = serializers.CharField(source='program.title', read_only=True)
    event_title = serializers.CharField(source='event.title', read_only=True)
    
    class Meta:
        model = Certificate
        fields = [
            'id', 'certificate_id', 'title', 'certificate_type', 'status',
            'issued_date', 'certificate_url', 'score', 'program_title', 'event_title'
        ]


class UserBadgesSerializer(serializers.ModelSerializer):
    """Simplified serializer for user's badges list"""
    program_title = serializers.CharField(source='program.title', read_only=True)
    event_title = serializers.CharField(source='event.title', read_only=True)
    
    class Meta:
        model = Badge
        fields = [
            'id', 'title', 'badge_type', 'icon', 'color', 'points',
            'awarded_date', 'program_title', 'event_title'
        ]
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # icon is now a TextField (URL string), so just include it as-is
        return data

class MessageSerializer(serializers.Serializer):
    detail = serializers.CharField()

class CertificateStatsSerializer(serializers.Serializer):
    total_certificates = serializers.IntegerField()
    issued_certificates = serializers.IntegerField()
    pending_certificates = serializers.IntegerField()
    expired_certificates = serializers.IntegerField()
    by_type = serializers.DictField()
    total_points = serializers.IntegerField()
    total_score = serializers.FloatField()

class BadgeStatsSerializer(serializers.Serializer):
    total_badges = serializers.IntegerField()
    total_points = serializers.IntegerField()
    by_type = serializers.DictField()
    recent_badges = UserBadgesSerializer(many=True) 