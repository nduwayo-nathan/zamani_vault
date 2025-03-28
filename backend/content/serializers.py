
from rest_framework import serializers
from .models import Content, Category, ContentCategory, UserFavorite, UserWatchlist, Comment

class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model."""
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'image', 'parent', 'order']

class ContentSerializer(serializers.ModelSerializer):
    """Serializer for Content model."""
    
    categories = serializers.SerializerMethodField()
    is_favorited = serializers.SerializerMethodField()
    is_in_watchlist = serializers.SerializerMethodField()
    
    class Meta:
        model = Content
        fields = [
            'id', 'title', 'description', 'content_type', 'image', 'file', 'url',
            'is_premium', 'duration', 'tags', 'creator', 'year', 'region', 'language',
            'view_count', 'is_featured', 'created_at', 'updated_at', 'categories',
            'is_favorited', 'is_in_watchlist'
        ]
        read_only_fields = ['view_count', 'created_at', 'updated_at']
    
    def get_categories(self, obj):
        category_relations = ContentCategory.objects.filter(content=obj)
        categories = [relation.category for relation in category_relations]
        return CategorySerializer(categories, many=True).data
    
    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            return UserFavorite.objects.filter(user=request.user, content=obj).exists()
        return False
    
    def get_is_in_watchlist(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            return UserWatchlist.objects.filter(user=request.user, content=obj).exists()
        return False

class ContentDetailSerializer(ContentSerializer):
    """Detailed serializer for Content model."""
    
    comments = serializers.SerializerMethodField()
    
    class Meta(ContentSerializer.Meta):
        fields = ContentSerializer.Meta.fields + ['comments']
    
    def get_comments(self, obj):
        comments = Comment.objects.filter(content=obj, parent=None)
        return CommentSerializer(comments, many=True, context=self.context).data

class ContentCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating Content."""
    
    categories = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        write_only=True
    )
    
    class Meta:
        model = Content
        fields = [
            'title', 'description', 'content_type', 'image', 'file', 'url',
            'is_premium', 'duration', 'tags', 'creator', 'year', 'region', 'language',
            'is_featured', 'categories'
        ]
    
    def create(self, validated_data):
        categories = validated_data.pop('categories', [])
        content = Content.objects.create(**validated_data)
        
        # Add categories
        for category_id in categories:
            try:
                category = Category.objects.get(id=category_id)
                ContentCategory.objects.create(content=content, category=category)
            except Category.DoesNotExist:
                pass
        
        return content
    
    def update(self, instance, validated_data):
        categories = validated_data.pop('categories', None)
        
        # Update content fields
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        
        # Update categories if provided
        if categories is not None:
            ContentCategory.objects.filter(content=instance).delete()
            for category_id in categories:
                try:
                    category = Category.objects.get(id=category_id)
                    ContentCategory.objects.create(content=instance, category=category)
                except Category.DoesNotExist:
                    pass
        
        return instance

class CommentSerializer(serializers.ModelSerializer):
    """Serializer for Comment model."""
    
    user_name = serializers.SerializerMethodField()
    user_avatar = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = ['id', 'content', 'user', 'user_name', 'user_avatar', 'text', 'created_at', 'updated_at', 'replies']
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def get_user_name(self, obj):
        if obj.user.first_name and obj.user.last_name:
            return f"{obj.user.first_name} {obj.user.last_name}"
        return obj.user.email
    
    def get_user_avatar(self, obj):
        if obj.user.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.user.avatar.url)
        return None
    
    def get_replies(self, obj):
        replies = Comment.objects.filter(parent=obj)
        return CommentSerializer(replies, many=True, context=self.context).data
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class UserFavoriteSerializer(serializers.ModelSerializer):
    """Serializer for UserFavorite model."""
    
    content_details = serializers.SerializerMethodField()
    
    class Meta:
        model = UserFavorite
        fields = ['id', 'user', 'content', 'created_at', 'content_details']
        read_only_fields = ['user', 'created_at']
    
    def get_content_details(self, obj):
        return ContentSerializer(obj.content, context=self.context).data
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class UserWatchlistSerializer(serializers.ModelSerializer):
    """Serializer for UserWatchlist model."""
    
    content_details = serializers.SerializerMethodField()
    
    class Meta:
        model = UserWatchlist
        fields = ['id', 'user', 'content', 'created_at', 'content_details']
        read_only_fields = ['user', 'created_at']
    
    def get_content_details(self, obj):
        return ContentSerializer(obj.content, context=self.context).data
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
