from django.contrib import admin
from .models import (
    Mentor, MentorProgram, MentorMentee, MentorSession,
    SessionAttendee, SessionNote, MentorAvailability,
    MentorMessage, Assignment, AssignmentSubmission, MentorResource
)


@admin.register(Mentor)
class MentorAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'expertise', 'years_experience', 'is_active', 'created_at']
    list_filter = ['is_active', 'years_experience']
    search_fields = ['name', 'expertise', 'user__email']


@admin.register(MentorProgram)
class MentorProgramAdmin(admin.ModelAdmin):
    list_display = ['mentor', 'program', 'role', 'is_active', 'assigned_at']
    list_filter = ['role', 'is_active']


@admin.register(MentorMentee)
class MentorMenteeAdmin(admin.ModelAdmin):
    list_display = ['mentor', 'mentee', 'program', 'is_active', 'assigned_at']
    list_filter = ['is_active']
    search_fields = ['mentor__name', 'mentee__username', 'mentee__email']


@admin.register(MentorSession)
class MentorSessionAdmin(admin.ModelAdmin):
    list_display = ['title', 'mentor', 'session_type', 'scheduled_at', 'status', 'max_attendees']
    list_filter = ['status', 'session_type']
    search_fields = ['title', 'mentor__name']
    date_hierarchy = 'scheduled_at'


@admin.register(SessionAttendee)
class SessionAttendeeAdmin(admin.ModelAdmin):
    list_display = ['session', 'user', 'attended', 'rating', 'registered_at']
    list_filter = ['attended']


@admin.register(SessionNote)
class SessionNoteAdmin(admin.ModelAdmin):
    list_display = ['session', 'mentor', 'is_private', 'created_at']
    list_filter = ['is_private']


@admin.register(MentorAvailability)
class MentorAvailabilityAdmin(admin.ModelAdmin):
    list_display = ['mentor', 'day_of_week', 'start_time', 'end_time', 'is_available']
    list_filter = ['day_of_week', 'is_available']


@admin.register(MentorMessage)
class MentorMessageAdmin(admin.ModelAdmin):
    list_display = ['sender', 'recipient', 'subject', 'is_read', 'created_at']
    list_filter = ['is_read']
    search_fields = ['sender__username', 'recipient__username', 'subject']


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ['title', 'mentor', 'program', 'due_date', 'max_score', 'created_at']
    list_filter = ['program']
    search_fields = ['title', 'mentor__name']
    date_hierarchy = 'due_date'


@admin.register(AssignmentSubmission)
class AssignmentSubmissionAdmin(admin.ModelAdmin):
    list_display = ['assignment', 'student', 'status', 'score', 'submitted_at', 'reviewed_at']
    list_filter = ['status']
    search_fields = ['student__username', 'assignment__title']


@admin.register(MentorResource)
class MentorResourceAdmin(admin.ModelAdmin):
    list_display = ['title', 'mentor', 'resource_type', 'program', 'is_public', 'created_at']
    list_filter = ['resource_type', 'is_public']
    search_fields = ['title', 'mentor__name']
