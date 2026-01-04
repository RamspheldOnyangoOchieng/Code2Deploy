from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ('id', 'unique_id', 'email', 'username', 'password', 'first_name', 'last_name', 'avatar', 'phone', 'organization', 'role')

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'unique_id', 'email', 'username', 'first_name', 'last_name',
            'avatar', 'phone', 'organization', 'role', 'date_joined', 'last_login'
        )
        read_only_fields = ('id', 'unique_id', 'role', 'date_joined', 'last_login', 'email', 'username')
    
    def to_representation(self, instance):
        """Customize output to return Cloudinary URL for avatar"""
        data = super().to_representation(instance)
        if instance.avatar:
            data['avatar'] = instance.avatar.url
        return data

class MessageSerializer(serializers.Serializer):
    detail = serializers.CharField() 