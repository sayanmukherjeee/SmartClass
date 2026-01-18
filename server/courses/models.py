from django.db import models
from django.contrib.postgres.fields import ArrayField
from user.models import Users

class CourseCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=7, default='#667eea')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = 'Course Categories'
    
    def __str__(self):
        return self.name

class Course(models.Model):
    LEVEL_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    short_description = models.CharField(max_length=300, blank=True)
    
    # Course metadata
    instructor = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='courses_created')
    category = models.ForeignKey(CourseCategory, on_delete=models.SET_NULL, null=True, related_name='courses')
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='beginner')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    # Course details
    thumbnail = models.ImageField(upload_to='course_thumbnails/', blank=True, null=True)
    video_preview = models.URLField(blank=True)
    duration_hours = models.IntegerField(default=0)  # Total hours
    language = models.CharField(max_length=50, default='English')
    subtitles = ArrayField(models.CharField(max_length=10), default=list, blank=True)  # ['en', 'es', 'fr']
    
    # Accreditation
    is_cpd_accredited = models.BooleanField(default=False)
    cpd_points = models.IntegerField(default=0)
    accreditation_body = models.CharField(max_length=100, blank=True)
    
    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_free = models.BooleanField(default=False)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Requirements
    prerequisites = models.TextField(blank=True)
    learning_objectives = models.TextField(blank=True)
    target_audience = models.TextField(blank=True)
    
    # Statistics
    total_enrollments = models.IntegerField(default=0)
    average_rating = models.FloatField(default=0.0)
    total_reviews = models.IntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug', 'status']),
            models.Index(fields=['category', 'level']),
        ]
    
    def __str__(self):
        return self.title
    
    @property
    def current_price(self):
        return self.discount_price if self.discount_price else self.price
    
    @property
    def is_discounted(self):
        return self.discount_price is not None

class Module(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    duration_minutes = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order']
        unique_together = ['course', 'order']
    
    def __str__(self):
        return f"{self.course.title} - {self.title}"

class Lesson(models.Model):
    LESSON_TYPES = [
        ('video', 'Video Lesson'),
        ('article', 'Article'),
        ('quiz', 'Quiz'),
        ('assignment', 'Assignment'),
        ('live', 'Live Session'),
    ]
    
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=200)
    lesson_type = models.CharField(max_length=20, choices=LESSON_TYPES, default='video')
    content = models.TextField(blank=True)  # For articles
    video_url = models.URLField(blank=True)
    video_duration = models.IntegerField(default=0)  # seconds
    attachments = models.JSONField(default=list, blank=True)  # List of file URLs
    order = models.PositiveIntegerField(default=0)
    is_preview = models.BooleanField(default=False)  # Free preview lesson
    
    # Completion requirements
    must_complete = models.BooleanField(default=True)
    completion_threshold = models.IntegerField(default=80)  # For quizzes
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.module.title} - {self.title}"

class Quiz(models.Model):
    lesson = models.OneToOneField(Lesson, on_delete=models.CASCADE, related_name='quiz')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    passing_score = models.IntegerField(default=70)
    max_attempts = models.IntegerField(default=3)
    time_limit = models.IntegerField(null=True, blank=True)  # minutes, null = no limit
    
    def __str__(self):
        return self.title

class Question(models.Model):
    QUESTION_TYPES = [
        ('multiple_choice', 'Multiple Choice'),
        ('true_false', 'True/False'),
        ('short_answer', 'Short Answer'),
    ]
    
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPES, default='multiple_choice')
    text = models.TextField()
    explanation = models.TextField(blank=True)
    points = models.IntegerField(default=1)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return self.text[:100]

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='choices')
    text = models.CharField(max_length=500)
    is_correct = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.text} ({'✓' if self.is_correct else '✗'})"