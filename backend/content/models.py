
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Content(models.Model):
    """Model for historical content (videos, books, articles, artifacts)."""
    
    CONTENT_TYPES = [
        ('video', 'Video'),
        ('book', 'Book'),
        ('article', 'Article'),
        ('artifact', 'Artifact'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPES)
    image = models.ImageField(upload_to='content_images/')
    file = models.FileField(upload_to='content_files/', null=True, blank=True)
    url = models.URLField(null=True, blank=True)
    is_premium = models.BooleanField(default=False)
    duration = models.CharField(max_length=50, null=True, blank=True)  # For videos/books
    tags = models.JSONField(default=list)
    creator = models.CharField(max_length=255, blank=True)
    year = models.IntegerField(null=True, blank=True)
    region = models.CharField(max_length=100, blank=True)
    language = models.CharField(max_length=50, blank=True)
    view_count = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-created_at']
        
class Category(models.Model):
    """Model for content categories."""
    
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='category_images/', null=True, blank=True)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='children')
    order = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['order', 'name']

class ContentCategory(models.Model):
    """Model for many-to-many relationship between content and categories."""
    
    content = models.ForeignKey(Content, on_delete=models.CASCADE, related_name='content_categories')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='category_contents')
    
    class Meta:
        unique_together = ('content', 'category')

class UserFavorite(models.Model):
    """Model for user favorites."""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    content = models.ForeignKey(Content, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'content')

class UserWatchlist(models.Model):
    """Model for user watchlist."""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='watchlist')
    content = models.ForeignKey(Content, on_delete=models.CASCADE, related_name='in_watchlists')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'content')

class Comment(models.Model):
    """Model for content comments."""
    
    content = models.ForeignKey(Content, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Comment by {self.user.email} on {self.content.title}"
    
    class Meta:
        ordering = ['-created_at']
