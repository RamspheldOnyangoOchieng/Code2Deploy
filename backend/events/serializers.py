from rest_framework import serializers
from .models import Event, EventRegistration

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, 'copy') else dict(data)
        if 'image' in data:
            image_value = data.get('image')
            if image_value and not isinstance(image_value, str):
                try:
                    import cloudinary.uploader
                    upload_result = cloudinary.uploader.upload(image_value)
                    image_url = upload_result.get('secure_url') or upload_result.get('url')
                    data['image'] = image_url or ''
                except Exception as e:
                    print(f"Cloudinary upload failed: {str(e)}")
                    data['image'] = ''
            elif image_value is None:
                data['image'] = ''
        return super().to_internal_value(data)
        
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