from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Count

from .models import User
from .serializers import (
    ChangePasswordSerializer,
    RegisterSerializer,
    UserListSerializer,
    UserSerializer,
)
from .permissions import IsAdmin


class RegisterView(generics.CreateAPIView):
    """POST /api/auth/register/"""
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        tokens = RefreshToken.for_user(user)
        return Response({
            "user":    UserSerializer(user).data,
            "access":  str(tokens.access_token),
            "refresh": str(tokens),
        }, status=status.HTTP_201_CREATED)


class LoginView(TokenObtainPairView):
    """POST /api/auth/login/"""
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            user = User.objects.filter(email=request.data.get("email")).first()
            if user:
                response.data["user"] = UserSerializer(user).data
        return response


class LogoutView(APIView):
    """POST /api/auth/logout/"""

    def post(self, request):
        try:
            RefreshToken(request.data["refresh"]).blacklist()
            return Response({"detail": "Déconnexion réussie."})
        except Exception:
            return Response({"detail": "Token invalide."}, status=400)


class ProfileView(generics.RetrieveUpdateAPIView):
    """GET/PATCH /api/auth/profile/"""
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    """POST /api/auth/change-password/"""

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Mot de passe modifié avec succès."})


class UserListView(generics.ListAPIView):
    """GET /api/auth/users/ — Admin only"""
    permission_classes = [IsAdmin]
    serializer_class = UserListSerializer

    def get_queryset(self):
        return User.objects.annotate(
            borrowings_count=Count("borrowings")
        ).order_by("-created_at")
