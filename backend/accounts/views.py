
from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .serializers import (
    UserSerializer, UserRegistrationSerializer, 
    UserLoginSerializer, TokenSerializer,
    UserActivitySerializer, ProfileUpdateSerializer,
    SubscriptionUpdateSerializer
)
from .models import UserActivity
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class UserRegistrationView(generics.CreateAPIView):
    """
    API View for user registration.
    """
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token_data = TokenSerializer.get_token(user)
            return Response(token_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    """
    API View for user login.
    """
    serializer_class = UserLoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token_data = TokenSerializer.get_token(user)
            return Response(token_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLogoutView(APIView):
    """
    API View for user logout.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    API View for retrieving and updating user profile.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        serializer = ProfileUpdateSerializer(self.get_object(), data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(UserSerializer(self.get_object()).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserSubscriptionView(generics.RetrieveUpdateAPIView):
    """
    API View for retrieving and updating user subscription.
    """
    serializer_class = SubscriptionUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get(self, request, *args, **kwargs):
        user = self.get_object()
        return Response({
            "subscription_type": user.subscription_type,
            "status": "active",  # This would come from payment processor in real app
            "next_billing": "2023-12-01"  # This would come from payment processor in real app
        })

class UserActivityListView(generics.ListCreateAPIView):
    """
    API View for listing and creating user activity.
    """
    serializer_class = UserActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserActivity.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AdminUserListView(generics.ListAPIView):
    """
    API View for admin to list all users.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]
