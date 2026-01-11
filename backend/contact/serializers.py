from rest_framework import serializers
from .models import ContactMessage

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = [
            'id', 'name', 'email', 'phone', 'subject', 'message', 
            'contact_type', 'status', 'created_at'
        ]
        read_only_fields = ['id', 'status', 'created_at']
