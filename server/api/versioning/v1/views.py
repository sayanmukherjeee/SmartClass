from django.http import JsonResponse
from django.views import View
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import psycopg2
from django.db import connection
import os
from datetime import datetime


class HealthCheckView(View):
    def get(self, request):
        return JsonResponse({
            "status": "healthy",
            "service": "smartclass-backend",
            "timestamp": datetime.now().isoformat(),
            "environment": os.getenv('DJANGO_SETTINGS_MODULE', 'unknown'),
        })


class DatabaseHealthCheckView(APIView):
    permission_classes = []
    
    def get(self, request):
        try:
            # Test database connection
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                cursor.fetchone()
            
            return Response({
                "database": "connected",
                "status": "healthy"
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                "database": "disconnected",
                "error": str(e),
                "status": "unhealthy"
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)


class SystemInfoView(APIView):
    permission_classes = []
    
    def get(self, request):
        import sys
        import platform
        
        return Response({
            "python_version": sys.version,
            "platform": platform.platform(),
            "django_version": "4.2.10",
            "database_engine": connection.vendor,
            "timezone": "UTC",
            "debug_mode": os.getenv('DEBUG', 'False'),
            "allowed_hosts": os.getenv('ALLOWED_HOSTS', '').split(',')
        }) 