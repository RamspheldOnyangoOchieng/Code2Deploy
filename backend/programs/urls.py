from django.urls import path
from .views import ProgramListCreateView, ProgramRetrieveUpdateDestroyView, EnrollInProgramView, UserEnrollmentsViewWithFilter, UserProgramStatsView

urlpatterns = [
    path('programs/', ProgramListCreateView.as_view(), name='program-list-create'),
    path('programs/<int:pk>/', ProgramRetrieveUpdateDestroyView.as_view(), name='program-detail'),
    path('enroll/<int:program_id>/', EnrollInProgramView.as_view(), name='enroll-in-program'),
    path('user-enrollments/', UserEnrollmentsViewWithFilter.as_view(), name='user-enrollments'),
    path('user-program-stats/', UserProgramStatsView.as_view(), name='user-program-stats'),
] 