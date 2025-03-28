
from rest_framework import status, permissions, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import get_user_model
from .serializers import (
    MLModelSerializer, RecommendationSerializer, UserInsightSerializer,
    ContentTrendSerializer, UserSegmentSerializer, ContentPerformancePredictionSerializer
)
from .models import MLModel
from .ml_utils import (
    get_content_recommendations, get_user_insights, get_content_trends,
    get_user_segments, predict_content_performance, load_model
)
from accounts.models import UserActivity
from content.models import Content

User = get_user_model()

class MLModelViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing ML models.
    """
    queryset = MLModel.objects.all()
    serializer_class = MLModelSerializer
    permission_classes = [permissions.IsAdminUser]
    
    @api_view(['POST'])
    @permission_classes([permissions.IsAdminUser])
    def set_active(self, request, pk=None):
        """
        Set a model as the active one.
        """
        try:
            model = MLModel.objects.get(pk=pk)
        except MLModel.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        # Set all models as inactive
        MLModel.objects.all().update(is_active=False)
        
        # Set this model as active
        model.is_active = True
        model.save()
        
        return Response(status=status.HTTP_200_OK)

class UserRecommendationsView(APIView):
    """
    API View for getting content recommendations for a user.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, user_id=None):
        """
        Get recommendations for a user.
        If user_id is provided and the requester is an admin, get recommendations for that user.
        Otherwise, get recommendations for the authenticated user.
        """
        target_user_id = user_id if user_id and request.user.is_staff else request.user.id
        
        # Get content and activity data
        contents = Content.objects.all().values()
        activities = UserActivity.objects.all().values()
        
        recommendations = get_content_recommendations(target_user_id, contents, activities)
        serializer = RecommendationSerializer(recommendations, many=True)
        
        return Response(serializer.data)

class UserInsightsView(APIView):
    """
    API View for getting insights about a user's interests.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, user_id=None):
        """
        Get insights for a user.
        If user_id is provided and the requester is an admin, get insights for that user.
        Otherwise, get insights for the authenticated user.
        """
        target_user_id = user_id if user_id and request.user.is_staff else request.user.id
        
        # Get content and activity data
        contents = Content.objects.all().values()
        activities = UserActivity.objects.all().values()
        
        insights = get_user_insights(target_user_id, activities, contents)
        serializer = UserInsightSerializer(insights, many=True)
        
        return Response(serializer.data)

class ContentTrendsView(APIView):
    """
    API View for getting content trends.
    """
    permission_classes = [permissions.IsAdminUser]
    
    def get(self, request):
        """
        Get content viewing trends.
        """
        period = request.query_params.get('period', 'month')
        
        # Get content and activity data
        contents = Content.objects.all().values()
        activities = UserActivity.objects.all().values()
        
        trends = get_content_trends(contents, activities, period)
        serializer = ContentTrendSerializer(trends, many=True)
        
        return Response(serializer.data)

class UserSegmentsView(APIView):
    """
    API View for getting user segments.
    """
    permission_classes = [permissions.IsAdminUser]
    
    def get(self, request):
        """
        Get user segments.
        """
        # Get user, content, and activity data
        users = User.objects.all().values()
        contents = Content.objects.all().values()
        activities = UserActivity.objects.all().values()
        
        segments = get_user_segments(users, activities, contents)
        serializer = UserSegmentSerializer(segments, many=True)
        
        return Response(serializer.data)

class ContentPerformancePredictionView(APIView):
    """
    API View for predicting content performance.
    """
    permission_classes = [permissions.IsAdminUser]
    
    def post(self, request):
        """
        Predict performance for a new piece of content.
        """
        content_data = request.data
        
        prediction = predict_content_performance(content_data)
        serializer = ContentPerformancePredictionSerializer(prediction)
        
        return Response(serializer.data)
