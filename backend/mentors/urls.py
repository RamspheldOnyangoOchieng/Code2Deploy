from django.urls import path
from .views import (
    MentorListCreateView, MentorRetrieveUpdateDestroyView,
    MentorDashboardView, MentorProfileView,
    MentorMenteesView, MentorMenteeDetailView,
    MentorSessionsView, MentorSessionDetailView, SessionNotesView,
    MentorProgramsView,
    MentorAssignmentsView, MentorAssignmentDetailView,
    AssignmentSubmissionsView, ReviewSubmissionView, PendingReviewsView,
    MentorResourcesView, MentorResourceDetailView,
    MentorMessagesView, MentorMessageDetailView,
    MentorAvailabilityView, MentorAvailabilityDetailView,
    MentorReportsView
)

urlpatterns = [
    # Public mentor list (for admin)
    path('', MentorListCreateView.as_view(), name='mentor-list-create'),
    path('<int:pk>/', MentorRetrieveUpdateDestroyView.as_view(), name='mentor-detail'),
    
    # Mentor Dashboard APIs
    path('dashboard/', MentorDashboardView.as_view(), name='mentor-dashboard'),
    path('profile/', MentorProfileView.as_view(), name='mentor-profile'),
    
    # Mentees
    path('mentees/', MentorMenteesView.as_view(), name='mentor-mentees'),
    path('mentees/<int:pk>/', MentorMenteeDetailView.as_view(), name='mentor-mentee-detail'),
    
    # Sessions
    path('sessions/', MentorSessionsView.as_view(), name='mentor-sessions'),
    path('sessions/<int:pk>/', MentorSessionDetailView.as_view(), name='mentor-session-detail'),
    path('sessions/<int:session_id>/notes/', SessionNotesView.as_view(), name='session-notes'),
    
    # Programs
    path('programs/', MentorProgramsView.as_view(), name='mentor-programs'),
    
    # Assignments
    path('assignments/', MentorAssignmentsView.as_view(), name='mentor-assignments'),
    path('assignments/<int:pk>/', MentorAssignmentDetailView.as_view(), name='mentor-assignment-detail'),
    path('assignments/<int:assignment_id>/submissions/', AssignmentSubmissionsView.as_view(), name='assignment-submissions'),
    path('submissions/<int:submission_id>/review/', ReviewSubmissionView.as_view(), name='review-submission'),
    path('reviews/pending/', PendingReviewsView.as_view(), name='pending-reviews'),
    
    # Resources
    path('resources/', MentorResourcesView.as_view(), name='mentor-resources'),
    path('resources/<int:pk>/', MentorResourceDetailView.as_view(), name='mentor-resource-detail'),
    
    # Messages
    path('messages/', MentorMessagesView.as_view(), name='mentor-messages'),
    path('messages/<int:pk>/', MentorMessageDetailView.as_view(), name='mentor-message-detail'),
    
    # Availability/Schedule
    path('availability/', MentorAvailabilityView.as_view(), name='mentor-availability'),
    path('availability/<int:pk>/', MentorAvailabilityDetailView.as_view(), name='mentor-availability-detail'),
    
    # Reports
    path('reports/', MentorReportsView.as_view(), name='mentor-reports'),
] 