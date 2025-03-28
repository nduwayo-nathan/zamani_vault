
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SubscriptionPlanViewSet, UserSubscriptionViewSet, TransactionViewSet

router = DefaultRouter()
router.register(r'plans', SubscriptionPlanViewSet)
router.register(r'subscriptions', UserSubscriptionViewSet, basename='subscriptions')
router.register(r'transactions', TransactionViewSet, basename='transactions')

urlpatterns = [
    path('', include(router.urls)),
]
