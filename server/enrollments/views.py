from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from .models import Enrollment, LessonProgress, QuizAttempt
from .serializers import (
    EnrollmentSerializer, LessonProgressSerializer, QuizAttemptSerializer,
    CreateEnrollmentSerializer, UpdateLessonProgressSerializer
)
from courses.models import Course, Lesson, Quiz

class EnrollmentViewSet(viewsets.ModelViewSet):
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['course', 'status', 'is_completed']
    search_fields = ['course__title']
    
    def get_queryset(self):
        # Users can only see their own enrollments
        # Admins can see all enrollments
        if self.request.user.is_staff:
            return Enrollment.objects.all()
        return Enrollment.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CreateEnrollmentSerializer
        return EnrollmentSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark enrollment as completed"""
        enrollment = self.get_object()
        
        if enrollment.user != request.user and not request.user.is_staff:
            return Response(
                {'detail': 'Not authorized.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        enrollment.is_completed = True
        enrollment.status = 'completed'
        enrollment.save()
        
        return Response({'detail': 'Course marked as completed.'})
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get enrollment statistics for user"""
        user_enrollments = Enrollment.objects.filter(user=request.user)
        
        total_enrollments = user_enrollments.count()
        completed_courses = user_enrollments.filter(is_completed=True).count()
        in_progress = user_enrollments.filter(is_completed=False).count()
        
        return Response({
            'total_enrollments': total_enrollments,
            'completed_courses': completed_courses,
            'in_progress': in_progress
        })

class LessonProgressViewSet(viewsets.ModelViewSet):
    serializer_class = LessonProgressSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['enrollment', 'lesson', 'completed']
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return LessonProgress.objects.all()
        return LessonProgress.objects.filter(enrollment__user=self.request.user)
    
    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return UpdateLessonProgressSerializer
        return LessonProgressSerializer
    
    def create(self, request, *args, **kwargs):
        """Create or update lesson progress"""
        enrollment_id = request.data.get('enrollment')
        lesson_id = request.data.get('lesson')
        completed = request.data.get('completed', False)
        
        # Get enrollment
        enrollment = get_object_or_404(Enrollment, id=enrollment_id, user=request.user)
        
        # Get lesson
        lesson = get_object_or_404(Lesson, id=lesson_id)
        
        # Check if lesson belongs to enrolled course
        if lesson.module.course != enrollment.course:
            return Response(
                {'detail': 'Lesson does not belong to enrolled course.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create or update progress
        progress, created = LessonProgress.objects.update_or_create(
            enrollment=enrollment,
            lesson=lesson,
            defaults={
                'completed': completed,
                'score': request.data.get('score'),
                'time_spent': request.data.get('time_spent', 0)
            }
        )
        
        serializer = self.get_serializer(progress)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

class QuizAttemptViewSet(viewsets.ModelViewSet):
    queryset = QuizAttempt.objects.all()
    serializer_class = QuizAttemptSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['enrollment', 'quiz', 'passed']
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return QuizAttempt.objects.all()
        return QuizAttempt.objects.filter(enrollment__user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save()