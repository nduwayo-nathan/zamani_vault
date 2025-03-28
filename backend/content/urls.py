
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContentViewSet, CategoryViewSet, CommentViewSet, UserFavoriteViewSet, UserWatchlistViewSet

router = DefaultRouter()
router.register(r'content', ContentViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'favorites', UserFavoriteViewSet, basename='favorites')
router.register(r'watchlist', UserWatchlistViewSet, basename='watchlist')

urlpatterns = [
    path('', include(router.urls)),
]
