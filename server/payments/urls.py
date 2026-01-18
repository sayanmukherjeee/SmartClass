from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'payments', views.PaymentViewSet, basename='payment')  # Added basename

urlpatterns = [
    path('', include(router.urls)),
    path('status/', views.PaymentViewSet.as_view({'get': 'status'}), name='payment-status'),
]