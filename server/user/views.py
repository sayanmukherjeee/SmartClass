# users/views.py
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth import authenticate, login, logout
from django.utils import timezone
from .models import Users
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, AdminRegisterSerializer, TokenRefreshSerializer

class CustomAuthToken(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            # Get tokens
            refresh = serializer.validated_data['refresh']
            access = serializer.validated_data['access']
            
            # Login for session
            login(request, user)
            
            user_data = UserSerializer(user).data
            
            return Response({
                'refresh': refresh,
                'access': access,
                'user': user_data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(generics.CreateAPIView):
    queryset = Users.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        user_data = UserSerializer(user).data
        
        return Response({
            'message': 'User registered successfully',
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': user_data
        }, status=status.HTTP_201_CREATED)

class AdminRegisterView(generics.CreateAPIView):
    queryset = Users.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = AdminRegisterSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        user_data = UserSerializer(user).data
        
        return Response({
            'message': 'Admin user created successfully',
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': user_data
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    http_method_names = ['get', 'post', 'head', 'options']
    
    def get(self, request, *args, **kwargs):
        if request.accepted_renderer.format == 'api':
            return Response({
                'detail': 'Send a POST request with username and password',
                'fields': {
                    'username': 'string',
                    'password': 'string'
                }
            })
        
        return Response({
            'message': 'Login endpoint',
            'methods': ['POST'],
            'required_fields': ['username', 'password'],
            'example_request': {
                'username': 'testuser',
                'password': 'testpass123'
            }
        })
    
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)
            
            user.last_login = timezone.now()
            user.save()
            
            user_data = UserSerializer(user).data
            
            return Response({
                'refresh': serializer.validated_data['refresh'],
                'access': serializer.validated_data['access'],
                'user': user_data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminLoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            # Check if user is admin
            if not user.is_admin:
                return Response({
                    'error': 'Access denied. Admin privileges required.'
                }, status=status.HTTP_403_FORBIDDEN)
            
            login(request, user)
            
            user.last_login = timezone.now()
            user.save()
            
            user_data = UserSerializer(user).data
            
            return Response({
                'refresh': serializer.validated_data['refresh'],
                'access': serializer.validated_data['access'],
                'user': user_data,
                'message': 'Admin login successful'
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TokenRefreshView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = TokenRefreshSerializer(data=request.data)
        if serializer.is_valid():
            try:
                refresh_token = serializer.validated_data['refresh']
                
                # Create new access token
                access_token = refresh_token.access_token
                
                # Rotate refresh token (get new one)
                new_refresh = RefreshToken.for_user(refresh_token.user)
                
                # Blacklist the old refresh token
                refresh_token.blacklist()
                
                return Response({
                    'access': str(new_refresh.access_token),
                    'refresh': str(new_refresh),
                    'message': 'Token refreshed successfully'
                })
            except TokenError as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TokenVerifyView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        token = request.data.get('token')
        if not token:
            return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Verify the token
            access_token = AccessToken(token)
            # Token is valid
            return Response({'valid': True, 'user_id': access_token['user_id']})
        except TokenError as e:
            return Response({'valid': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            # Get refresh token from request
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()  # Blacklist the refresh token
        except Exception as e:
            # Token might already be blacklisted or invalid
            pass
        
        logout(request)
        return Response({'message': 'Logged out successfully'})

class LogoutAllView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        # Get all refresh tokens for the user and blacklist them
        user = request.user
        tokens = RefreshToken.objects.filter(user=user)
        for token in tokens:
            try:
                token.blacklist()
            except:
                pass
        
        logout(request)
        return Response({'message': 'Logged out from all devices successfully'})

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user