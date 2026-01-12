from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class UserCreateSerializer(BaseUserCreateSerializer):
    re_password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ('id', 'unique_id', 'email', 'username', 'password', 're_password', 'first_name', 'last_name', 'avatar', 'phone', 'organization', 'role')
    
    def validate(self, attrs):
        re_password = attrs.pop('re_password', None)
        if attrs.get('password') != re_password:
            raise serializers.ValidationError({'re_password': 'Passwords do not match.'})
        return super().validate(attrs)

class UserProfileSerializer(serializers.ModelSerializer):
    avatar = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    
    class Meta:
        model = User
        fields = (
            'id', 'unique_id', 'email', 'username', 'first_name', 'last_name',
            'avatar', 'phone', 'organization', 'role', 'date_joined', 'last_login'
        )
        read_only_fields = ('id', 'unique_id', 'role', 'date_joined', 'last_login', 'email', 'username')
    
    def to_representation(self, instance):
        """Customize output - avatar is now a TextField (URL string)"""
        data = super().to_representation(instance)
        # avatar is already a string, no need to call .url
        return data

class MessageSerializer(serializers.Serializer):
    detail = serializers.CharField() 