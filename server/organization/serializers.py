from rest_framework import serializers
from .models import Organization, OrganizationMember, OrganizationEnrollment
from user.serializers import UserSerializer
from courses.serializers import CourseSerializer

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = [
            'id', 'name', 'domain', 'logo', 
            'primary_color', 'secondary_color',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

class OrganizationMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    organization = OrganizationSerializer(read_only=True)
    
    class Meta:
        model = OrganizationMember
        fields = [
            'id', 'organization', 'user', 'role',
            'joined_at', 'is_active'
        ]
        read_only_fields = ['joined_at']

class OrganizationEnrollmentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    organization = OrganizationSerializer(read_only=True)
    course = CourseSerializer(read_only=True)
    enrolled_by = UserSerializer(read_only=True)
    
    class Meta:
        model = OrganizationEnrollment
        fields = [
            'id', 'organization', 'user', 'course',
            'enrolled_by', 'enrolled_at', 'completed_at'
        ]
        read_only_fields = ['enrolled_at']