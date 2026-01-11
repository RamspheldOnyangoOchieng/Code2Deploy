import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/layout';
import paymentService from '../services/paymentService';
import authService from '../services/authService';

const Checkout = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Get plan ID from URL
    const planId = searchParams.get('plan');

    // State
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Coupon state
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState('');

    // Billing state
    const [billingData, setBillingData] = useState({
        name: '',
        email: '',
        address: '',
        country: '',
    });

    // Check authentication
    useEffect(() => {
        if (!authService.isAuthenticated()) {
            navigate('/?login=true&redirect=/checkout?plan=' + planId);
            return;
        }

        // Pre-fill email from user
        authService.getCurrentUser().then(user => {
            if (user) {
                setBillingData(prev => ({
                    ...prev,
                    email: user.email || '',
                    name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
                }));
            }
        });
    }, [planId, navigate]);

    // Fetch plan details
    useEffect(() => {
        if (!planId) {
            setError('No plan selected');
            setLoading(false);
            return;
        }

        const fetchPlan = async () => {
            try {
                const planData = await paymentService.getPricingPlan(planId);
                setPlan(planData);
            } catch (err) {
                setError('Failed to load plan details');
            } finally {
                setLoading(false);
            }
        };

        fetchPlan();
    }, [planId]);

    // Calculate total
    const calculateTotal = () => {
        if (!plan) return 0;

        let total = parseFloat(plan.price);

        if (appliedCoupon) {
            if (appliedCoupon.discount_type === 'percentage') {
                total -= total * (appliedCoupon.discount_value / 100);
            } else {
                total -= parseFloat(appliedCoupon.discount_value);
            }
        }

        return Math.max(0, total);
    };

    // Apply coupon
    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;

        setCouponLoading(true);
        setCouponError('');

        try {
            const result = await paymentService.validateCoupon(couponCode, planId);

            if (result.valid) {
                setAppliedCoupon(result.coupon);
            } else {
                setCouponError(result.message || 'Invalid coupon');
            }
        } catch (err) {
            setCouponError('Failed to validate coupon');
        } finally {
            setCouponLoading(false);
        }
    };

    // Remove coupon
    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponError('');
    };

    // Handle PayPal checkout
    const handlePayPalCheckout = async () => {
        setProcessing(true);
        setError('');

        try {
            // Step 1: Create order
            const order = await paymentService.createOrder({
                pricingPlanId: plan.id,
                couponCode: appliedCoupon?.code,
                billingName: billingData.name,
                billingEmail: billingData.email,
                billingAddress: billingData.address,
                billingCountry: billingData.country,
            });

            // Step 2: Create PayPal order
            const paypalOrder = await paymentService.createPayPalOrder(order.order_id);

            // Step 3: Redirect to PayPal for approval
            if (paypalOrder.approval_url) {
                // Store order info for callback
                sessionStorage.setItem('pending_order', JSON.stringify({
                    orderId: order.order_id,
                    paypalOrderId: paypalOrder.paypal_order_id,
                }));

                // Redirect to PayPal
                window.location.href = paypalOrder.approval_url;
            } else {
                throw new Error('Failed to get PayPal approval URL');
            }
        } catch (err) {
            setError(err.message || 'Failed to process payment');
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#30d9fe] border-t-transparent mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading checkout...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error && !plan) {
        return (
            <Layout>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto p-8">
                        <i className="fas fa-exclamation-circle text-6xl text-red-400 mb-4"></i>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <Link
                            to="/programs"
                            className="px-6 py-3 bg-[#30d9fe] text-[#03325a] font-medium rounded-lg hover:bg-opacity-90 transition-all"
                        >
                            Browse Programs
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }

    if (success) {
        return (
            <Layout>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="fas fa-check text-4xl text-green-600"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
                        <p className="text-gray-600 mb-6">Thank you for your purchase. You're now enrolled in the program.</p>
                        <Link
                            to="/learner-dashboard"
                            className="px-6 py-3 bg-[#30d9fe] text-[#03325a] font-medium rounded-lg hover:bg-opacity-90 transition-all"
                        >
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    {/* Header */}
                    <div className="mb-8">
                        <Link to="/programs" className="text-[#30d9fe] hover:text-[#03325a] transition-colors mb-4 inline-flex items-center">
                            <i className="fas fa-arrow-left mr-2"></i>
                            Back to Programs
                        </Link>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#03325a] mt-4">Checkout</h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Order Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Plan Summary */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-4">
                                    <i className="fas fa-shopping-cart text-[#30d9fe] mr-2"></i>
                                    Order Summary
                                </h2>

                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="w-16 h-16 bg-gradient-to-br from-[#30d9fe] to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <i className="fas fa-graduation-cap text-white text-2xl"></i>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-800">{plan?.name}</h3>
                                        {plan?.program_title && (
                                            <p className="text-sm text-gray-600">{plan.program_title}</p>
                                        )}
                                        <p className="text-sm text-gray-500 mt-1">{plan?.description}</p>
                                        <div className="mt-2">
                                            <span className="inline-block px-2 py-1 text-xs font-medium bg-[#30d9fe]/10 text-[#03325a] rounded">
                                                {plan?.billing_cycle === 'one_time' ? 'One-time Payment' : plan?.billing_cycle}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {plan?.original_price && parseFloat(plan.original_price) > parseFloat(plan.price) && (
                                            <p className="text-sm text-gray-400 line-through">
                                                {paymentService.formatCurrency(plan.original_price, plan.currency)}
                                            </p>
                                        )}
                                        <p className="text-xl font-bold text-[#03325a]">
                                            {paymentService.formatCurrency(plan?.price, plan?.currency)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Coupon Code */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-4">
                                    <i className="fas fa-tag text-[#30d9fe] mr-2"></i>
                                    Discount Code
                                </h2>

                                {appliedCoupon ? (
                                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                                        <div className="flex items-center gap-3">
                                            <i className="fas fa-check-circle text-green-600"></i>
                                            <div>
                                                <p className="font-medium text-green-800">{appliedCoupon.code}</p>
                                                <p className="text-sm text-green-600">
                                                    {appliedCoupon.discount_type === 'percentage'
                                                        ? `${appliedCoupon.discount_value}% off`
                                                        : `${paymentService.formatCurrency(appliedCoupon.discount_value)} off`
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleRemoveCoupon}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            placeholder="Enter coupon code"
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent"
                                        />
                                        <button
                                            onClick={handleApplyCoupon}
                                            disabled={couponLoading || !couponCode.trim()}
                                            className="px-4 py-2 bg-[#03325a] text-white font-medium rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50"
                                        >
                                            {couponLoading ? (
                                                <i className="fas fa-spinner fa-spin"></i>
                                            ) : (
                                                'Apply'
                                            )}
                                        </button>
                                    </div>
                                )}

                                {couponError && (
                                    <p className="mt-2 text-sm text-red-600">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {couponError}
                                    </p>
                                )}
                            </div>

                            {/* Billing Information */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-4">
                                    <i className="fas fa-user text-[#30d9fe] mr-2"></i>
                                    Billing Information
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={billingData.name}
                                            onChange={(e) => setBillingData({ ...billingData, name: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={billingData.email}
                                            onChange={(e) => setBillingData({ ...billingData, email: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address (Optional)</label>
                                        <input
                                            type="text"
                                            value={billingData.address}
                                            onChange={(e) => setBillingData({ ...billingData, address: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                        <select
                                            value={billingData.country}
                                            onChange={(e) => setBillingData({ ...billingData, country: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent"
                                        >
                                            <option value="">Select Country</option>
                                            <option value="KE">Kenya</option>
                                            <option value="UG">Uganda</option>
                                            <option value="TZ">Tanzania</option>
                                            <option value="NG">Nigeria</option>
                                            <option value="GH">Ghana</option>
                                            <option value="ZA">South Africa</option>
                                            <option value="US">United States</option>
                                            <option value="UK">United Kingdom</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Payment */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                                <h2 className="text-lg font-bold text-gray-800 mb-4">Payment Summary</h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>{paymentService.formatCurrency(plan?.price, plan?.currency)}</span>
                                    </div>

                                    {appliedCoupon && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount</span>
                                            <span>
                                                -
                                                {appliedCoupon.discount_type === 'percentage'
                                                    ? paymentService.formatCurrency(parseFloat(plan?.price) * appliedCoupon.discount_value / 100, plan?.currency)
                                                    : paymentService.formatCurrency(appliedCoupon.discount_value, plan?.currency)
                                                }
                                            </span>
                                        </div>
                                    )}

                                    <div className="border-t pt-3">
                                        <div className="flex justify-between text-xl font-bold text-[#03325a]">
                                            <span>Total</span>
                                            <span>{paymentService.formatCurrency(calculateTotal(), plan?.currency)}</span>
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-sm text-red-600">
                                            <i className="fas fa-exclamation-circle mr-1"></i>
                                            {error}
                                        </p>
                                    </div>
                                )}

                                {/* PayPal Button */}
                                <button
                                    onClick={handlePayPalCheckout}
                                    disabled={processing}
                                    className="w-full py-3 bg-[#0070ba] text-white font-bold rounded-lg hover:bg-[#005a95] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin"></i>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fab fa-paypal text-xl"></i>
                                            Pay with PayPal
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-gray-500 text-center mt-4">
                                    <i className="fas fa-lock mr-1"></i>
                                    Secured by PayPal. Your payment info is protected.
                                </p>

                                {/* Features */}
                                {plan?.features && plan.features.length > 0 && (
                                    <div className="mt-6 pt-6 border-t">
                                        <h3 className="text-sm font-bold text-gray-700 mb-3">What's Included:</h3>
                                        <ul className="space-y-2">
                                            {plan.features.map((feature, index) => (
                                                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                                    <i className="fas fa-check text-green-500 mt-0.5"></i>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Checkout;
