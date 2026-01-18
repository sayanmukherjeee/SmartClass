from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'enrollments', views.EnrollmentViewSet, basename='enrollment')
router.register(r'lesson-progress', views.LessonProgressViewSet, basename='lessonprogress')
router.register(r'quiz-attempts', views.QuizAttemptViewSet, basename='quizattempt')

urlpatterns = [
    path('', include(router.urls)),
]