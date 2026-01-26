from rest_framework import serializers
from .models import Program, Enrollment
import cloudinary.uploader

class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = '__all__'
    
    def to_internal_value(self, data):
        """Convert image field to proper string (URL) before validation"""
        # Create a mutable copy of data safely
        if hasattr(data, 'dict'):
            data = data.dict()
        elif hasattr(data, 'copy'):
            data = data.copy()
        else:
            data = dict(data)

        if 'image' in data:
            image_value = data.get('image')
            if image_value and not isinstance(image_value, str):
                try:
                    import cloudinary.uploader
                    upload_result = cloudinary.uploader.upload(
                        image_value,
                        folder="Code2Deploy/programs"
                    )
                    image_url = upload_result.get('secure_url') or upload_result.get('url')
                    if image_url:
                        data['image'] = image_url
                except Exception as e:
                    print(f"Cloudinary upload failed: {str(e)}")
                    if 'image' in data:
                        del data['image']
            
            # If it's None or empty string, ensure it's a blank string for TextField
            elif image_value is None:
                data['image'] = ''
                
        return super().to_internal_value(data)
    
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
        
        # If image is not in validated_data, keep existing value
        if 'image' in validated_data:
            image_value = validated_data.get('image', '')
            if image_value and isinstance(image_value, str):
                validated_data['image'] = image_value
            elif not image_value:
                # Keep existing image if new value is empty
                validated_data.pop('image', None)
        
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
        fields = ['id', 'program', 'status', 'payment_status', 'amount_paid', 'progress', 'enrolled_at']

class MessageSerializer(serializers.Serializer):
    detail = serializers.CharField()

class ProgramStatsSerializer(serializers.Serializer):
    total = serializers.IntegerField()
    ongoing = serializers.IntegerField()
    completed = serializers.IntegerField()
 