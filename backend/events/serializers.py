from rest_framework import serializers
from .models import Event, EventRegistration

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

class EventRegistrationSerializer(serializers.ModelSerializer):
    event = EventSerializer(read_only=True)
    class Meta:
        model = EventRegistration
        fields = ['id', 'event', 'status', 'registered_at']

class MessageSerializer(serializers.Serializer):
    detail = serializers.CharField()

class EventStatsSerializer(serializers.Serializer):
    total = serializers.IntegerField()
    upcoming = serializers.IntegerField()
    attended = serializers.IntegerField() 