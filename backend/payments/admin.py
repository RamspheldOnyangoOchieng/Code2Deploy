from django.contrib import admin
from .models import (
    PaymentMethod, PricingPlan, Order, Payment, 
    Subscription, Coupon, CouponUsage
)


@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ['name', 'provider', 'is_active', 'display_order']
    list_filter = ['provider', 'is_active']
    list_editable = ['is_active', 'display_order']
    search_fields = ['name', 'provider']


@admin.register(PricingPlan)
class PricingPlanAdmin(admin.ModelAdmin):
    list_display = ['name', 'program', 'price', 'currency', 'billing_cycle', 'is_active', 'is_featured']
    list_filter = ['billing_cycle', 'is_active', 'is_featured', 'currency']
    list_editable = ['is_active', 'is_featured']
    search_fields = ['name', 'program__title']
    autocomplete_fields = ['program']


class PaymentInline(admin.TabularInline):
    model = Payment
    extra = 0
    readonly_fields = ['payment_id', 'provider', 'provider_payment_id', 'amount', 'status', 'created_at']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_id', 'user', 'pricing_plan', 'amount', 'currency', 'status', 'created_at', 'paid_at']
    list_filter = ['status', 'currency', 'created_at']
    search_fields = ['order_id', 'user__email', 'billing_name', 'billing_email']
    readonly_fields = ['order_id', 'created_at', 'updated_at', 'paid_at']
    autocomplete_fields = ['user', 'pricing_plan', 'payment_method']
    inlines = [PaymentInline]
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Order Information', {
            'fields': ('order_id', 'user', 'pricing_plan', 'status')
        }),
        ('Payment Details', {
            'fields': ('amount', 'currency', 'payment_method')
        }),
        ('Billing Information', {
            'fields': ('billing_name', 'billing_email', 'billing_address', 'billing_country'),
            'classes': ('collapse',)
        }),
        ('Additional Information', {
            'fields': ('notes', 'metadata'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'paid_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['payment_id', 'order', 'provider', 'amount', 'status', 'created_at', 'completed_at']
    list_filter = ['provider', 'status', 'created_at']
    search_fields = ['payment_id', 'order__order_id', 'provider_payment_id']
    readonly_fields = ['payment_id', 'created_at', 'updated_at', 'completed_at']
    date_hierarchy = 'created_at'


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['subscription_id', 'user', 'pricing_plan', 'provider', 'status', 'current_period_end']
    list_filter = ['status', 'provider']
    search_fields = ['subscription_id', 'user__email', 'provider_subscription_id']
    readonly_fields = ['subscription_id', 'created_at', 'updated_at']
    autocomplete_fields = ['user', 'pricing_plan']


class CouponUsageInline(admin.TabularInline):
    model = CouponUsage
    extra = 0
    readonly_fields = ['user', 'order', 'used_at']


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ['code', 'discount_type', 'discount_value', 'times_used', 'max_uses', 'is_active', 'valid_until']
    list_filter = ['discount_type', 'is_active']
    list_editable = ['is_active']
    search_fields = ['code', 'description']
    filter_horizontal = ['applicable_plans']
    inlines = [CouponUsageInline]
    
    fieldsets = (
        ('Coupon Details', {
            'fields': ('code', 'description', 'discount_type', 'discount_value')
        }),
        ('Usage Limits', {
            'fields': ('max_uses', 'times_used', 'max_uses_per_user')
        }),
        ('Validity', {
            'fields': ('valid_from', 'valid_until', 'is_active')
        }),
        ('Restrictions', {
            'fields': ('minimum_order_amount', 'applicable_plans'),
            'classes': ('collapse',)
        }),
    )


@admin.register(CouponUsage)
class CouponUsageAdmin(admin.ModelAdmin):
    list_display = ['coupon', 'user', 'order', 'used_at']
    list_filter = ['used_at']
    search_fields = ['coupon__code', 'user__email']
    readonly_fields = ['used_at']
