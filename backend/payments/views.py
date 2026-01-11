from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.db.models import Sum, Count
from django.utils import timezone

from .models import (
    PaymentMethod, PricingPlan, Order, Payment, 
    Subscription, Coupon, CouponUsage
)
from .serializers import (
    PaymentMethodSerializer, PricingPlanSerializer, OrderSerializer,
    PaymentSerializer, SubscriptionSerializer, CouponSerializer,
    CouponValidationSerializer, CreateOrderSerializer,
    PayPalCreateOrderSerializer, PayPalCaptureSerializer, PaymentStatsSerializer
)
from .paypal_service import paypal_service


# ============== PUBLIC VIEWS ==============

class PaymentMethodListView(generics.ListAPIView):
    """List all active payment methods"""
    queryset = PaymentMethod.objects.filter(is_active=True)
    serializer_class = PaymentMethodSerializer
    permission_classes = [AllowAny]


class PricingPlanListView(generics.ListAPIView):
    """List all active pricing plans"""
    serializer_class = PricingPlanSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = PricingPlan.objects.filter(is_active=True)
        
        # Filter by program if provided
        program_id = self.request.query_params.get('program_id')
        if program_id:
            queryset = queryset.filter(program_id=program_id)
        
        return queryset


class PricingPlanDetailView(generics.RetrieveAPIView):
    """Get details of a specific pricing plan"""
    queryset = PricingPlan.objects.filter(is_active=True)
    serializer_class = PricingPlanSerializer
    permission_classes = [AllowAny]


