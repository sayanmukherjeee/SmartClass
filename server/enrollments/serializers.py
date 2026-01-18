from rest_framework import serializers
from .models import Enrollment, LessonProgress, QuizAttempt
from courses.serializers import CourseSerializer, LessonSerializer, QuizSerializer
from user.serializers import UserSerializer

class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Enrollment
        fields = [
            'id', 'user', 'course', 'enrolled_at', 'completed_at',
            'progress_percentage', 'is_completed', 'last_accessed_at',
            'status'
        ]
        read_only_fields = ['enrolled_at', 'last_accessed_at']

class LessonProgressSerializer(serializers.ModelSerializer):
    lesson = LessonSerializer(read_only=True)
    
    class Meta:
        model = LessonProgress
        fields = [
            'id', 'enrollment', 'lesson', 'completed', 'completed_at',
            'score', 'time_spent', 'last_accessed_at'
        ]
        read_only_fields = ['completed_at', 'last_accessed_at']

class QuizAttemptSerializer(serializers.ModelSerializer):
    quiz = QuizSerializer(read_only=True)
    
    class Meta:
        model = QuizAttempt
        fields = [
            'id', 'enrollment', 'quiz', 'score', 'passed',
            'attempt_number', 'started_at', 'completed_at', 'time_taken'
        ]
        read_only_fields = ['started_at']

class CreateEnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['course']
    
    def create(self, validated_data):
        user = self.context['request'].user
        course = validated_data['course']
        
        # Check if already enrolled
        if Enrollment.objects.filter(user=user, course=course).exists():
            raise serializers.ValidationError('Already enrolled in this course.')
        
        enrollment = Enrollment.objects.create(user=user, course=course)
        
        # Update course enrollment count
        course.total_enrollments += 1
        course.save()
        
        return enrollment

class UpdateLessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        fields = ['completed', 'score', 'time_spent']
    
    def update(self, instance, validated_data):
        completed = validated_data.get('completed', instance.completed)
        
        if completed and not instance.completed:
            instance.completed_at = serializers.DateTimeField().to_representation(serializers.DateTimeField().to_internal_value(None))
        
        instance.completed = completed
        instance.score = validated_data.get('score', instance.score)
        instance.time_spent = validated_data.get('time_spent', instance.time_spent)
        
        instance.save()
        
        # Update enrollment progress
        enrollment = instance.enrollment
        total_lessons = enrollment.course.lessons.count()
        completed_lessons = enrollment.lesson_progress.filter(completed=True).count()
        
        if total_lessons > 0:
            enrollment.progress_percentage = (completed_lessons / total_lessons) * 100
            
            # Check if course is completed
            if completed_lessons == total_lessons:
                enrollment.is_completed = True
                enrollment.status = 'completed'
        
        enrollment.save()
        
        return instance