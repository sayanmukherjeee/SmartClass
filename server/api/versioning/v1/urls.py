from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# API version 1 URLs
urlpatterns = [
    # Authentication (existing)
    path('auth/', include('user.urls')),
    
    # Courses
    path('courses/', include('courses.urls')),
    
    # Enrollments & Progress
    path('enrollments/', include('enrollments.urls')),
    
    # Payments
    path('payments/', include('payments.urls')),
    
    # Certificates
    path('certificates/', include('certificates.urls')),
    
    # Analytics
    path('analytics/', include('analytics.urls')),
    
    # Organization
    path('organization/', include('organization.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)