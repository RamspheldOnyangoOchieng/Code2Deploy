from django.urls import path
from .views import EventListCreateView, EventRetrieveUpdateDestroyView, RegisterForEventView, UserEventRegistrationsViewWithFilter, UserEventStatsView

urlpatterns = [
    path('events/', EventListCreateView.as_view(), name='event-list-create'),
    path('events/<int:pk>/', EventRetrieveUpdateDestroyView.as_view(), name='event-detail'),
    path('register/<int:event_id>/', RegisterForEventView.as_view(), name='register-for-event'),
    path('user-registrations/', UserEventRegistrationsViewWithFilter.as_view(), name='user-event-registrations'),
    path('user-event-stats/', UserEventStatsView.as_view(), name='user-event-stats'),
] 