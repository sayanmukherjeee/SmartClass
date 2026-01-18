from rest_framework import serializers
from .models import Payment
from courses.serializers import CourseSerializer
from user.serializers import UserSerializer

class PaymentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    course = CourseSerializer(read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id', 'user', 'course', 'transaction_id', 'amount', 'currency',
            'status', 'payment_method', 'created_at', 'updated_at'
        ]
        read_only_fields = ['transaction_id', 'created_at', 'updated_at']

class CreatePaymentSerializer(serializers.Serializer):
    course_id = serializers.IntegerField(required=False)
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)
    currency = serializers.CharField(max_length=3, default='USD')
    payment_method = serializers.CharField(max_length=20, required=True)
    
    def validate(self, data):
        course_id = data.get('course_id')
        
        if course_id:
            from courses.models import Course
            try:
                course = Course.objects.get(id=course_id)
                data['course'] = course
                
                # Validate amount matches course price
                if data['amount'] != course.price and not course.is_free:
                    raise serializers.ValidationError('Amount does not match course price.')
                
            except Course.DoesNotExist:
                raise serializers.ValidationError('Course not found.')
        
        return data