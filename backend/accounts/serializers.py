
from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.utils.translation import gettext_lazy as _
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserActivity

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """Serializer for the User model."""
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'subscription_type', 
                  'avatar', 'bio', 'interests', 'date_joined', 'is_staff']
        read_only_fields = ['id', 'date_joined', 'is_staff']
        extra_kwargs = {
            'password': {'write_only': True, 'min_length': 8}
        }

class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password', 'password_confirm']
        
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        return User.objects.create_user(**validated_data)

class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'}, trim_whitespace=False)
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(request=self.context.get('request'), username=email, password=password)
            
            if not user:
                msg = _('Unable to log in with provided credentials.')
                raise serializers.ValidationError(msg, code='authentication')
        else:
            msg = _('Must include "email" and "password".')
            raise serializers.ValidationError(msg, code='authorization')
            
        attrs['user'] = user
        return attrs

class TokenSerializer(serializers.Serializer):
    """Serializer for JWT token response."""
    
    access = serializers.CharField()
    refresh = serializers.CharField()
    user = UserSerializer()
    
    @classmethod
    def get_token(cls, user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        }

class UserActivitySerializer(serializers.ModelSerializer):
    """Serializer for user activity."""
    
    class Meta:
        model = UserActivity
        fields = ['id', 'user', 'content_id', 'content_type', 'action', 'progress', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def create(self, validated_data):
        # Get user from context if not provided
        if 'user' not in validated_data:
            validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class ProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile."""
    
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'avatar', 'bio', 'interests', 'phone_number']

class SubscriptionUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user subscription."""
    
    class Meta:
        model = User
        fields = ['subscription_type']
