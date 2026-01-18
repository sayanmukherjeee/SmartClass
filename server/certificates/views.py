from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from .models import Certificate
from .serializers import CertificateSerializer, GenerateCertificateSerializer
from enrollments.models import Enrollment

class CertificateViewSet(viewsets.ModelViewSet):
    serializer_class = CertificateSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['course']
    search_fields = ['course__title']
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Certificate.objects.all()
        return Certificate.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def generate(self, request):
        """Generate certificate for completed course"""
        serializer = GenerateCertificateSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            enrollment = serializer.validated_data['enrollment']
            
            # Create certificate
            certificate = Certificate.objects.create(
                user=request.user,
                course=enrollment.course,
                enrollment=enrollment
            )
            
            return Response(
                CertificateSerializer(certificate).data,
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Download certificate (simulate for now)"""
        certificate = self.get_object()
        
        if certificate.user != request.user and not request.user.is_staff:
            return Response(
                {'detail': 'Not authorized.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # In production, generate PDF certificate
        return Response({
            'message': f'Certificate {certificate.certificate_code} download initiated.',
            'download_url': certificate.download_url
        })
    
    @action(detail=True, methods=['get'])
    def verify(self, request, pk=None):
        """Verify certificate"""
        certificate = self.get_object()
        return Response({
            'valid': True,
            'certificate': CertificateSerializer(certificate).data
        })