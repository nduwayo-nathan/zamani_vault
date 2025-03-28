
from django.urls import path
from .views import (
    UserRegistrationView, UserLoginView, UserLogoutView,
    UserProfileView, UserSubscriptionView, UserActivityListView,
    AdminUserListView
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', UserLogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('subscription/', UserSubscriptionView.as_view(), name='subscription'),
    path('history/', UserActivityListView.as_view(), name='history'),
    path('admin/users/', AdminUserListView.as_view(), name='admin-users'),
]
