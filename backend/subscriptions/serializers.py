
from rest_framework import serializers
from .models import SubscriptionPlan, UserSubscription, Transaction

class SubscriptionPlanSerializer(serializers.ModelSerializer):
    """Serializer for SubscriptionPlan model."""
    
    class Meta:
        model = SubscriptionPlan
        fields = ['id', 'name', 'description', 'price', 'billing_cycle', 'features', 'is_active']

class UserSubscriptionSerializer(serializers.ModelSerializer):
    """Serializer for UserSubscription model."""
    
    plan_details = serializers.SerializerMethodField()
    
    class Meta:
        model = UserSubscription
        fields = ['id', 'user', 'plan', 'plan_details', 'status', 'start_date', 'end_date', 'auto_renew', 'payment_method']
        read_only_fields = ['id', 'user', 'start_date']
    
    def get_plan_details(self, obj):
        return SubscriptionPlanSerializer(obj.plan).data

class TransactionSerializer(serializers.ModelSerializer):
    """Serializer for Transaction model."""
    
    class Meta:
        model = Transaction
        fields = ['id', 'user', 'subscription', 'amount', 'currency', 'status', 'payment_method', 'transaction_id', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

class SubscriptionUpdateSerializer(serializers.Serializer):
    """Serializer for updating a subscription."""
    
    plan_id = serializers.IntegerField()
    payment_method = serializers.CharField(required=False)
    auto_renew = serializers.BooleanField(required=False, default=True)

class SubscriptionCancelSerializer(serializers.Serializer):
    """Serializer for canceling a subscription."""
    
    reason = serializers.CharField(required=False)
