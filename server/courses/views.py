# backend/courses/views.py
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import CourseCategory, Course, Module, Lesson, Quiz, Question, Choice
from .serializers import (
    CourseCategorySerializer, CourseSerializer, CourseCreateSerializer,
    ModuleSerializer, LessonSerializer, QuizSerializer, QuestionSerializer, ChoiceSerializer
)

class CourseCategoryViewSet(viewsets.ModelViewSet):
    queryset = CourseCategory.objects.all()
    serializer_class = CourseCategorySerializer
    permission_classes = [AllowAny]  # Changed from IsAuthenticated to AllowAny
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [AllowAny()]  # Public access for list/retrieve actions

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.filter(status='published')
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'level', 'is_cpd_accredited', 'is_free']
    search_fields = ['title', 'description', 'short_description', 'instructor__username']
    ordering_fields = ['created_at', 'price', 'average_rating', 'total_enrollments']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by price
        price_filter = self.request.query_params.get('price')
        if price_filter == 'free':
            queryset = queryset.filter(is_free=True)
        elif price_filter == 'paid':
            queryset = queryset.filter(is_free=False)
        
        # Filter by rating
        min_rating = self.request.query_params.get('min_rating')
        if min_rating:
            queryset = queryset.filter(average_rating__gte=float(min_rating))
        
        return queryset
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'enroll']:
            return [IsAdminUser()]
        return [AllowAny()]
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return CourseCreateSerializer
        return CourseSerializer
    
    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured courses (public access)"""
        featured_courses = Course.objects.filter(
            status='published'
        ).order_by('-average_rating', '-total_enrollments')[:8]
        serializer = self.get_serializer(featured_courses, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Get popular courses (public access)"""
        popular_courses = Course.objects.filter(
            status='published'
        ).order_by('-total_enrollments')[:8]
        serializer = self.get_serializer(popular_courses, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def recommended(self, request):
        """Get recommended courses based on user's enrolled courses"""
        user = request.user
        # For now, return featured courses
        # In production, implement recommendation algorithm
        recommended_courses = Course.objects.filter(
            status='published'
        ).order_by('?')[:8]  # Random for demo
        serializer = self.get_serializer(recommended_courses, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def enroll(self, request, pk=None):
        """Enroll current user in course"""
        from enrollments.models import Enrollment
        course = self.get_object()
        
        # Check if already enrolled
        existing_enrollment = Enrollment.objects.filter(
            user=request.user, course=course
        ).first()
        
        if existing_enrollment:
            return Response(
                {'detail': 'Already enrolled in this course.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create enrollment
        enrollment = Enrollment.objects.create(
            user=request.user,
            course=course
        )
        
        # Increment course enrollment count
        course.total_enrollments += 1
        course.save()
        
        return Response(
            {'detail': 'Successfully enrolled in course.', 'enrollment_id': enrollment.id},
            status=status.HTTP_201_CREATED
        )

class ModuleViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ModuleSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['course']
    
    def get_queryset(self):
        return Module.objects.all().order_by('order')

class LessonViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['module']
    
    def get_queryset(self):
        return Lesson.objects.all().order_by('order')

class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return super().get_permissions()

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return super().get_permissions()

class ChoiceViewSet(viewsets.ModelViewSet):
    queryset = Choice.objects.all()
    serializer_class = ChoiceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return super().get_permissions()

class CourseSearchView(viewsets.GenericViewSet):
    permission_classes = [AllowAny]  # Make search public too
    
    def list(self, request):
        query = request.query_params.get('search', '')
        
        if not query:
            return Response({'results': []})
        
        courses = Course.objects.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query) |
            Q(short_description__icontains=query) |
            Q(category__name__icontains=query)
        ).filter(status='published')
        
        serializer = CourseSerializer(courses, many=True)
        return Response({'results': serializer.data}) 