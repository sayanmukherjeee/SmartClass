from django.db import models
from user.models import Users
from courses.models import Course

class UserActivity(models.Model):
    ACTIVITY_TYPES = [
        ('login', 'User Login'),
        ('logout', 'User Logout'),
        ('course_view', 'Course View'),
        ('course_enroll', 'Course Enrollment'),
        ('lesson_start', 'Lesson Started'),
        ('lesson_complete', 'Lesson Completed'),
        ('quiz_attempt', 'Quiz Attempt'),
        ('certificate_generated', 'Certificate Generated'),
        ('payment_made', 'Payment Made'),
    ]
    
    user = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='activities', null=True, blank=True)
    activity_type = models.CharField(max_length=50, choices=ACTIVITY_TYPES)
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True)
    details = models.JSONField(default=dict)  # Store additional data
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'User Activities'
    
    def __str__(self):
        return f"{self.activity_type} - {self.user.username if self.user else 'Anonymous'}"

class CourseAnalytics(models.Model):
    course = models.OneToOneField(Course, on_delete=models.CASCADE, related_name='analytics')
    total_views = models.IntegerField(default=0)
    total_enrollments = models.IntegerField(default=0)
    total_completions = models.IntegerField(default=0)
    average_rating = models.FloatField(default=0.0)
    total_ratings = models.IntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    last_updated = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Analytics for {self.course.title}"

class SystemAnalytics(models.Model):
    total_users = models.IntegerField(default=0)
    total_courses = models.IntegerField(default=0)
    total_enrollments = models.IntegerField(default=0)
    active_users_24h = models.IntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    recorded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-recorded_at']
    
    def __str__(self):
        return f"System Analytics - {self.recorded_at}"