
from django.db import models

class MLModel(models.Model):
    """Model to keep track of trained ML models."""
    
    name = models.CharField(max_length=100)
    version = models.CharField(max_length=20)
    file_path = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    metrics = models.JSONField(default=dict)
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} (v{self.version})"
    
    class Meta:
        unique_together = ['name', 'version']
