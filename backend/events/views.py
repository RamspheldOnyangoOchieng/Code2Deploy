from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Event, EventRegistration
from .serializers import EventSerializer, EventRegistrationSerializer, MessageSerializer, EventStatsSerializer

# Create your views here.

from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all().order_by('-date')
    serializer_class = EventSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)

class EventRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)

class RegisterForEventView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer
    def post(self, request, event_id):
        user = request.user
        try:
            event = Event.objects.get(pk=event_id)
        except Event.DoesNotExist:
            return Response({'detail': 'Event not found.'}, status=status.HTTP_404_NOT_FOUND)
        registration, created = EventRegistration.objects.get_or_create(user=user, event=event)
        if not created:
            return Response({'detail': 'Already registered.'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = EventRegistrationSerializer(registration)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

from users.views import UserEventRegistrationsView
class UserEventRegistrationsViewWithFilter(UserEventRegistrationsView):
    def get_queryset(self):
        qs = super().get_queryset()
        status_param = self.request.query_params.get('status')
        if status_param:
            qs = qs.filter(status=status_param)
        return qs

class UserEventStatsView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = EventStatsSerializer
    def get(self, request):
        user = request.user
        total = EventRegistration.objects.filter(user=user).count()
        upcoming = EventRegistration.objects.filter(user=user, status='upcoming').count()
        attended = EventRegistration.objects.filter(user=user, status='attended').count()
        return Response({'total': total, 'upcoming': upcoming, 'attended': attended})
