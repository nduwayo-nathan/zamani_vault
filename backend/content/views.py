
from rest_framework import viewsets, permissions, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q
from .models import Content, Category, UserFavorite, UserWatchlist, Comment
from .serializers import (
    ContentSerializer, ContentDetailSerializer, ContentCreateUpdateSerializer,
    CategorySerializer, CommentSerializer, UserFavoriteSerializer, UserWatchlistSerializer
)
from accounts.models import UserActivity

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admins to edit objects.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

class ContentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing Content objects.
    """
    queryset = Content.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'tags', 'creator', 'region']
    ordering_fields = ['created_at', 'updated_at', 'title', 'view_count']
    
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_serializer_class(self):
        """
        Return appropriate serializer class based on the action.
        """
        if self.action == 'retrieve':
            return ContentDetailSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ContentCreateUpdateSerializer
        return ContentSerializer
    
    def retrieve(self, request, *args, **kwargs):
        """
        Increment view count when content is retrieved.
        """
        instance = self.get_object()
        instance.view_count += 1
        instance.save()
        
        # Log user activity
        if request.user.is_authenticated:
            UserActivity.objects.create(
                user=request.user,
                content_id=str(instance.id),
                content_type=instance.content_type,
                action='view'
            )
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """
        Return featured content.
        """
        queryset = self.queryset.filter(is_featured=True)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """
        Filter content by type.
        """
        content_type = request.query_params.get('type')
        if content_type:
            queryset = self.queryset.filter(content_type=content_type)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        return Response({"error": "Type parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """
        Filter content by category.
        """
        category_id = request.query_params.get('category_id')
        if category_id:
            queryset = Content.objects.filter(content_categories__category_id=category_id)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        return Response({"error": "Category ID is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """
        Search content.
        """
        query = request.query_params.get('q', '')
        if query:
            queryset = self.queryset.filter(
                Q(title__icontains=query) | 
                Q(description__icontains=query) |
                Q(tags__icontains=query) |
                Q(creator__icontains=query) |
                Q(region__icontains=query)
            )
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        return Response({"error": "Query parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing Category objects.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]

class CommentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing Comment objects.
    """
    queryset = Comment.objects.filter(parent=None)
    serializer_class = CommentSerializer
    
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def reply(self, request, pk=None):
        """
        Add a reply to a comment.
        """
        parent_comment = self.get_object()
        content_id = parent_comment.content.id
        
        serializer = self.get_serializer(data={
            'content': content_id,
            'text': request.data.get('text'),
            'parent': parent_comment.id
        })
        
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserFavoriteViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing user favorites.
    """
    serializer_class = UserFavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserFavorite.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def toggle(self, request):
        """
        Toggle favorite status for a content.
        """
        content_id = request.data.get('content_id')
        if not content_id:
            return Response({"error": "Content ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            content = Content.objects.get(id=content_id)
        except Content.DoesNotExist:
            return Response({"error": "Content not found"}, status=status.HTTP_404_NOT_FOUND)
        
        favorite, created = UserFavorite.objects.get_or_create(
            user=request.user,
            content=content
        )
        
        if not created:
            favorite.delete()
            return Response({"status": "removed"}, status=status.HTTP_200_OK)
        
        return Response({"status": "added"}, status=status.HTTP_201_CREATED)

class UserWatchlistViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing user watchlist.
    """
    serializer_class = UserWatchlistSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserWatchlist.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def toggle(self, request):
        """
        Toggle watchlist status for a content.
        """
        content_id = request.data.get('content_id')
        if not content_id:
            return Response({"error": "Content ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            content = Content.objects.get(id=content_id)
        except Content.DoesNotExist:
            return Response({"error": "Content not found"}, status=status.HTTP_404_NOT_FOUND)
        
        watchlist, created = UserWatchlist.objects.get_or_create(
            user=request.user,
            content=content
        )
        
        if not created:
            watchlist.delete()
            return Response({"status": "removed"}, status=status.HTTP_200_OK)
        
        return Response({"status": "added"}, status=status.HTTP_201_CREATED)
