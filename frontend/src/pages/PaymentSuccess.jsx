import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/layout';
import paymentService from '../services/paymentService';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const capturePayment = async () => {
            try {
                // Get pending order from session storage
                const pendingOrderStr = sessionStorage.getItem('pending_order');
                if (!pendingOrderStr) {
                    setError('No pending order found');
                    setLoading(false);
                    return;
                }

                const pendingOrder = JSON.parse(pendingOrderStr);

                // Capture the PayPal order
                const result = await paymentService.capturePayPalOrder(
                    pendingOrder.orderId,
                    pendingOrder.paypalOrderId
                );

                if (result.success) {
                    setSuccess(true);
                    setOrder(result.order);

                    // Clear pending order
                    sessionStorage.removeItem('pending_order');
                } else {
                    setError(result.error || 'Payment was not completed');
                }
            } catch (err) {
                setError(err.message || 'Failed to complete payment');
            } finally {
                setLoading(false);
            }
        };

        capturePayment();
    }, []);

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto p-8">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#30d9fe] border-t-transparent mx-auto mb-4"></div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Completing Your Payment...</h2>
                        <p className="text-gray-600">Please wait while we confirm your transaction.</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="fas fa-times text-4xl text-red-600"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                to="/programs"
                                className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all"
                            >
                                Browse Programs
                            </Link>
                            <Link
                                to="/contact"
                                className="px-6 py-3 bg-[#30d9fe] text-[#03325a] font-medium rounded-lg hover:bg-opacity-90 transition-all"
                            >
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
                <div className="text-center max-w-lg mx-auto p-8 bg-white rounded-2xl shadow-lg">
                    {/* Success Animation */}
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                        <i className="fas fa-check text-5xl text-green-600"></i>
                        <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping opacity-25"></div>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful! 🎉</h1>
                    <p className="text-gray-600 mb-6">
                        Thank you for your purchase. You're now enrolled and ready to start learning.
                    </p>

                    {order && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                            <h3 className="font-semibold text-gray-700 mb-2">Order Details</h3>
                            <div className="space-y-1 text-sm text-gray-600">
                                <p>
                                    <span className="font-medium">Order ID:</span>{' '}
                                    <span className="font-mono text-xs">{order.order_id}</span>
                                </p>
                                <p>
                                    <span className="font-medium">Amount:</span>{' '}
                                    {paymentService.formatCurrency(order.amount, order.currency)}
                                </p>
                                {order.pricing_plan_details && (
                                    <p>
                                        <span className="font-medium">Plan:</span>{' '}
                                        {order.pricing_plan_details.name}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Next Steps */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
                        <h3 className="font-semibold text-blue-800 mb-2">
                            <i className="fas fa-lightbulb mr-2"></i>
                            Next Steps
                        </h3>
                        <ul className="space-y-2 text-sm text-blue-700">
                            <li className="flex items-start gap-2">
                                <i className="fas fa-check-circle mt-0.5"></i>
                                Check your email for confirmation and access details
                            </li>
                            <li className="flex items-start gap-2">
                                <i className="fas fa-check-circle mt-0.5"></i>
                                Visit your dashboard to start learning
                            </li>
                            <li className="flex items-start gap-2">
                                <i className="fas fa-check-circle mt-0.5"></i>
                                Join our community to connect with other learners
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            to="/learner-dashboard"
                            className="px-6 py-3 bg-[#30d9fe] text-[#03325a] font-bold rounded-lg hover:bg-opacity-90 transition-all"
                        >
                            <i className="fas fa-graduation-cap mr-2"></i>
                            Go to Dashboard
                        </Link>
                        <Link
                            to="/programs"
                            className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all"
                        >
                            Browse More Programs
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PaymentSuccess;
