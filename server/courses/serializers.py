from rest_framework import serializers
from .models import CourseCategory, Course, Module, Lesson, Quiz, Question, Choice
from user.serializers import UserSerializer

class CourseCategorySerializer(serializers.ModelSerializer):
    course_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = CourseCategory
        fields = ['id', 'name', 'description', 'icon', 'color', 'course_count', 'created_at', 'updated_at']
    
    def get_course_count(self, obj):
        return obj.courses.count()

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'text', 'is_correct', 'order']

class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)
    
    class Meta:
        model = Question
        fields = ['id', 'question_type', 'text', 'explanation', 'points', 'order', 'choices']

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'passing_score', 'max_attempts', 'time_limit', 'questions']

class LessonSerializer(serializers.ModelSerializer):
    quiz = QuizSerializer(read_only=True)
    
    class Meta:
        model = Lesson
        fields = [
            'id', 'module', 'title', 'lesson_type', 'content', 
            'video_url', 'video_duration', 'attachments', 'order',
            'is_preview', 'must_complete', 'completion_threshold', 'quiz'
        ]

class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    
    class Meta:
        model = Module
        fields = ['id', 'course', 'title', 'description', 'order', 'duration_minutes', 'lessons']

class CourseSerializer(serializers.ModelSerializer):
    instructor = UserSerializer(read_only=True)
    category = CourseCategorySerializer(read_only=True)
    modules = ModuleSerializer(many=True, read_only=True)
    
    class Meta:
        model = Course
        fields = [
            'id', 'title', 'slug', 'description', 'short_description',
            'instructor', 'category', 'level', 'status',
            'thumbnail', 'video_preview', 'duration_hours', 'language', 'subtitles',
            'is_cpd_accredited', 'cpd_points', 'accreditation_body',
            'price', 'is_free', 'discount_price',
            'prerequisites', 'learning_objectives', 'target_audience',
            'total_enrollments', 'average_rating', 'total_reviews',
            'created_at', 'updated_at', 'published_at', 'modules'
        ]
        read_only_fields = ['total_enrollments', 'average_rating', 'total_reviews', 'created_at', 'updated_at']

class CourseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            'title', 'slug', 'description', 'short_description',
            'category', 'level', 'status',
            'duration_hours', 'language', 'subtitles',
            'is_cpd_accredited', 'cpd_points', 'accreditation_body',
            'price', 'is_free', 'discount_price',
            'prerequisites', 'learning_objectives', 'target_audience'
        ]