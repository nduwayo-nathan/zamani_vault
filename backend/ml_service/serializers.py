
from rest_framework import serializers
from .models import MLModel

class MLModelSerializer(serializers.ModelSerializer):
    """Serializer for MLModel."""
    
    class Meta:
        model = MLModel
        fields = ['id', 'name', 'version', 'description', 'metrics', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']

class RecommendationSerializer(serializers.Serializer):
    """Serializer for content recommendations."""
    
    content_id = serializers.CharField()
    score = serializers.FloatField()
    reason = serializers.CharField()

class UserInsightSerializer(serializers.Serializer):
    """Serializer for user insights."""
    
    category = serializers.CharField()
    interest = serializers.IntegerField()
    trend = serializers.ChoiceField(choices=['increasing', 'decreasing', 'stable'])

class ContentTrendSerializer(serializers.Serializer):
    """Serializer for content trends."""
    
    category = serializers.CharField()
    view_count = serializers.IntegerField()
    growth_rate = serializers.FloatField()
    popularity = serializers.IntegerField()

class UserSegmentSerializer(serializers.Serializer):
    """Serializer for user segments."""
    
    id = serializers.CharField()
    name = serializers.CharField()
    size = serializers.IntegerField()
    top_interests = serializers.ListField(child=serializers.CharField())
    avg_session_duration = serializers.FloatField()

class ContentPerformancePredictionSerializer(serializers.Serializer):
    """Serializer for content performance prediction."""
    
    estimated_views = serializers.IntegerField()
    target_audience = serializers.ListField(child=serializers.CharField())
    engagement_score = serializers.IntegerField()
