from django.db import models
import uuid
from user.models import Users

class Organization(models.Model):
    name = models.CharField(max_length=200)
    domain = models.CharField(max_length=100, unique=True)
    logo = models.ImageField(upload_to='organization_logos/', null=True, blank=True)
    primary_color = models.CharField(max_length=7, default='#667eea')  # Hex color
    secondary_color = models.CharField(max_length=7, default='#764ba2')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name

class OrganizationMember(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('instructor', 'Instructor'),
        ('learner', 'Learner'),
    ]
    
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='organizations')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='learner')
    joined_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ['organization', 'user']
        ordering = ['-joined_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.organization.name} ({self.role})"

class OrganizationEnrollment(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='enrollments')
    user = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='organization_enrollments')
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name='organization_enrollments')
    enrolled_by = models.ForeignKey(Users, on_delete=models.SET_NULL, null=True, related_name='assigned_enrollments')
    enrolled_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ['organization', 'user', 'course']
        ordering = ['-enrolled_at']
    
    def __str__(self):
        return f"{self.organization.name} - {self.user.username} - {self.course.title}"