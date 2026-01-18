from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db.models import Count, Sum, Avg, Q
from datetime import datetime, timedelta
from .models import UserActivity, CourseAnalytics, SystemAnalytics
from courses.models import Course
from enrollments.models import Enrollment
from user.models import Users

class AnalyticsViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        if self.action in ['system_stats', 'course_analytics', 'user_analytics']:
            return [IsAdminUser()]
        return super().get_permissions()
    
    @action(detail=False, methods=['get'])
    def user_stats(self, request):
        """Get current user's learning statistics"""
        user = request.user
        
        # Get user's enrollments
        user_enrollments = Enrollment.objects.filter(user=user)
        
        total_enrollments = user_enrollments.count()
        completed_courses = user_enrollments.filter(is_completed=True).count()
        in_progress = user_enrollments.filter(is_completed=False).count()
        
        # Calculate average progress
        avg_progress = user_enrollments.aggregate(avg=Avg('progress_percentage'))['avg'] or 0
        
        # Get recent activity
        recent_activity = UserActivity.objects.filter(user=user).order_by('-created_at')[:10]
        
        return Response({
            'total_enrollments': total_enrollments,
            'completed_courses': completed_courses,
            'in_progress': in_progress,
            'average_progress': round(avg_progress, 1),
            'recent_activity': [
                {
                    'activity_type': activity.activity_type,
                    'course_title': activity.course.title if activity.course else None,
                    'created_at': activity.created_at
                }
                for activity in recent_activity
            ]
        })
    
    @action(detail=False, methods=['get'])
    def course_analytics(self, request):
        """Get analytics for all courses (admin only)"""
        if not request.user.is_staff:
            return Response(
                {'detail': 'Admin access required.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        courses = Course.objects.all()
        analytics = []
        
        for course in courses:
            enrollments = Enrollment.objects.filter(course=course)
            total_enrollments = enrollments.count()
            completions = enrollments.filter(is_completed=True).count()
            completion_rate = (completions / total_enrollments * 100) if total_enrollments > 0 else 0
            
            analytics.append({
                'course_id': course.id,
                'course_title': course.title,
                'total_enrollments': total_enrollments,
                'completions': completions,
                'completion_rate': round(completion_rate, 1),
                'average_rating': course.average_rating,
                'total_reviews': course.total_reviews,
                'revenue': float(course.price) * total_enrollments if not course.is_free else 0
            })
        
        return Response(analytics)
    
    @action(detail=False, methods=['get'])
    def system_stats(self, request):
        """Get system-wide statistics (admin only)"""
        if not request.user.is_staff:
            return Response(
                {'detail': 'Admin access required.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # User statistics
        total_users = Users.objects.count()
        active_users_24h = Users.objects.filter(
            last_login__gte=datetime.now() - timedelta(days=1)
        ).count()
        new_users_week = Users.objects.filter(
            date_joined__gte=datetime.now() - timedelta(days=7)
        ).count()
        
        # Course statistics
        total_courses = Course.objects.count()
        published_courses = Course.objects.filter(status='published').count()
        free_courses = Course.objects.filter(is_free=True).count()
        
        # Enrollment statistics
        total_enrollments = Enrollment.objects.count()
        active_enrollments = Enrollment.objects.filter(is_completed=False).count()
        completed_enrollments = Enrollment.objects.filter(is_completed=True).count()
        
        # Revenue statistics
        total_revenue = Enrollment.objects.filter(
            course__is_free=False
        ).count() * 100  # Simplified calculation
        
        return Response({
            'users': {
                'total': total_users,
                'active_24h': active_users_24h,
                'new_week': new_users_week
            },
            'courses': {
                'total': total_courses,
                'published': published_courses,
                'free': free_courses
            },
            'enrollments': {
                'total': total_enrollments,
                'active': active_enrollments,
                'completed': completed_enrollments
            },
            'revenue': {
                'total': total_revenue,
                'monthly': total_revenue / 12  # Simplified
            }
        })
    
    @action(detail=False, methods=['get'])
    def user_analytics(self, request):
        """Get user analytics (admin only)"""
        if not request.user.is_staff:
            return Response(
                {'detail': 'Admin access required.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get user growth data for last 30 days
        thirty_days_ago = datetime.now() - timedelta(days=30)
        dates = [(thirty_days_ago + timedelta(days=i)).date() for i in range(31)]
        
        user_growth = []
        for date in dates:
            count = Users.objects.filter(date_joined__date__lte=date).count()
            user_growth.append({
                'date': date.isoformat(),
                'users': count
            })
        
        # Get user activity by day for last 7 days
        activity_data = []
        for i in range(7):
            date = (datetime.now() - timedelta(days=i)).date()
            activities = UserActivity.objects.filter(created_at__date=date).count()
            activity_data.append({
                'date': date.isoformat(),
                'activities': activities
            })
        
        return Response({
            'user_growth': user_growth,
            'activity_trends': activity_data
        })