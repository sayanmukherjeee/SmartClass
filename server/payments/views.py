# payments/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.conf import settings
import logging
from .models import Payment
from .serializers import PaymentSerializer, CreatePaymentSerializer

logger = logging.getLogger(__name__)

# Try to import stripe, but handle it gracefully if not available
STRIPE_AVAILABLE = False
stripe = None

try:
    import stripe
    
    # Check if stripe secret key is configured in settings
    if hasattr(settings, 'STRIPE_SECRET_KEY') and settings.STRIPE_SECRET_KEY:
        # Check if it's a dummy/placeholder key
        if settings.STRIPE_SECRET_KEY not in ['', 'sk_test_your_key', 'sk_test_your_key_here']:
            stripe.api_key = settings.STRIPE_SECRET_KEY
            STRIPE_AVAILABLE = True
            logger.info("Stripe initialized successfully")
        else:
            logger.warning("Stripe secret key is not configured or is using placeholder value")
    else:
        logger.warning("STRIPE_SECRET_KEY not found in settings")
        
except ImportError:
    logger.warning("Stripe package not installed. Payment features will be limited.")
except Exception as e:
    logger.error(f"Error initializing Stripe: {e}")

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Payment.objects.all()
        return Payment.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CreatePaymentSerializer
        return PaymentSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Create payment record
        payment = Payment.objects.create(
            user=request.user,
            course=serializer.validated_data.get('course'),
            amount=serializer.validated_data['amount'],
            currency=serializer.validated_data['currency'],
            payment_method=serializer.validated_data['payment_method']
        )
        
        # Process payment based on method
        payment_method = serializer.validated_data['payment_method']
        
        if payment_method == 'stripe':
            if not STRIPE_AVAILABLE:
                # Stripe is not configured - use manual as fallback
                payment.status = 'completed'
                payment.payment_gateway_response = {
                    'note': 'Stripe not configured. Auto-completed for development.',
                    'stripe_available': False
                }
                payment.save()
                logger.info(f"Payment {payment.id}: Stripe not configured, auto-completed")
                
                return Response({
                    'payment': PaymentSerializer(payment).data,
                    'warning': 'Stripe is not configured. Payment auto-completed for development.',
                    'stripe_available': False
                }, status=status.HTTP_201_CREATED)
            
            # Create Stripe payment intent
            try:
                intent = stripe.PaymentIntent.create(
                    amount=int(payment.amount * 100),  # Convert to cents
                    currency=payment.currency.lower(),
                    metadata={
                        'payment_id': str(payment.id),
                        'user_id': str(request.user.id),
                        'course_id': str(payment.course.id) if payment.course else ''
                    }
                )
                
                payment.payment_gateway_response = {
                    'client_secret': intent.client_secret,
                    'payment_intent_id': intent.id
                }
                payment.save()
                
                return Response({
                    'payment': PaymentSerializer(payment).data,
                    'client_secret': intent.client_secret,
                    'payment_intent_id': intent.id
                })
                
            except stripe.error.StripeError as e:
                payment.status = 'failed'
                payment.payment_gateway_response = {
                    'error': str(e),
                    'error_type': 'stripe_error'
                }
                payment.save()
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                payment.status = 'failed'
                payment.payment_gateway_response = {
                    'error': str(e),
                    'error_type': 'general_error'
                }
                payment.save()
                return Response(
                    {'error': 'Payment processing failed. Please try again.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        elif payment_method == 'manual':
            # Manual payment - mark as completed
            payment.status = 'completed'
            payment.save()
            
            return Response(
                PaymentSerializer(payment).data,
                status=status.HTTP_201_CREATED
            )
        
        return Response(
            {'error': 'Unsupported payment method.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm payment completion"""
        payment = self.get_object()
        
        if payment.user != request.user and not request.user.is_staff:
            return Response(
                {'detail': 'Not authorized.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Update payment status
        payment.status = 'completed'
        payment.save()
        
        return Response({
            'message': 'Payment confirmed successfully.',
            'payment': PaymentSerializer(payment).data
        })
    
    @action(detail=False, methods=['get'])
    def status(self, request):
        """Check payment system status"""
        return Response({
            'stripe_available': STRIPE_AVAILABLE,
            'stripe_configured': hasattr(settings, 'STRIPE_SECRET_KEY') and bool(settings.STRIPE_SECRET_KEY),
            'stripe_installed': stripe is not None,
            'available_methods': ['manual'] + (['stripe'] if STRIPE_AVAILABLE else [])
        })