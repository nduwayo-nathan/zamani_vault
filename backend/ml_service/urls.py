
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MLModelViewSet, UserRecommendationsView, UserInsightsView,
    ContentTrendsView, UserSegmentsView, ContentPerformancePredictionView
)

router = DefaultRouter()
router.register(r'models', MLModelViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('recommendations/<int:user_id>/', UserRecommendationsView.as_view(), name='user-recommendations'),
    path('recommendations/', UserRecommendationsView.as_view(), name='self-recommendations'),
    path('insights/<int:user_id>/', UserInsightsView.as_view(), name='user-insights'),
    path('insights/', UserInsightsView.as_view(), name='self-insights'),
    path('trends/', ContentTrendsView.as_view(), name='content-trends'),
    path('segments/', UserSegmentsView.as_view(), name='user-segments'),
    path('predict/', ContentPerformancePredictionView.as_view(), name='predict-performance'),
]
