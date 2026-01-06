from django.shortcuts import render
from django.utils import timezone
from django.db.models import Count, Q
from rest_framework import generics, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from .models import (
    Mentor, MentorProgram, MentorMentee, MentorSession,
    SessionAttendee, SessionNote, MentorAvailability,
    MentorMessage, Assignment, AssignmentSubmission, MentorResource
)
from .serializers import (
    MentorSerializer, MentorProgramSerializer, MentorMenteeSerializer,
    MentorSessionSerializer, SessionAttendeeSerializer, SessionNoteSerializer,
    MentorAvailabilitySerializer, MentorMessageSerializer,
    AssignmentSerializer, AssignmentSubmissionSerializer, MentorResourceSerializer,
    MentorDashboardSerializer
)


class MentorListCreateView(generics.ListCreateAPIView):
    queryset = Mentor.objects.all().order_by('-created_at')
    serializer_class = MentorSerializer


class MentorRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Mentor.objects.all()
    serializer_class = MentorSerializer


# ============== MENTOR DASHBOARD VIEWS ==============

class MentorDashboardView(APIView):
    """Get mentor's dashboard overview data"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            mentor = Mentor.objects.get(user=request.user)
        except Mentor.DoesNotExist:
            return Response({'error': 'Mentor profile not found'}, status=status.HTTP_404_NOT_FOUND)
        
        now = timezone.now()
        
        # Get stats
        total_mentees = MentorMentee.objects.filter(mentor=mentor, is_active=True).count()
        total_sessions = MentorSession.objects.filter(mentor=mentor).count()
        upcoming_sessions = MentorSession.objects.filter(
            mentor=mentor, 
            scheduled_at__gte=now,
            status='scheduled'
        ).count()
        completed_sessions = MentorSession.objects.filter(mentor=mentor, status='completed').count()
        total_programs = MentorProgram.objects.filter(mentor=mentor, is_active=True).count()
        
        # Pending assignment reviews
        pending_reviews = AssignmentSubmission.objects.filter(
            assignment__mentor=mentor,
            status='submitted'
        ).count()
        total_assignments = Assignment.objects.filter(mentor=mentor).count()
        
        # Unread messages
        unread_messages = MentorMessage.objects.filter(
            recipient=request.user,
            is_read=False
        ).count()
        
        # Recent data
        recent_sessions = MentorSession.objects.filter(
            mentor=mentor,
            scheduled_at__gte=now
        ).order_by('scheduled_at')[:5]
        
        recent_submissions = AssignmentSubmission.objects.filter(
            assignment__mentor=mentor,
            status='submitted'
        ).order_by('-submitted_at')[:5]
        
        data = {
            'total_mentees': total_mentees,
            'total_sessions': total_sessions,
            'upcoming_sessions': upcoming_sessions,
            'completed_sessions': completed_sessions,
            'total_programs': total_programs,
            'pending_reviews': pending_reviews,
            'total_assignments': total_assignments,
            'unread_messages': unread_messages,
            'recent_sessions': MentorSessionSerializer(recent_sessions, many=True).data,
            'recent_submissions': AssignmentSubmissionSerializer(recent_submissions, many=True).data,
        }
        
        return Response(data)


class MentorProfileView(APIView):
    """Get/Update mentor's own profile"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            mentor = Mentor.objects.get(user=request.user)
            serializer = MentorSerializer(mentor)
            return Response(serializer.data)
        except Mentor.DoesNotExist:
            return Response({'error': 'Mentor profile not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def patch(self, request):
        try:
            mentor = Mentor.objects.get(user=request.user)
            serializer = MentorSerializer(mentor, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Mentor.DoesNotExist:
            return Response({'error': 'Mentor profile not found'}, status=status.HTTP_404_NOT_FOUND)


# ============== MENTEES ==============

class MentorMenteesView(generics.ListAPIView):
    """Get mentor's assigned mentees"""
    serializer_class = MentorMenteeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            mentor = Mentor.objects.get(user=self.request.user)
            return MentorMentee.objects.filter(mentor=mentor).select_related('mentee', 'program')
        except Mentor.DoesNotExist:
            return MentorMentee.objects.none()


class MentorMenteeDetailView(generics.RetrieveUpdateAPIView):
    """Get/Update specific mentee relationship"""
    serializer_class = MentorMenteeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            mentor = Mentor.objects.get(user=self.request.user)
            return MentorMentee.objects.filter(mentor=mentor)
        except Mentor.DoesNotExist:
            return MentorMentee.objects.none()


# ============== SESSIONS ==============

class MentorSessionsView(generics.ListCreateAPIView):
    """List/Create mentor sessions"""
    serializer_class = MentorSessionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            mentor = Mentor.objects.get(user=self.request.user)
            queryset = MentorSession.objects.filter(mentor=mentor)
            
            # Filter by status
            status_filter = self.request.query_params.get('status')
            if status_filter:
                queryset = queryset.filter(status=status_filter)
            
            # Filter by upcoming/past
            time_filter = self.request.query_params.get('time')
            if time_filter == 'upcoming':
                queryset = queryset.filter(scheduled_at__gte=timezone.now())
            elif time_filter == 'past':
                queryset = queryset.filter(scheduled_at__lt=timezone.now())
            
            return queryset.select_related('program')
        except Mentor.DoesNotExist:
            return MentorSession.objects.none()
    
    def perform_create(self, serializer):
        mentor = Mentor.objects.get(user=self.request.user)
        serializer.save(mentor=mentor)


class MentorSessionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get/Update/Delete specific session"""
    serializer_class = MentorSessionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            mentor = Mentor.objects.get(user=self.request.user)
            return MentorSession.objects.filter(mentor=mentor)
        except Mentor.DoesNotExist:
            return MentorSession.objects.none()


class SessionNotesView(generics.ListCreateAPIView):
    """List/Create session notes"""
    serializer_class = SessionNoteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        session_id = self.kwargs.get('session_id')
        return SessionNote.objects.filter(session_id=session_id)
    
    def perform_create(self, serializer):
        mentor = Mentor.objects.get(user=self.request.user)
        session = MentorSession.objects.get(id=self.kwargs.get('session_id'))
        serializer.save(mentor=mentor, session=session)


# ============== PROGRAMS ==============

class MentorProgramsView(generics.ListAPIView):
    """Get programs assigned to mentor"""
    serializer_class = MentorProgramSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            mentor = Mentor.objects.get(user=self.request.user)
            return MentorProgram.objects.filter(mentor=mentor, is_active=True).select_related('program')
        except Mentor.DoesNotExist:
            return MentorProgram.objects.none()


# ============== ASSIGNMENTS ==============

class MentorAssignmentsView(generics.ListCreateAPIView):
    """List/Create assignments"""
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            mentor = Mentor.objects.get(user=self.request.user)
            return Assignment.objects.filter(mentor=mentor).select_related('program')
        except Mentor.DoesNotExist:
            return Assignment.objects.none()
    
    def perform_create(self, serializer):
        mentor = Mentor.objects.get(user=self.request.user)
        serializer.save(mentor=mentor)


class MentorAssignmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get/Update/Delete specific assignment"""
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            mentor = Mentor.objects.get(user=self.request.user)
            return Assignment.objects.filter(mentor=mentor)
        except Mentor.DoesNotExist:
            return Assignment.objects.none()


class AssignmentSubmissionsView(generics.ListAPIView):
    """List submissions for an assignment"""
    serializer_class = AssignmentSubmissionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        assignment_id = self.kwargs.get('assignment_id')
        return AssignmentSubmission.objects.filter(assignment_id=assignment_id).select_related('student')


class ReviewSubmissionView(APIView):
    """Review a student submission"""
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, submission_id):
        try:
            mentor = Mentor.objects.get(user=request.user)
            submission = AssignmentSubmission.objects.get(id=submission_id, assignment__mentor=mentor)
            
            submission.status = request.data.get('status', submission.status)
            submission.score = request.data.get('score', submission.score)
            submission.feedback = request.data.get('feedback', submission.feedback)
            submission.reviewed_by = mentor
            submission.reviewed_at = timezone.now()
            submission.save()
            
            serializer = AssignmentSubmissionSerializer(submission)
            return Response(serializer.data)
        except Mentor.DoesNotExist:
            return Response({'error': 'Mentor profile not found'}, status=status.HTTP_404_NOT_FOUND)
        except AssignmentSubmission.DoesNotExist:
            return Response({'error': 'Submission not found'}, status=status.HTTP_404_NOT_FOUND)


class PendingReviewsView(generics.ListAPIView):
    """List all pending submissions for review"""
    serializer_class = AssignmentSubmissionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            mentor = Mentor.objects.get(user=self.request.user)
            return AssignmentSubmission.objects.filter(
                assignment__mentor=mentor,
                status='submitted'
            ).select_related('student', 'assignment').order_by('-submitted_at')
        except Mentor.DoesNotExist:
            return AssignmentSubmission.objects.none()


# ============== RESOURCES ==============

class MentorResourcesView(generics.ListCreateAPIView):
    """List/Create mentor resources"""
    serializer_class = MentorResourceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            mentor = Mentor.objects.get(user=self.request.user)
            return MentorResource.objects.filter(mentor=mentor)
        except Mentor.DoesNotExist:
            return MentorResource.objects.none()
    
    def perform_create(self, serializer):
        mentor = Mentor.objects.get(user=self.request.user)
        serializer.save(mentor=mentor)


class MentorResourceDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get/Update/Delete specific resource"""
    serializer_class = MentorResourceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            mentor = Mentor.objects.get(user=self.request.user)
            return MentorResource.objects.filter(mentor=mentor)
        except Mentor.DoesNotExist:
            return MentorResource.objects.none()


# ============== MESSAGES ==============

class MentorMessagesView(generics.ListCreateAPIView):
    """List/Create messages"""
    serializer_class = MentorMessageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        filter_type = self.request.query_params.get('type', 'all')
        
        if filter_type == 'sent':
            return MentorMessage.objects.filter(sender=user)
        elif filter_type == 'received':
            return MentorMessage.objects.filter(recipient=user)
        else:
            return MentorMessage.objects.filter(Q(sender=user) | Q(recipient=user))
    
    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


class MentorMessageDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get/Update/Delete specific message"""
    serializer_class = MentorMessageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return MentorMessage.objects.filter(Q(sender=user) | Q(recipient=user))
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Mark as read if recipient is viewing
        if instance.recipient == request.user and not instance.is_read:
            instance.is_read = True
            instance.read_at = timezone.now()
            instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


# ============== AVAILABILITY/SCHEDULE ==============

class MentorAvailabilityView(generics.ListCreateAPIView):
    """List/Create availability slots"""
    serializer_class = MentorAvailabilitySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            mentor = Mentor.objects.get(user=self.request.user)
            return MentorAvailability.objects.filter(mentor=mentor)
        except Mentor.DoesNotExist:
            return MentorAvailability.objects.none()
    
    def perform_create(self, serializer):
        mentor = Mentor.objects.get(user=self.request.user)
        serializer.save(mentor=mentor)


class MentorAvailabilityDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get/Update/Delete specific availability slot"""
    serializer_class = MentorAvailabilitySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            mentor = Mentor.objects.get(user=self.request.user)
            return MentorAvailability.objects.filter(mentor=mentor)
        except Mentor.DoesNotExist:
            return MentorAvailability.objects.none()


# ============== REPORTS ==============

class MentorReportsView(APIView):
    """Get mentor performance reports"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            mentor = Mentor.objects.get(user=request.user)
        except Mentor.DoesNotExist:
            return Response({'error': 'Mentor profile not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Session stats
        sessions = MentorSession.objects.filter(mentor=mentor)
        total_sessions = sessions.count()
        completed_sessions = sessions.filter(status='completed').count()
        cancelled_sessions = sessions.filter(status='cancelled').count()
        
        # Calculate average rating from session feedback
        avg_rating = SessionAttendee.objects.filter(
            session__mentor=mentor,
            rating__isnull=False
        ).aggregate(avg=models.Avg('rating'))['avg'] or 0
        
        # Assignment stats
        assignments = Assignment.objects.filter(mentor=mentor)
        total_assignments = assignments.count()
        submissions = AssignmentSubmission.objects.filter(assignment__mentor=mentor)
        total_submissions = submissions.count()
        reviewed_submissions = submissions.filter(status__in=['reviewed', 'approved', 'needs_revision']).count()
        avg_score = submissions.filter(score__isnull=False).aggregate(avg=models.Avg('score'))['avg'] or 0
        
        # Mentee stats
        total_mentees = MentorMentee.objects.filter(mentor=mentor, is_active=True).count()
        
        # Monthly breakdown (last 6 months)
        from datetime import timedelta
        six_months_ago = timezone.now() - timedelta(days=180)
        monthly_sessions = sessions.filter(scheduled_at__gte=six_months_ago).extra(
            select={'month': "DATE_TRUNC('month', scheduled_at)"}
        ).values('month').annotate(count=Count('id')).order_by('month')
        
        data = {
            'session_stats': {
                'total': total_sessions,
                'completed': completed_sessions,
                'cancelled': cancelled_sessions,
                'completion_rate': (completed_sessions / total_sessions * 100) if total_sessions > 0 else 0,
                'average_rating': round(avg_rating, 2),
            },
            'assignment_stats': {
                'total_assignments': total_assignments,
                'total_submissions': total_submissions,
                'reviewed_submissions': reviewed_submissions,
                'average_score': round(avg_score, 2),
            },
            'mentee_stats': {
                'total_mentees': total_mentees,
            },
            'monthly_sessions': list(monthly_sessions),
        }
        
        return Response(data)
