from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Mentor, MentorProgram, MentorMentee, MentorSession, 
    SessionAttendee, SessionNote, MentorAvailability, 
    MentorMessage, Assignment, AssignmentSubmission, MentorResource
)

User = get_user_model()


class UserMinimalSerializer(serializers.ModelSerializer):
    """Minimal user info for listings"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'avatar']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # avatar is now a TextField (URL string), so just include it as-is
        return data


class MentorSerializer(serializers.ModelSerializer):
    expertise_list = serializers.ReadOnlyField()
    user_email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    
    class Meta:
        model = Mentor
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # photo is now a TextField (URL string), so just include it as-is
        # No need to call .url on it
        return data


class MentorProgramSerializer(serializers.ModelSerializer):
    program_title = serializers.CharField(source='program.title', read_only=True)
    mentor_name = serializers.CharField(source='mentor.name', read_only=True)
    
    class Meta:
        model = MentorProgram
        fields = '__all__'


class MentorMenteeSerializer(serializers.ModelSerializer):
    mentee_details = UserMinimalSerializer(source='mentee', read_only=True)
    program_title = serializers.CharField(source='program.title', read_only=True)
    mentor_name = serializers.CharField(source='mentor.name', read_only=True)
    
    class Meta:
        model = MentorMentee
        fields = '__all__'


class SessionAttendeeSerializer(serializers.ModelSerializer):
    user_details = UserMinimalSerializer(source='user', read_only=True)
    
    class Meta:
        model = SessionAttendee
        fields = '__all__'


class MentorSessionSerializer(serializers.ModelSerializer):
    attendees = SessionAttendeeSerializer(many=True, read_only=True)
    program_title = serializers.CharField(source='program.title', read_only=True)
    mentor_name = serializers.CharField(source='mentor.name', read_only=True)
    attendee_count = serializers.SerializerMethodField()
    
    class Meta:
        model = MentorSession
        fields = '__all__'
    
    def get_attendee_count(self, obj):
        return obj.attendees.count()


class SessionNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionNote
        fields = '__all__'


class MentorAvailabilitySerializer(serializers.ModelSerializer):
    day_name = serializers.CharField(source='get_day_of_week_display', read_only=True)
    
    class Meta:
        model = MentorAvailability
        fields = '__all__'


class MentorMessageSerializer(serializers.ModelSerializer):
    sender_details = UserMinimalSerializer(source='sender', read_only=True)
    recipient_details = UserMinimalSerializer(source='recipient', read_only=True)
    
    class Meta:
        model = MentorMessage
        fields = '__all__'


class AssignmentSubmissionSerializer(serializers.ModelSerializer):
    student_details = UserMinimalSerializer(source='student', read_only=True)
    assignment_title = serializers.CharField(source='assignment.title', read_only=True)
    
    class Meta:
        model = AssignmentSubmission
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # submission_file is now a TextField (URL string), so just include it as-is
        return data


class AssignmentSerializer(serializers.ModelSerializer):
    submissions = AssignmentSubmissionSerializer(many=True, read_only=True)
    submission_count = serializers.SerializerMethodField()
    pending_reviews = serializers.SerializerMethodField()
    program_title = serializers.CharField(source='program.title', read_only=True)
    
    class Meta:
        model = Assignment
        fields = '__all__'
    
    def get_submission_count(self, obj):
        return obj.submissions.count()
    
    def get_pending_reviews(self, obj):
        return obj.submissions.filter(status='submitted').count()


class MentorResourceSerializer(serializers.ModelSerializer):
    program_title = serializers.CharField(source='program.title', read_only=True)
    
    class Meta:
        model = MentorResource
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # file is now a TextField (URL string), so just include it as-is
        return data


class MentorDashboardSerializer(serializers.Serializer):
    """Aggregated data for mentor dashboard overview"""
    total_mentees = serializers.IntegerField()
    total_sessions = serializers.IntegerField()
    upcoming_sessions = serializers.IntegerField()
    completed_sessions = serializers.IntegerField()
    total_programs = serializers.IntegerField()
    pending_reviews = serializers.IntegerField()
    total_assignments = serializers.IntegerField()
    unread_messages = serializers.IntegerField()
    recent_sessions = MentorSessionSerializer(many=True)
    recent_submissions = AssignmentSubmissionSerializer(many=True) 