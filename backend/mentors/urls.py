from django.urls import path
from .views import MentorListCreateView, MentorRetrieveUpdateDestroyView

urlpatterns = [
    path('mentors/', MentorListCreateView.as_view(), name='mentor-list-create'),
    path('mentors/<int:pk>/', MentorRetrieveUpdateDestroyView.as_view(), name='mentor-detail'),
] 