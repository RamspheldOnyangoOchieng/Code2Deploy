from django.urls import path
from . import views

app_name = 'payments'

urlpatterns = [
    # ============== PUBLIC ENDPOINTS ==============
    # Payment methods
    path('methods/', views.PaymentMethodListView.as_view(), name='payment-methods'),
    
    # Pricing plans
    path('plans/', views.PricingPlanListView.as_view(), name='pricing-plans'),
    path('plans/<int:pk>/', views.PricingPlanDetailView.as_view(), name='pricing-plan-detail'),
    
    # Coupon validation
    path('coupons/validate/', views.ValidateCouponView.as_view(), name='validate-coupon'),
    
    # ============== AUTHENTICATED USER ENDPOINTS ==============
    # Orders
    path('orders/', views.UserOrdersView.as_view(), name='user-orders'),
    path('orders/create/', views.CreateOrderView.as_view(), name='create-order'),
    path('orders/<uuid:order_id>/', views.UserOrderDetailView.as_view(), name='order-detail'),
    
    # Subscriptions
    path('subscriptions/', views.UserSubscriptionsView.as_view(), name='user-subscriptions'),
    
    # ============== PAYPAL ENDPOINTS ==============
    path('paypal/create-order/', views.PayPalCreateOrderView.as_view(), name='paypal-create-order'),
    path('paypal/capture-order/', views.PayPalCaptureOrderView.as_view(), name='paypal-capture-order'),
    path('paypal/webhook/', views.PayPalWebhookView.as_view(), name='paypal-webhook'),
    
    # ============== ADMIN ENDPOINTS ==============
    path('admin/orders/', views.AdminOrderListView.as_view(), name='admin-orders'),
    path('admin/orders/<uuid:order_id>/', views.AdminOrderDetailView.as_view(), name='admin-order-detail'),
    path('admin/stats/', views.AdminPaymentStatsView.as_view(), name='admin-payment-stats'),
    
    # Admin pricing plans
    path('admin/plans/', views.AdminPricingPlanListCreateView.as_view(), name='admin-pricing-plans'),
    path('admin/plans/<int:pk>/', views.AdminPricingPlanDetailView.as_view(), name='admin-pricing-plan-detail'),
    
    # Admin coupons
    path('admin/coupons/', views.AdminCouponListCreateView.as_view(), name='admin-coupons'),
    path('admin/coupons/<int:pk>/', views.AdminCouponDetailView.as_view(), name='admin-coupon-detail'),
    
    # Admin payment methods
    path('admin/methods/', views.AdminPaymentMethodListCreateView.as_view(), name='admin-payment-methods'),
    path('admin/methods/<int:pk>/', views.AdminPaymentMethodDetailView.as_view(), name='admin-payment-method-detail'),
]
