from rest_framework import serializers
from .models import Event, EventRegistration

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'
        
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # image is now a TextField (URL string), so just include it as-is
        return data

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