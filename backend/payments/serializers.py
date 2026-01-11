from rest_framework import serializers
from .models import (
    PaymentMethod, PricingPlan, Order, Payment, 
    Subscription, Coupon, CouponUsage
)


class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = ['id', 'name', 'provider', 'is_active', 'description', 'icon', 'display_order']


class PricingPlanSerializer(serializers.ModelSerializer):
    program_title = serializers.CharField(source='program.title', read_only=True)
    savings = serializers.SerializerMethodField()
    
    class Meta:
        model = PricingPlan
        fields = [
            'id', 'name', 'description', 'price', 'currency', 
            'billing_cycle', 'program', 'program_title', 'features',
            'original_price', 'discount_percentage', 'savings',
            'is_active', 'is_featured', 'created_at'
        ]
    
    def get_savings(self, obj):
        if obj.original_price and obj.original_price > obj.price:
            return float(obj.original_price - obj.price)
        return 0


class OrderSerializer(serializers.ModelSerializer):
    pricing_plan_details = PricingPlanSerializer(source='pricing_plan', read_only=True)
    payment_method_details = PaymentMethodSerializer(source='payment_method', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_id', 'user', 'user_email', 'pricing_plan', 
            'pricing_plan_details', 'amount', 'currency', 'status',
            'payment_method', 'payment_method_details',
            'billing_name', 'billing_email', 'billing_address', 'billing_country',
            'notes', 'metadata', 'created_at', 'updated_at', 'paid_at'
        ]
        read_only_fields = ['order_id', 'user', 'paid_at']


class PaymentSerializer(serializers.ModelSerializer):
    order_id = serializers.UUIDField(source='order.order_id', read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id', 'payment_id', 'order', 'order_id', 'provider',
            'provider_payment_id', 'provider_payer_id',
            'amount', 'currency', 'status',
            'created_at', 'completed_at'
        ]
        read_only_fields = ['payment_id', 'completed_at']


class SubscriptionSerializer(serializers.ModelSerializer):
    pricing_plan_details = PricingPlanSerializer(source='pricing_plan', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Subscription
        fields = [
            'id', 'subscription_id', 'user', 'user_email',
            'pricing_plan', 'pricing_plan_details',
            'provider', 'provider_subscription_id', 'status',
            'current_period_start', 'current_period_end',
            'cancelled_at', 'cancel_at_period_end',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['subscription_id', 'user']


class CouponSerializer(serializers.ModelSerializer):
    is_valid = serializers.SerializerMethodField()
    
    class Meta:
        model = Coupon
        fields = [
            'id', 'code', 'description', 'discount_type', 'discount_value',
            'max_uses', 'times_used', 'max_uses_per_user',
            'valid_from', 'valid_until', 'is_active', 'is_valid',
            'minimum_order_amount', 'applicable_plans'
        ]
    
    def get_is_valid(self, obj):
        return obj.is_valid()


class CouponValidationSerializer(serializers.Serializer):
    """Serializer for validating a coupon code"""
    code = serializers.CharField(max_length=50)
    pricing_plan_id = serializers.IntegerField(required=False)


class CreateOrderSerializer(serializers.Serializer):
    """Serializer for creating a new order"""
    pricing_plan_id = serializers.IntegerField()
    payment_method_id = serializers.IntegerField(required=False)
    coupon_code = serializers.CharField(max_length=50, required=False)
    billing_name = serializers.CharField(max_length=200, required=False)
    billing_email = serializers.EmailField(required=False)
    billing_address = serializers.CharField(required=False)
    billing_country = serializers.CharField(max_length=100, required=False)


class PayPalCreateOrderSerializer(serializers.Serializer):
    """Serializer for PayPal order creation response"""
    order_id = serializers.UUIDField()
    paypal_order_id = serializers.CharField()
    approval_url = serializers.URLField()


class PayPalCaptureSerializer(serializers.Serializer):
    """Serializer for capturing PayPal payment"""
    order_id = serializers.UUIDField()
    paypal_order_id = serializers.CharField()


class PaymentStatsSerializer(serializers.Serializer):
    """Serializer for payment statistics"""
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_orders = serializers.IntegerField()
    paid_orders = serializers.IntegerField()
    pending_orders = serializers.IntegerField()
    failed_orders = serializers.IntegerField()
    refunded_orders = serializers.IntegerField()
