
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    """Define a model manager for User model with no username field."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError('The email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)

class User(AbstractUser):
    """Custom user model that uses email instead of username."""

    username = None
    email = models.EmailField(_('email address'), unique=True)
    subscription_type = models.CharField(
        max_length=20, 
        choices=[
            ('free', 'Free'),
            ('premium', 'Premium'),
            ('scholar', 'Scholar'),
        ],
        default='free'
    )
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(blank=True)
    interests = models.JSONField(default=list, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email

class UserActivity(models.Model):
    """Model to track user activity for ML recommendations."""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    content_id = models.CharField(max_length=50)
    content_type = models.CharField(max_length=20)
    action = models.CharField(
        max_length=20,
        choices=[
            ('view', 'View'),
            ('like', 'Like'),
            ('bookmark', 'Bookmark'),
            ('share', 'Share'),
            ('complete', 'Complete'),
        ]
    )
    progress = models.FloatField(default=0)  # For videos/books, percentage completed
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = 'User Activities'
        ordering = ['-created_at']
