from rest_framework import serializers
from .models import Notification, NotificationPreference
from programs.serializers import ProgramSerializer
from events.serializers import EventSerializer
from certificates.serializers import CertificateSerializer, BadgeSerializer


class NotificationSerializer(serializers.ModelSerializer):
    program = ProgramSerializer(read_only=True)
    event = EventSerializer(read_only=True)
    certificate = CertificateSerializer(read_only=True)
    badge = BadgeSerializer(read_only=True)
    
    class Meta:
        model = Notification
        fields = [
            'id', 'notification_type', 'title', 'message', 'priority', 'status',
            'program', 'event', 'certificate', 'badge', 'application',
            'action_url', 'action_text', 'created_at', 'read_at',
            'sent_via_email', 'sent_via_push'
        ]
        read_only_fields = ['id', 'created_at', 'read_at', 'sent_via_email', 'sent_via_push']


class NotificationListSerializer(serializers.ModelSerializer):
    """Simplified serializer for notification lists"""
    program_title = serializers.CharField(source='program.title', read_only=True)
    event_title = serializers.CharField(source='event.title', read_only=True)
    
    class Meta:
        model = Notification
        fields = [
            'id', 'notification_type', 'title', 'message', 'priority', 'status',
            'program_title', 'event_title', 'action_url', 'action_text', 'created_at'
        ]


class NotificationPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationPreference
        fields = [
            'email_enabled', 'email_program_updates', 'email_event_reminders',
            'email_certificate_issued', 'email_badge_awarded', 'email_application_updates',
            'email_system_announcements', 'push_enabled', 'push_program_updates',
            'push_event_reminders', 'push_certificate_issued', 'push_badge_awarded',
            'push_application_updates', 'push_system_announcements', 'digest_frequency'
        ]


class NotificationStatsSerializer(serializers.Serializer):
    """Serializer for notification statistics"""
    total_notifications = serializers.IntegerField()
    unread_count = serializers.IntegerField()
    read_count = serializers.IntegerField()
    archived_count = serializers.IntegerField()
    by_type = serializers.DictField()
    by_priority = serializers.DictField() 


class MessageSerializer(serializers.Serializer):
    detail = serializers.CharField() 