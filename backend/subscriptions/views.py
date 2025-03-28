
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from datetime import timedelta, date
from .models import SubscriptionPlan, UserSubscription, Transaction
from .serializers import (
    SubscriptionPlanSerializer, UserSubscriptionSerializer, TransactionSerializer,
    SubscriptionUpdateSerializer, SubscriptionCancelSerializer
)
from django.contrib.auth import get_user_model

User = get_user_model()

class SubscriptionPlanViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing subscription plans.
    """
    queryset = SubscriptionPlan.objects.filter(is_active=True)
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserSubscriptionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing user subscriptions.
    """
    serializer_class = UserSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return UserSubscription.objects.all()
        return UserSubscription.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user, start_date=timezone.now().date())
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        """
        Get the current user's subscription.
        """
        try:
            subscription = UserSubscription.objects.get(user=request.user)
            serializer = self.get_serializer(subscription)
            return Response(serializer.data)
        except UserSubscription.DoesNotExist:
            return Response({"detail": "No active subscription found."}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def subscribe(self, request):
        """
        Subscribe to a plan.
        """
        serializer = SubscriptionUpdateSerializer(data=request.data)
        if serializer.is_valid():
            plan_id = serializer.validated_data['plan_id']
            payment_method = serializer.validated_data.get('payment_method', '')
            auto_renew = serializer.validated_data.get('auto_renew', True)
            
            try:
                plan = SubscriptionPlan.objects.get(id=plan_id, is_active=True)
            except SubscriptionPlan.DoesNotExist:
                return Response({"detail": "Plan not found."}, status=status.HTTP_404_NOT_FOUND)
            
            # Calculate end date based on billing cycle
            start_date = timezone.now().date()
            if plan.billing_cycle == 'monthly':
                end_date = start_date + timedelta(days=30)
            elif plan.billing_cycle == 'yearly':
                end_date = date(start_date.year + 1, start_date.month, start_date.day)
            else:  # lifetime
                end_date = None
            
            # Create or update subscription
            subscription, created = UserSubscription.objects.update_or_create(
                user=request.user,
                defaults={
                    'plan': plan,
                    'status': 'active',
                    'start_date': start_date,
                    'end_date': end_date,
                    'auto_renew': auto_renew,
                    'payment_method': payment_method
                }
            )
            
            # Update user's subscription type
            request.user.subscription_type = plan.name.lower()
            request.user.save()
            
            # Create transaction record (in a real app, this would happen after payment processing)
            Transaction.objects.create(
                user=request.user,
                subscription=subscription,
                amount=plan.price,
                status='completed',
                payment_method=payment_method,
                transaction_id=f"mock-{timezone.now().timestamp()}"
            )
            
            serializer = UserSubscriptionSerializer(subscription)
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def cancel(self, request):
        """
        Cancel current subscription.
        """
        try:
            subscription = UserSubscription.objects.get(user=request.user)
        except UserSubscription.DoesNotExist:
            return Response({"detail": "No active subscription found."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = SubscriptionCancelSerializer(data=request.data)
        if serializer.is_valid():
            subscription.status = 'canceled'
            subscription.auto_renew = False
            subscription.save()
            
            # In a real app, you would have a reason field and store the cancellation reason
            
            return Response({"detail": "Subscription canceled successfully."})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing transactions.
    """
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Transaction.objects.all()
        return Transaction.objects.filter(user=self.request.user)
