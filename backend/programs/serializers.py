from rest_framework import serializers
from .models import Program, Enrollment
import cloudinary.uploader

class ProgramSerializer(serializers.ModelSerializer):
    # Allow image to accept both files and URLs
    image = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    
    class Meta:
        model = Program
        fields = '__all__'
    
    def to_internal_value(self, data):
        """Handle both file uploads and URL strings for image field"""
        # Get the image from the request
        request = self.context.get('request')
        if request and hasattr(request, 'FILES') and 'image' in request.FILES:
            # File upload - will be handled in create/update
            data = data.copy() if hasattr(data, 'copy') else dict(data)
            data['image'] = None  # Temporarily set to None, handle file in create/update
        return super().to_internal_value(data)
    
    def create(self, validated_data):
        """Handle image upload during creation"""
        request = self.context.get('request')
        
        # Handle file upload
        if request and hasattr(request, 'FILES') and 'image' in request.FILES:
            image_file = request.FILES['image']
            try:
                # Upload to Cloudinary
                upload_result = cloudinary.uploader.upload(
                    image_file,
                    folder='code2deploy/programs',
                    resource_type='image'
                )
                validated_data['image'] = upload_result.get('public_id')
            except Exception as e:
                raise serializers.ValidationError({'image': f'Failed to upload image: {str(e)}'})
        elif 'image' in validated_data:
            # If it's a URL string, validate and store
            image_value = validated_data.get('image')
            if image_value and isinstance(image_value, str) and image_value.startswith(('http://', 'https://')):
                # It's a URL - try to upload it to Cloudinary
                try:
                    upload_result = cloudinary.uploader.upload(
                        image_value,
                        folder='code2deploy/programs',
                        resource_type='image'
                    )
                    validated_data['image'] = upload_result.get('public_id')
                except Exception as e:
                    # If upload fails, try to use URL directly (might work with some Cloudinary configs)
                    validated_data['image'] = image_value
            elif not image_value:
                validated_data['image'] = None
        
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        """Handle image upload during update"""
        request = self.context.get('request')
        
        # Handle file upload
        if request and hasattr(request, 'FILES') and 'image' in request.FILES:
            image_file = request.FILES['image']
            try:
                # Upload to Cloudinary
                upload_result = cloudinary.uploader.upload(
                    image_file,
                    folder='code2deploy/programs',
                    resource_type='image'
                )
                validated_data['image'] = upload_result.get('public_id')
            except Exception as e:
                raise serializers.ValidationError({'image': f'Failed to upload image: {str(e)}'})
        elif 'image' in validated_data:
            # If it's a URL string, validate and store
            image_value = validated_data.get('image')
            if image_value and isinstance(image_value, str):
                if image_value.startswith(('http://', 'https://')):
                    # It's a new URL - try to upload it to Cloudinary
                    try:
                        upload_result = cloudinary.uploader.upload(
                            image_value,
                            folder='code2deploy/programs',
                            resource_type='image'
                        )
                        validated_data['image'] = upload_result.get('public_id')
                    except Exception:
                        # Keep existing image or set new URL
                        validated_data['image'] = image_value
                elif image_value == str(instance.image) or 'programs/' in image_value:
                    # It's the same existing Cloudinary public_id, keep it
                    validated_data.pop('image', None)  # Don't change the image
            elif not image_value:
                # If explicitly set to empty, clear the image
                pass  # Keep as None/empty in validated_data
        
        return super().update(instance, validated_data)
    
    def to_representation(self, instance):
        """Customize the output representation to return Cloudinary URL"""
        data = super().to_representation(instance)
        # Convert the Cloudinary image to URL string for output
        if instance.image:
            try:
                data['image'] = instance.image.url if hasattr(instance.image, 'url') else str(instance.image)
            except Exception:
                data['image'] = None
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
 