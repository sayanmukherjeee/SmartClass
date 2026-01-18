from django.db import models
import uuid
from user.models import Users
from courses.models import Course
from enrollments.models import Enrollment

class Certificate(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='certificates')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='certificates')
    enrollment = models.OneToOneField(Enrollment, on_delete=models.CASCADE, related_name='certificate')
    certificate_code = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    issued_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    download_url = models.URLField(blank=True)
    verification_url = models.URLField(blank=True)
    
    class Meta:
        unique_together = ['user', 'course']
        ordering = ['-issued_at']
    
    def __str__(self):
        return f"Certificate {self.certificate_code} - {self.user.username} - {self.course.title}"
    
    def save(self, *args, **kwargs):
        if not self.download_url:
            self.download_url = f"/api/certificates/{self.certificate_code}/download/"
        if not self.verification_url:
            self.verification_url = f"/api/certificates/{self.certificate_code}/verify/"
        super().save(*args, **kwargs)