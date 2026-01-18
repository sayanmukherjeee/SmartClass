from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CourseCategoryViewSet, basename='category')
router.register(r'courses', views.CourseViewSet, basename='course')
router.register(r'modules', views.ModuleViewSet, basename='module')
router.register(r'lessons', views.LessonViewSet, basename='lesson')
router.register(r'quizzes', views.QuizViewSet, basename='quiz')
router.register(r'questions', views.QuestionViewSet, basename='question')
router.register(r'choices', views.ChoiceViewSet, basename='choice')

urlpatterns = [
    path('', include(router.urls)),
    path('search/', views.CourseSearchView.as_view({'get': 'list'}), name='course-search'),
    path('featured/', views.CourseViewSet.as_view({'get': 'featured'}), name='featured-courses'),
    path('popular/', views.CourseViewSet.as_view({'get': 'popular'}), name='popular-courses'),
    path('recommended/', views.CourseViewSet.as_view({'get': 'recommended'}), name='recommended-courses'),
]