class ValidateCouponView(APIView):
    """Validate a coupon code"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = CouponValidationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        code = serializer.validated_data['code']
        pricing_plan_id = serializer.validated_data.get('pricing_plan_id')
        
        try:
            coupon = Coupon.objects.get(code__iexact=code)
        except Coupon.DoesNotExist:
            return Response(
                {'valid': False, 'message': 'Coupon not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if not coupon.is_valid():
            return Response(
                {'valid': False, 'message': 'Coupon is expired or no longer valid'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if coupon is applicable to the pricing plan
        if pricing_plan_id and coupon.applicable_plans.exists():
            if not coupon.applicable_plans.filter(id=pricing_plan_id).exists():
                return Response(
                    {'valid': False, 'message': 'Coupon is not applicable to this plan'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response({
            'valid': True,
            'coupon': CouponSerializer(coupon).data
        })


# ============== AUTHENTICATED USER VIEWS ==============

class CreateOrderView(APIView):
    """Create a new order"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        
        # Get pricing plan
        try:
            pricing_plan = PricingPlan.objects.get(id=data['pricing_plan_id'], is_active=True)
        except PricingPlan.DoesNotExist:
            return Response(
                {'error': 'Pricing plan not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Calculate amount
        amount = pricing_plan.price
        coupon = None
        
        # Apply coupon if provided
        if data.get('coupon_code'):
            try:
                coupon = Coupon.objects.get(code__iexact=data['coupon_code'])
                if coupon.is_valid():
                    # Check user's usage
                    user_uses = CouponUsage.objects.filter(
                        coupon=coupon, user=request.user
                    ).count()
                    
                    if user_uses < coupon.max_uses_per_user:
                        if coupon.discount_type == 'percentage':
                            discount = amount * (coupon.discount_value / 100)
                        else:
                            discount = coupon.discount_value
                        amount = max(0, amount - discount)
            except Coupon.DoesNotExist:
                pass
        
        # Get payment method
        payment_method = None
        if data.get('payment_method_id'):
            try:
                payment_method = PaymentMethod.objects.get(id=data['payment_method_id'])
            except PaymentMethod.DoesNotExist:
                pass
        
        # Create order
        order = Order.objects.create(
            user=request.user,
            pricing_plan=pricing_plan,
            amount=amount,
            currency=pricing_plan.currency,
            payment_method=payment_method,
            billing_name=data.get('billing_name', ''),
            billing_email=data.get('billing_email', request.user.email),
            billing_address=data.get('billing_address', ''),
            billing_country=data.get('billing_country', ''),
            metadata={
                'original_amount': str(pricing_plan.price),
                'coupon_code': data.get('coupon_code', '')
            }
        )
        
        # Record coupon usage
        if coupon:
            CouponUsage.objects.create(
                coupon=coupon,
                user=request.user,
                order=order
            )
            coupon.times_used += 1
            coupon.save()
        
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class UserOrdersView(generics.ListAPIView):
    """List user's orders"""
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class UserOrderDetailView(generics.RetrieveAPIView):
    """Get user's specific order details"""
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'order_id'
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class UserSubscriptionsView(generics.ListAPIView):
    """List user's subscriptions"""
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Subscription.objects.filter(user=self.request.user)


# ============== PAYPAL VIEWS ==============

class PayPalCreateOrderView(APIView):
    """Create a PayPal order for payment"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        order_id = request.data.get('order_id')
        
        if not order_id:
            return Response(
                {'error': 'Order ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            order = Order.objects.get(order_id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if order.status != 'pending':
            return Response(
                {'error': f'Order cannot be paid. Current status: {order.status}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Create PayPal order
            description = f"Code2Deploy - {order.pricing_plan.name}" if order.pricing_plan else "Code2Deploy Payment"
            
            paypal_result = paypal_service.create_order(
                amount=float(order.amount),
                currency=order.currency,
                description=description,
                order_id=order.order_id
            )
            
            # Create payment record
            payment = Payment.objects.create(
                order=order,
                provider='paypal',
                provider_payment_id=paypal_result['paypal_order_id'],
                amount=order.amount,
                currency=order.currency,
                status='pending',
                provider_response=paypal_result.get('raw_response', {})
            )
            
            # Update order status
            order.status = 'processing'
            order.save()
            
            return Response({
                'order_id': str(order.order_id),
                'paypal_order_id': paypal_result['paypal_order_id'],
                'approval_url': paypal_result['approval_url']
            })
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PayPalCaptureOrderView(APIView):
    """Capture (complete) a PayPal payment after user approval"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        order_id = request.data.get('order_id')
        paypal_order_id = request.data.get('paypal_order_id')
        
        if not order_id or not paypal_order_id:
            return Response(
                {'error': 'Both order_id and paypal_order_id are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            order = Order.objects.get(order_id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        try:
            payment = Payment.objects.get(
                order=order,
                provider_payment_id=paypal_order_id
            )
        except Payment.DoesNotExist:
            return Response(
                {'error': 'Payment record not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        try:
            # Capture the PayPal order
            capture_result = paypal_service.capture_order(paypal_order_id)
            
            if capture_result['status'] == 'COMPLETED':
                # Update payment record
                payment.provider_payer_id = capture_result.get('payer', {}).get('payer_id', '')
                payment.mark_as_completed(capture_result.get('raw_response', {}))
                
                # Enroll user in program if applicable
                if order.pricing_plan and order.pricing_plan.program:
                    from programs.models import Enrollment
                    Enrollment.objects.get_or_create(
                        user=request.user,
                        program=order.pricing_plan.program,
                        defaults={'status': 'ongoing'}
                    )
                
                return Response({
                    'success': True,
                    'message': 'Payment completed successfully',
                    'order': OrderSerializer(order).data
                })
            else:
                payment.status = 'failed'
                payment.provider_response = capture_result.get('raw_response', {})
                payment.save()
                
                order.status = 'failed'
                order.save()
                
                return Response(
                    {'error': 'Payment was not completed', 'status': capture_result['status']},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            payment.status = 'failed'
            payment.save()
            
            order.status = 'failed'
            order.save()
            
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PayPalWebhookView(APIView):
    """Handle PayPal webhooks"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        # Verify webhook signature
        # Note: In production, always verify the webhook signature
        try:
            event_type = request.data.get('event_type')
            resource = request.data.get('resource', {})
            
            if event_type == 'CHECKOUT.ORDER.APPROVED':
                # Order was approved, ready for capture
                paypal_order_id = resource.get('id')
                # You might want to notify the frontend here
                
            elif event_type == 'PAYMENT.CAPTURE.COMPLETED':
                # Payment was captured
                capture_id = resource.get('id')
                paypal_order_id = resource.get('supplementary_data', {}).get('related_ids', {}).get('order_id')
                
                if paypal_order_id:
                    try:
                        payment = Payment.objects.get(provider_payment_id=paypal_order_id)
                        if payment.status != 'completed':
                            payment.mark_as_completed(resource)
                    except Payment.DoesNotExist:
                        pass
            
            elif event_type == 'PAYMENT.CAPTURE.REFUNDED':
                # Payment was refunded
                capture_id = resource.get('id')
                # Handle refund logic
            
            return Response({'status': 'received'})
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# ============== ADMIN VIEWS ==============

class AdminOrderListView(generics.ListAPIView):
    """Admin view for all orders"""
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        queryset = Order.objects.all()
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date:
            queryset = queryset.filter(created_at__date__gte=start_date)
        if end_date:
            queryset = queryset.filter(created_at__date__lte=end_date)
        
        return queryset


class AdminOrderDetailView(generics.RetrieveUpdateAPIView):
    """Admin view for order details and updates"""
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'order_id'


class AdminPaymentStatsView(APIView):
    """Get payment statistics for admin dashboard"""
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        # Overall stats
        total_revenue = Order.objects.filter(status='paid').aggregate(
            total=Sum('amount')
        )['total'] or 0
        
        total_orders = Order.objects.count()
        paid_orders = Order.objects.filter(status='paid').count()
        pending_orders = Order.objects.filter(status='pending').count()
        failed_orders = Order.objects.filter(status='failed').count()
        refunded_orders = Order.objects.filter(status='refunded').count()
        
        return Response({
            'total_revenue': total_revenue,
            'total_orders': total_orders,
            'paid_orders': paid_orders,
            'pending_orders': pending_orders,
            'failed_orders': failed_orders,
            'refunded_orders': refunded_orders
        })


class AdminPricingPlanListCreateView(generics.ListCreateAPIView):
    """Admin view to list/create pricing plans"""
    queryset = PricingPlan.objects.all()
    serializer_class = PricingPlanSerializer
    permission_classes = [IsAdminUser]


class AdminPricingPlanDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin view for pricing plan details"""
    queryset = PricingPlan.objects.all()
    serializer_class = PricingPlanSerializer
    permission_classes = [IsAdminUser]


class AdminCouponListCreateView(generics.ListCreateAPIView):
    """Admin view to list/create coupons"""
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    permission_classes = [IsAdminUser]


class AdminCouponDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin view for coupon details"""
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    permission_classes = [IsAdminUser]


class AdminPaymentMethodListCreateView(generics.ListCreateAPIView):
    """Admin view to list/create payment methods"""
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer
    permission_classes = [IsAdminUser]


class AdminPaymentMethodDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin view for payment method details"""
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer
    permission_classes = [IsAdminUser]
