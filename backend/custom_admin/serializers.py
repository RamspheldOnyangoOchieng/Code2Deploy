from rest_framework import serializers
from .models import ContactPageSettings, SiteSettings


class ContactPageSettingsSerializer(serializers.ModelSerializer):
    contact_type_display = serializers.CharField(source='get_contact_type_display', read_only=True)
    
    class Meta:
        model = ContactPageSettings
        fields = [
            'id', 
            'contact_type', 
            'contact_type_display',
            'title', 
            'subtitle', 
            'description', 
            'default_subject',
            'default_message',
            'button_text',
            'is_active',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'contact_type_display']


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']
