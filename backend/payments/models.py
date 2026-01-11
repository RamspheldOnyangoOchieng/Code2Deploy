from django.db import models
from django.conf import settings
from django.utils import timezone
import uuid


class PaymentMethod(models.Model):
    """Supported payment methods"""
    PROVIDER_CHOICES = [
        ('paypal', 'PayPal'),
        ('stripe', 'Stripe'),
        ('mpesa', 'M-Pesa'),
        ('bank_transfer', 'Bank Transfer'),
    ]
    
    name = models.CharField(max_length=100)
    provider = models.CharField(max_length=50, choices=PROVIDER_CHOICES)
    is_active = models.BooleanField(default=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=100, blank=True, help_text='Font Awesome icon class')
    display_order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['display_order', 'name']
    
    def __str__(self):
        return self.name


class PricingPlan(models.Model):
    """Pricing plans for programs and services"""
    BILLING_CYCLE_CHOICES = [
        ('one_time', 'One-Time Payment'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('yearly', 'Yearly'),
    ]
    
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    billing_cycle = models.CharField(max_length=20, choices=BILLING_CYCLE_CHOICES, default='one_time')
    
    # Optional: Link to specific program or make it a general service
    program = models.ForeignKey(
        'programs.Program', 
        on_delete=models.CASCADE, 
        related_name='pricing_plans',
        null=True, 
        blank=True
    )
    
    # Features included in this plan
    features = models.JSONField(default=list, blank=True, help_text='List of features included')
    
    # Discounts
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    discount_percentage = models.IntegerField(default=0)
    
    # Validity
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['price']
    
    def __str__(self):
        if self.program:
            return f"{self.program.title} - {self.name}"
        return self.name


class Order(models.Model):
    """Orders for programs and services"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
        ('cancelled', 'Cancelled'),
    ]
    
    order_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    pricing_plan = models.ForeignKey(PricingPlan, on_delete=models.SET_NULL, null=True)
    
    # Order details
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Payment details
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Billing info (optional)
    billing_name = models.CharField(max_length=200, blank=True)
    billing_email = models.EmailField(blank=True)
    billing_address = models.TextField(blank=True)
    billing_country = models.CharField(max_length=100, blank=True)
    
    # Metadata
    notes = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Order {self.order_id} - {self.user.email}"
    
    def mark_as_paid(self):
        self.status = 'paid'
        self.paid_at = timezone.now()
        self.save()


class Payment(models.Model):
    """Individual payment transactions"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]
    
    payment_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments')
    
    # Payment provider details
    provider = models.CharField(max_length=50)  # paypal, stripe, mpesa, etc.
    provider_payment_id = models.CharField(max_length=255, blank=True)  # PayPal order ID, etc.
    provider_payer_id = models.CharField(max_length=255, blank=True)
    
    # Transaction details
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Response from payment provider
    provider_response = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Payment {self.payment_id} - {self.status}"
    
    def mark_as_completed(self, provider_response=None):
        self.status = 'completed'
        self.completed_at = timezone.now()
        if provider_response:
            self.provider_response = provider_response
        self.save()
        
        # Also mark the order as paid
        self.order.mark_as_paid()


class Subscription(models.Model):
    """Recurring subscriptions"""
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('cancelled', 'Cancelled'),
        ('expired', 'Expired'),
        ('paused', 'Paused'),
    ]
    
    subscription_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='subscriptions')
    pricing_plan = models.ForeignKey(PricingPlan, on_delete=models.SET_NULL, null=True)
    
    # Provider subscription details
    provider = models.CharField(max_length=50)
    provider_subscription_id = models.CharField(max_length=255, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    
    # Billing cycle
    current_period_start = models.DateTimeField()
    current_period_end = models.DateTimeField()
    
    # Cancellation
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancel_at_period_end = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Subscription {self.subscription_id} - {self.user.email}"


class Coupon(models.Model):
    """Discount coupons"""
    DISCOUNT_TYPE_CHOICES = [
        ('percentage', 'Percentage'),
        ('fixed', 'Fixed Amount'),
    ]
    
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPE_CHOICES)
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Usage limits
    max_uses = models.IntegerField(null=True, blank=True)
    times_used = models.IntegerField(default=0)
    max_uses_per_user = models.IntegerField(default=1)
    
    # Validity
    valid_from = models.DateTimeField()
    valid_until = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    # Restrictions
    minimum_order_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    applicable_plans = models.ManyToManyField(PricingPlan, blank=True, related_name='coupons')
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.code
    
    def is_valid(self):
        now = timezone.now()
        if not self.is_active:
            return False
        if now < self.valid_from:
            return False
        if self.valid_until and now > self.valid_until:
            return False
        if self.max_uses and self.times_used >= self.max_uses:
            return False
        return True


class CouponUsage(models.Model):
    """Track coupon usage by users"""
    coupon = models.ForeignKey(Coupon, on_delete=models.CASCADE, related_name='usages')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    used_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['coupon', 'order']
