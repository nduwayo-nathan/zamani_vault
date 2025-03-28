
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class SubscriptionPlan(models.Model):
    """Model for subscription plans."""
    
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    billing_cycle = models.CharField(
        max_length=20,
        choices=[
            ('monthly', 'Monthly'),
            ('yearly', 'Yearly'),
            ('lifetime', 'Lifetime'),
        ],
        default='monthly'
    )
    features = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} ({self.billing_cycle}, ${self.price})"

class UserSubscription(models.Model):
    """Model for user subscriptions."""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='subscription_details')
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.PROTECT)
    status = models.CharField(
        max_length=20,
        choices=[
            ('active', 'Active'),
            ('canceled', 'Canceled'),
            ('expired', 'Expired'),
            ('trial', 'Trial'),
        ],
        default='active'
    )
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    auto_renew = models.BooleanField(default=True)
    payment_method = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.email} - {self.plan.name} ({self.status})"

class Transaction(models.Model):
    """Model for subscription transactions."""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    subscription = models.ForeignKey(UserSubscription, on_delete=models.SET_NULL, null=True, related_name='transactions')
    amount = models.DecimalField(max_digits=6, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('completed', 'Completed'),
            ('failed', 'Failed'),
            ('refunded', 'Refunded'),
        ],
        default='pending'
    )
    payment_method = models.CharField(max_length=100)
    transaction_id = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.email} - ${self.amount} ({self.status})"
