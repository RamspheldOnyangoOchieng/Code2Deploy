from rest_framework import serializers
from .models import Program, Enrollment
import cloudinary.uploader

class ProgramSerializer(serializers.ModelSerializer):
    # Allow image to accept both files and URLs as text
    image = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    
    class Meta:
        model = Program
        fields = '__all__'
    
    def create(self, validated_data):
        """Handle image during creation"""
        request = self.context.get('request')
        
        # Handle file upload - for now just store empty, would need external upload service
        if request and hasattr(request, 'FILES') and 'image' in request.FILES:
            # File uploads would need a separate handling mechanism
            # For now, just leave image as-is (empty or URL from validated_data)
            pass
        
        # If it's a URL string, just store it directly
        image_value = validated_data.get('image', '')
        if image_value and isinstance(image_value, str) and image_value.startswith(('http://', 'https://')):
            validated_data['image'] = image_value
        elif not image_value:
            validated_data['image'] = ''
        
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        """Handle image during update"""
        request = self.context.get('request')
        
        # Handle file upload - for now just store empty
        if request and hasattr(request, 'FILES') and 'image' in request.FILES:
            # File uploads would need a separate handling mechanism
            pass
        
        # If it's a URL string, just store it directly
        if 'image' in validated_data:
            image_value = validated_data.get('image', '')
            if image_value and isinstance(image_value, str):
                validated_data['image'] = image_value
            elif not image_value:
                validated_data['image'] = ''
        
        return super().update(instance, validated_data)
    
    def to_representation(self, instance):
        """Customize the output representation"""
        data = super().to_representation(instance)
        # image is now a TextField (URL string), so just include it as-is
        return data

class EnrollmentSerializer(serializers.ModelSerializer):
    program = ProgramSerializer(read_only=True)
    class Meta:
        model = Enrollment
        fields = ['id', 'program', 'status', 'progress', 'enrolled_at']

class MessageSerializer(serializers.Serializer):
    detail = serializers.CharField()

class ProgramStatsSerializer(serializers.Serializer):
    total = serializers.IntegerField()
    ongoing = serializers.IntegerField()
    completed = serializers.IntegerField()
 