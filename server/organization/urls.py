from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'organizations', views.OrganizationViewSet, basename='organization')
router.register(r'organization-members', views.OrganizationMemberViewSet, basename='organization-member')
router.register(r'organization-enrollments', views.OrganizationEnrollmentViewSet, basename='organization-enrollment')

urlpatterns = [
    path('', include(router.urls)),
]