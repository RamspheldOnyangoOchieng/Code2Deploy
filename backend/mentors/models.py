from django.db import models
from django.conf import settings
from cloudinary.models import CloudinaryField


class Mentor(models.Model):
    """Extended mentor profile linked to User"""
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='mentor_profile',
        null=True, 
        blank=True
    )
    name = models.CharField(max_length=100)
    bio = models.TextField(blank=True)
    expertise = models.CharField(max_length=255, help_text='Comma-separated list of expertise areas')
    phone = models.CharField(max_length=20, blank=True, null=True)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    photo = models.TextField(
        blank=True, 
        null=True,
        help_text="Cloudinary ID or external URL"
    )
    linkedin = models.URLField(blank=True, null=True)
    twitter = models.URLField(blank=True, null=True)
    github = models.URLField(blank=True, null=True)
    years_experience = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    @property
    def expertise_list(self):
        return [e.strip() for e in self.expertise.split(',') if e.strip()]


class MentorProgram(models.Model):
    """Links mentors to programs they teach"""
    mentor = models.ForeignKey(Mentor, on_delete=models.CASCADE, related_name='program_assignments')
    program = models.ForeignKey('programs.Program', on_delete=models.CASCADE, related_name='mentor_assignments')
    role = models.CharField(max_length=50, choices=[
        ('lead', 'Lead Mentor'),
        ('assistant', 'Assistant Mentor'),
        ('guest', 'Guest Mentor'),
    ], default='lead')
    assigned_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('mentor', 'program')

    def __str__(self):
        return f"{self.mentor.name} - {self.program.title}"


class MentorMentee(models.Model):
    """Links mentors to their assigned mentees (students)"""
    mentor = models.ForeignKey(Mentor, on_delete=models.CASCADE, related_name='mentees')
    mentee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='mentors')
    program = models.ForeignKey('programs.Program', on_delete=models.CASCADE, related_name='mentor_mentee_pairs', null=True, blank=True)
    assigned_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    notes = models.TextField(blank=True, help_text='Private notes about the mentee')

    class Meta:
        unique_together = ('mentor', 'mentee', 'program')

    def __str__(self):
        return f"{self.mentor.name} mentoring {self.mentee.username}"


class MentorSession(models.Model):
    """Scheduled mentoring sessions"""
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
    ]
    
    SESSION_TYPE_CHOICES = [
        ('one_on_one', 'One-on-One'),
        ('group', 'Group Session'),
        ('workshop', 'Workshop'),
        ('review', 'Code Review'),
        ('office_hours', 'Office Hours'),
    ]

    mentor = models.ForeignKey(Mentor, on_delete=models.CASCADE, related_name='sessions')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    session_type = models.CharField(max_length=20, choices=SESSION_TYPE_CHOICES, default='one_on_one')
    program = models.ForeignKey('programs.Program', on_delete=models.SET_NULL, null=True, blank=True, related_name='mentor_sessions')
    scheduled_at = models.DateTimeField()
    duration_minutes = models.IntegerField(default=60)
    meeting_link = models.URLField(blank=True, null=True, help_text='Zoom/Meet link')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    max_attendees = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-scheduled_at']

    def __str__(self):
        return f"{self.title} - {self.scheduled_at.strftime('%Y-%m-%d %H:%M')}"


class SessionAttendee(models.Model):
    """Attendees for a mentoring session"""
    session = models.ForeignKey(MentorSession, on_delete=models.CASCADE, related_name='attendees')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='session_attendances')
    attended = models.BooleanField(default=False)
    feedback = models.TextField(blank=True)
    rating = models.IntegerField(null=True, blank=True, choices=[(i, str(i)) for i in range(1, 6)])
    registered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('session', 'user')

    def __str__(self):
        return f"{self.user.username} - {self.session.title}"


class SessionNote(models.Model):
    """Notes/feedback from mentor about a session"""
    session = models.ForeignKey(MentorSession, on_delete=models.CASCADE, related_name='notes')
    mentor = models.ForeignKey(Mentor, on_delete=models.CASCADE, related_name='session_notes')
    content = models.TextField()
    is_private = models.BooleanField(default=True, help_text='Private notes not visible to mentees')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Note for {self.session.title}"


class MentorAvailability(models.Model):
    """Mentor's available time slots"""
    DAYS_OF_WEEK = [
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    ]

    mentor = models.ForeignKey(Mentor, on_delete=models.CASCADE, related_name='availability_slots')
    day_of_week = models.IntegerField(choices=DAYS_OF_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = 'Mentor availabilities'
        ordering = ['day_of_week', 'start_time']

    def __str__(self):
        return f"{self.mentor.name} - {self.get_day_of_week_display()} {self.start_time}-{self.end_time}"


class MentorMessage(models.Model):
    """Messages between mentor and mentees"""
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_mentor_messages')
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_mentor_messages')
    subject = models.CharField(max_length=200, blank=True)
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.sender.username} to {self.recipient.username}: {self.subject[:30]}"


class Assignment(models.Model):
    """Assignments given by mentors to mentees"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('submitted', 'Submitted'),
        ('reviewed', 'Reviewed'),
        ('approved', 'Approved'),
        ('needs_revision', 'Needs Revision'),
    ]

    mentor = models.ForeignKey(Mentor, on_delete=models.CASCADE, related_name='created_assignments')
    program = models.ForeignKey('programs.Program', on_delete=models.CASCADE, related_name='assignments')
    title = models.CharField(max_length=200)
    description = models.TextField()
    instructions = models.TextField(blank=True)
    due_date = models.DateTimeField()
    max_score = models.IntegerField(default=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-due_date']

    def __str__(self):
        return self.title


class AssignmentSubmission(models.Model):
    """Student submissions for assignments"""
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='assignment_submissions')
    submission_text = models.TextField(blank=True)
    submission_url = models.URLField(blank=True, null=True, help_text='Link to code repo or document')
    submission_file = models.TextField(blank=True, null=True, help_text="Cloudinary ID or external URL")
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('submitted', 'Submitted'),
        ('reviewed', 'Reviewed'),
        ('approved', 'Approved'),
        ('needs_revision', 'Needs Revision'),
    ], default='pending')
    score = models.IntegerField(null=True, blank=True)
    feedback = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    reviewed_by = models.ForeignKey(Mentor, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_submissions')

    class Meta:
        unique_together = ('assignment', 'student')
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.student.username} - {self.assignment.title}"


class MentorResource(models.Model):
    """Resources shared by mentors"""
    RESOURCE_TYPE_CHOICES = [
        ('document', 'Document'),
        ('video', 'Video'),
        ('link', 'External Link'),
        ('template', 'Template'),
        ('guide', 'Guide'),
    ]

    mentor = models.ForeignKey(Mentor, on_delete=models.CASCADE, related_name='resources')
    program = models.ForeignKey('programs.Program', on_delete=models.CASCADE, related_name='mentor_resources', null=True, blank=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPE_CHOICES, default='document')
    url = models.URLField(blank=True, null=True)
    file = models.TextField(blank=True, null=True, help_text="Cloudinary ID or external URL")
    is_public = models.BooleanField(default=False, help_text='Visible to all students or just assigned mentees')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
