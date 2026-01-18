# users/urls.py
from django.urls import path
from .views import (
    RegisterView,
    AdminRegisterView,
    LoginView,
    AdminLoginView,
    TokenRefreshView,
    TokenVerifyView,
    LogoutView,
    LogoutAllView,
    ProfileView,
    CustomAuthToken
)

app_name = 'users'

urlpatterns = [
    # JWT Authentication endpoints
    path('token/', CustomAuthToken.as_view(), name='token_auth'),  # For backward compatibility
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # Regular User endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    
    # Admin endpoints
    path('admin/register/', AdminRegisterView.as_view(), name='admin_register'),
    path('admin/login/', AdminLoginView.as_view(), name='admin_login'),
    
    # Logout endpoints
    path('logout/', LogoutView.as_view(), name='logout'),
    path('logout/all/', LogoutAllView.as_view(), name='logout_all'),
    
    # Profile
    path('profile/', ProfileView.as_view(), name='profile'),
]