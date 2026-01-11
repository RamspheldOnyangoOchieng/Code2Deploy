/**
 * Payment Service
 * Handles all payment-related API calls
 */

import authService from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const paymentService = {
    // ============== PUBLIC METHODS ==============

    /**
     * Get all available payment methods
     */
    async getPaymentMethods() {
        const response = await fetch(`${API_BASE_URL}/payments/methods/`);
        if (!response.ok) throw new Error('Failed to fetch payment methods');
        return response.json();
    },

    /**
     * Get all pricing plans
     * @param {number} programId - Optional program ID to filter plans
     */
    async getPricingPlans(programId = null) {
        let url = `${API_BASE_URL}/payments/plans/`;
        if (programId) {
            url += `?program_id=${programId}`;
        }
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch pricing plans');
        return response.json();
    },

    /**
     * Get a specific pricing plan
     * @param {number} planId - Pricing plan ID
     */
    async getPricingPlan(planId) {
        const response = await fetch(`${API_BASE_URL}/payments/plans/${planId}/`);
        if (!response.ok) throw new Error('Failed to fetch pricing plan');
        return response.json();
    },

    /**
     * Validate a coupon code
     * @param {string} code - Coupon code
     * @param {number} pricingPlanId - Optional pricing plan ID
     */
    async validateCoupon(code, pricingPlanId = null) {
        const response = await fetch(`${API_BASE_URL}/payments/coupons/validate/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code,
                pricing_plan_id: pricingPlanId,
            }),
        });
        return response.json();
    },

    // ============== AUTHENTICATED METHODS ==============

    /**
     * Create a new order
     * @param {Object} orderData - Order creation data
     */
    async createOrder(orderData) {
        const token = authService.getToken();
        if (!token) throw new Error('Authentication required');

        const response = await fetch(`${API_BASE_URL}/payments/orders/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                pricing_plan_id: orderData.pricingPlanId,
                payment_method_id: orderData.paymentMethodId,
                coupon_code: orderData.couponCode,
                billing_name: orderData.billingName,
                billing_email: orderData.billingEmail,
                billing_address: orderData.billingAddress,
                billing_country: orderData.billingCountry,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || error.detail || 'Failed to create order');
        }
        return response.json();
    },

    /**
     * Get user's orders
     */
    async getUserOrders() {
        const token = authService.getToken();
        if (!token) throw new Error('Authentication required');

        const response = await fetch(`${API_BASE_URL}/payments/orders/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error('Failed to fetch orders');
        return response.json();
    },

    /**
     * Get a specific order by ID
     * @param {string} orderId - Order UUID
     */
    async getOrder(orderId) {
        const token = authService.getToken();
        if (!token) throw new Error('Authentication required');

        const response = await fetch(`${API_BASE_URL}/payments/orders/${orderId}/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error('Failed to fetch order');
        return response.json();
    },

    /**
     * Get user's subscriptions
     */
    async getUserSubscriptions() {
        const token = authService.getToken();
        if (!token) throw new Error('Authentication required');

        const response = await fetch(`${API_BASE_URL}/payments/subscriptions/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error('Failed to fetch subscriptions');
        return response.json();
    },

    // ============== PAYPAL METHODS ==============

    /**
     * Create a PayPal order for payment
     * @param {string} orderId - Internal order UUID
     */
    async createPayPalOrder(orderId) {
        const token = authService.getToken();
        if (!token) throw new Error('Authentication required');

        const response = await fetch(`${API_BASE_URL}/payments/paypal/create-order/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ order_id: orderId }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create PayPal order');
        }
        return response.json();
    },

    /**
     * Capture a PayPal order after user approval
     * @param {string} orderId - Internal order UUID
     * @param {string} paypalOrderId - PayPal order ID
     */
    async capturePayPalOrder(orderId, paypalOrderId) {
        const token = authService.getToken();
        if (!token) throw new Error('Authentication required');

        const response = await fetch(`${API_BASE_URL}/payments/paypal/capture-order/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                order_id: orderId,
                paypal_order_id: paypalOrderId,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to capture PayPal order');
        }
        return response.json();
    },

    // ============== ADMIN METHODS ==============

    /**
     * Get all orders (admin)
     * @param {Object} filters - Optional filters (status, start_date, end_date)
     */
    async getAdminOrders(filters = {}) {
        const token = authService.getToken();
        if (!token) throw new Error('Authentication required');

        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.startDate) params.append('start_date', filters.startDate);
        if (filters.endDate) params.append('end_date', filters.endDate);

        const url = `${API_BASE_URL}/payments/admin/orders/${params.toString() ? '?' + params.toString() : ''}`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error('Failed to fetch admin orders');
        return response.json();
    },

    /**
     * Get payment statistics (admin)
     */
    async getPaymentStats() {
        const token = authService.getToken();
        if (!token) throw new Error('Authentication required');

        const response = await fetch(`${API_BASE_URL}/payments/admin/stats/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error('Failed to fetch payment stats');
        return response.json();
    },

    /**
     * Create a pricing plan (admin)
     */
    async createPricingPlan(planData) {
        const token = authService.getToken();
        if (!token) throw new Error('Authentication required');

        const response = await fetch(`${API_BASE_URL}/payments/admin/plans/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(planData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create pricing plan');
        }
        return response.json();
    },

    /**
     * Update a pricing plan (admin)
     */
    async updatePricingPlan(planId, planData) {
        const token = authService.getToken();
        if (!token) throw new Error('Authentication required');

        const response = await fetch(`${API_BASE_URL}/payments/admin/plans/${planId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(planData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update pricing plan');
        }
        return response.json();
    },

    /**
     * Delete a pricing plan (admin)
     */
    async deletePricingPlan(planId) {
        const token = authService.getToken();
        if (!token) throw new Error('Authentication required');

        const response = await fetch(`${API_BASE_URL}/payments/admin/plans/${planId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error('Failed to delete pricing plan');
        return true;
    },

    /**
     * Get coupons (admin)
     */
    async getCoupons() {
        const token = authService.getToken();
        if (!token) throw new Error('Authentication required');

        const response = await fetch(`${API_BASE_URL}/payments/admin/coupons/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error('Failed to fetch coupons');
        return response.json();
    },

    /**
     * Create a coupon (admin)
     */
    async createCoupon(couponData) {
        const token = authService.getToken();
        if (!token) throw new Error('Authentication required');

        const response = await fetch(`${API_BASE_URL}/payments/admin/coupons/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(couponData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create coupon');
        }
        return response.json();
    },

    /**
     * Update a coupon (admin)
     */
    async updateCoupon(couponId, couponData) {
        const token = authService.getToken();
        if (!token) throw new Error('Authentication required');

        const response = await fetch(`${API_BASE_URL}/payments/admin/coupons/${couponId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(couponData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update coupon');
        }
        return response.json();
    },

    /**
     * Delete a coupon (admin)
     */
    async deleteCoupon(couponId) {
        const token = authService.getToken();
        if (!token) throw new Error('Authentication required');

        const response = await fetch(`${API_BASE_URL}/payments/admin/coupons/${couponId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error('Failed to delete coupon');
        return true;
    },

    // ============== UTILITY METHODS ==============

    /**
     * Format currency amount
     * @param {number} amount - Amount to format
     * @param {string} currency - Currency code
     */
    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    },

    /**
     * Get status badge class
     * @param {string} status - Order/payment status
     */
    getStatusBadgeClass(status) {
        const statusClasses = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            paid: 'bg-green-100 text-green-800',
            completed: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
            refunded: 'bg-purple-100 text-purple-800',
            cancelled: 'bg-gray-100 text-gray-800',
            active: 'bg-green-100 text-green-800',
            expired: 'bg-gray-100 text-gray-800',
            paused: 'bg-orange-100 text-orange-800',
        };
        return statusClasses[status] || 'bg-gray-100 text-gray-800';
    },
};

export default paymentService;
