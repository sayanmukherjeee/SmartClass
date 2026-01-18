from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.shortcuts import get_object_or_404
from .models import Organization, OrganizationMember, OrganizationEnrollment
from .serializers import (
    OrganizationSerializer, OrganizationMemberSerializer, 
    OrganizationEnrollmentSerializer
)

class OrganizationViewSet(viewsets.ModelViewSet):
    serializer_class = OrganizationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Organization.objects.all()
        
        # Users can see organizations they're members of
        return Organization.objects.filter(
            members__user=self.request.user,
            members__is_active=True
        )
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return super().get_permissions()
    
    @action(detail=True, methods=['get'])
    def members(self, request, pk=None):
        """Get organization members"""
        organization = self.get_object()
        
        # Check if user is member or admin
        if not request.user.is_staff and not organization.members.filter(user=request.user).exists():
            return Response(
                {'detail': 'Not a member of this organization.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        members = organization.members.filter(is_active=True)
        serializer = OrganizationMemberSerializer(members, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        """Add member to organization (admin/managers only)"""
        organization = self.get_object()
        
        # Check permissions
        user_membership = organization.members.filter(user=request.user).first()
        if not request.user.is_staff and (not user_membership or user_membership.role not in ['admin', 'manager']):
            return Response(
                {'detail': 'Insufficient permissions.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Add member logic here
        # This is a simplified version
        return Response({'detail': 'Member added successfully.'})
    
    @action(detail=True, methods=['get'])
    def enrollments(self, request, pk=None):
        """Get organization enrollments"""
        organization = self.get_object()
        
        # Check if user is member or admin
        if not request.user.is_staff and not organization.members.filter(user=request.user).exists():
            return Response(
                {'detail': 'Not a member of this organization.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        enrollments = organization.enrollments.all()
        serializer = OrganizationEnrollmentSerializer(enrollments, many=True)
        return Response(serializer.data)

class OrganizationMemberViewSet(viewsets.ModelViewSet):
    serializer_class = OrganizationMemberSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return OrganizationMember.objects.all()
        
        # Users can only see their own memberships
        return OrganizationMember.objects.filter(user=self.request.user, is_active=True)
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return super().get_permissions()

class OrganizationEnrollmentViewSet(viewsets.ModelViewSet):
    serializer_class = OrganizationEnrollmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return OrganizationEnrollment.objects.all()
        
        # Users can only see their own enrollments
        return OrganizationEnrollment.objects.filter(user=self.request.user)