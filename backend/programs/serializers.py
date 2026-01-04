from rest_framework import serializers
from .models import Program, Enrollment

class ProgramSerializer(serializers.ModelSerializer):
    # Remove the SerializerMethodField - let ModelSerializer handle it automatically
    # CloudinaryField will be handled correctly by DRF's default field mapping
    
    class Meta:
        model = Program
        fields = '__all__'
    
    def to_representation(self, instance):
        """Customize the output representation to return Cloudinary URL"""
        data = super().to_representation(instance)
        # Convert the Cloudinary image to URL string for output
        if instance.image:
            data['image'] = instance.image.url if hasattr(instance.image, 'url') else str(instance.image)
        else:
            data['image'] = None
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