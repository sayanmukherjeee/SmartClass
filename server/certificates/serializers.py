from rest_framework import serializers
from .models import Certificate
from courses.serializers import CourseSerializer
from user.serializers import UserSerializer

class CertificateSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    course = CourseSerializer(read_only=True)
    
    class Meta:
        model = Certificate
        fields = [
            'id', 'user', 'course', 'certificate_code',
            'issued_at', 'expires_at', 'download_url', 'verification_url'
        ]
        read_only_fields = ['certificate_code', 'issued_at', 'download_url', 'verification_url']

class GenerateCertificateSerializer(serializers.Serializer):
    enrollment_id = serializers.IntegerField(required=True)
    
    def validate(self, data):
        from enrollments.models import Enrollment
        enrollment = Enrollment.objects.filter(
            id=data['enrollment_id'],
            user=self.context['request'].user,
            is_completed=True
        ).first()
        
        if not enrollment:
            raise serializers.ValidationError('No completed enrollment found.')
        
        # Check if certificate already exists
        from .models import Certificate
        if Certificate.objects.filter(enrollment=enrollment).exists():
            raise serializers.ValidationError('Certificate already exists for this enrollment.')
        
        data['enrollment'] = enrollment
        return data