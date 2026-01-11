import React, { useState, useEffect } from 'react';
import paymentService from '../../services/paymentService';
import { useToast } from '../../contexts/ToastContext';

const AdminPayments = () => {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('orders');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Data states
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState(null);
    const [coupons, setCoupons] = useState([]);
    const [pricingPlans, setPricingPlans] = useState([]);

    // Filter states
    const [statusFilter, setStatusFilter] = useState('');

    // Modal states
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [showCouponModal, setShowCouponModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [editingCoupon, setEditingCoupon] = useState(null);

    // Fetch data
    useEffect(() => {
        fetchData();
    }, [activeTab, statusFilter]);

    const fetchData = async () => {
        setLoading(true);
        setError('');

        try {
            if (activeTab === 'orders' || activeTab === 'stats') {
                const [ordersData, statsData] = await Promise.all([
                    paymentService.getAdminOrders({ status: statusFilter }),
                    paymentService.getPaymentStats()
                ]);
                setOrders(ordersData.results || ordersData || []);
                setStats(statsData);
            } else if (activeTab === 'plans') {
                const plansData = await paymentService.getPricingPlans();
                setPricingPlans(plansData.results || plansData || []);
            } else if (activeTab === 'coupons') {
                const couponsData = await paymentService.getCoupons();
                setCoupons(couponsData.results || couponsData || []);
            }
        } catch (err) {
            toast.error(err.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${paymentService.getStatusBadgeClass(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );

    // Stats Card Component
    const StatsCard = ({ title, value, icon, color, subtext }) => (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className={`text-2xl font-bold ${color}`}>{value}</p>
                    {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
                </div>
                <div className={`w-12 h-12 rounded-full ${color.replace('text-', 'bg-').replace('800', '100')} flex items-center justify-center`}>
                    <i className={`fas ${icon} ${color}`}></i>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Payments & Billing</h2>
                    <p className="text-gray-500 text-sm">Manage orders, pricing plans, and coupons</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
                {[
                    { id: 'orders', label: 'Orders', icon: 'fa-shopping-cart' },
                    { id: 'stats', label: 'Statistics', icon: 'fa-chart-bar' },
                    { id: 'plans', label: 'Pricing Plans', icon: 'fa-tags' },
                    { id: 'coupons', label: 'Coupons', icon: 'fa-ticket-alt' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === tab.id
                            ? 'bg-[#30d9fe] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <i className={`fas ${tab.icon} mr-2`}></i>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Loading */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#30d9fe] border-t-transparent"></div>
                </div>
            ) : (
                <>
                    {/* Stats Tab */}
                    {activeTab === 'stats' && stats && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                            <StatsCard
                                title="Total Revenue"
                                value={paymentService.formatCurrency(stats.total_revenue || 0)}
                                icon="fa-dollar-sign"
                                color="text-green-800"
                            />
                            <StatsCard
                                title="Total Orders"
                                value={stats.total_orders || 0}
                                icon="fa-shopping-cart"
                                color="text-blue-800"
                            />
                            <StatsCard
                                title="Paid Orders"
                                value={stats.paid_orders || 0}
                                icon="fa-check-circle"
                                color="text-green-800"
                            />
                            <StatsCard
                                title="Pending Orders"
                                value={stats.pending_orders || 0}
                                icon="fa-clock"
                                color="text-yellow-800"
                            />
                            <StatsCard
                                title="Failed/Refunded"
                                value={(stats.failed_orders || 0) + (stats.refunded_orders || 0)}
                                icon="fa-times-circle"
                                color="text-red-800"
                            />
                        </div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Filters */}
                            <div className="p-4 border-b border-gray-200 flex flex-wrap gap-4">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="paid">Paid</option>
                                    <option value="failed">Failed</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                            </div>

                            {/* Orders Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orders.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                                    <i className="fas fa-inbox text-4xl mb-3 block"></i>
                                                    No orders found
                                                </td>
                                            </tr>
                                        ) : (
                                            orders.map((order) => (
                                                <tr key={order.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="font-mono text-xs text-gray-600">
                                                            {order.order_id?.substring(0, 8)}...
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">{order.billing_name || 'N/A'}</p>
                                                            <p className="text-xs text-gray-500">{order.user_email}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {order.pricing_plan_details?.name || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {paymentService.formatCurrency(order.amount, order.currency)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getStatusBadge(order.status)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Pricing Plans Tab */}
                    {activeTab === 'plans' && (
                        <div className="space-y-4">
                            <div className="flex justify-end">
                                <button
                                    onClick={() => { setEditingPlan(null); setShowPlanModal(true); }}
                                    className="px-4 py-2 bg-[#30d9fe] text-white font-medium rounded-lg hover:bg-[#00b8d4] transition-colors"
                                >
                                    <i className="fas fa-plus mr-2"></i>Add Plan
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pricingPlans.length === 0 ? (
                                    <div className="col-span-full text-center py-12 text-gray-500">
                                        <i className="fas fa-tags text-4xl mb-3 block"></i>
                                        No pricing plans found
                                    </div>
                                ) : (
                                    pricingPlans.map((plan) => (
                                        <div key={plan.id} className={`bg-white rounded-xl shadow-sm border-2 ${plan.is_featured ? 'border-[#30d9fe]' : 'border-gray-100'} p-6 relative`}>
                                            {plan.is_featured && (
                                                <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-[#30d9fe] text-white text-xs font-bold rounded-full">
                                                    Featured
                                                </span>
                                            )}
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                            <p className="text-sm text-gray-500 mb-4">{plan.program_title || 'General'}</p>
                                            <div className="mb-4">
                                                <span className="text-3xl font-bold text-[#03325a]">
                                                    {paymentService.formatCurrency(plan.price, plan.currency)}
                                                </span>
                                                <span className="text-gray-500 text-sm ml-1">
                                                    /{plan.billing_cycle === 'one_time' ? 'once' : plan.billing_cycle}
                                                </span>
                                            </div>
                                            {plan.discount_percentage > 0 && (
                                                <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full mb-4">
                                                    {plan.discount_percentage}% OFF
                                                </span>
                                            )}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => { setEditingPlan(plan); setShowPlanModal(true); }}
                                                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                                                >
                                                    <i className="fas fa-edit mr-1"></i>Edit
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        if (confirm('Delete this plan?')) {
                                                            await paymentService.deletePricingPlan(plan.id);
                                                            fetchData();
                                                        }
                                                    }}
                                                    className="px-3 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* Coupons Tab */}
                    {activeTab === 'coupons' && (
                        <div className="space-y-4">
                            <div className="flex justify-end">
                                <button
                                    onClick={() => { setEditingCoupon(null); setShowCouponModal(true); }}
                                    className="px-4 py-2 bg-[#30d9fe] text-white font-medium rounded-lg hover:bg-[#00b8d4] transition-colors"
                                >
                                    <i className="fas fa-plus mr-2"></i>Add Coupon
                                </button>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valid Until</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {coupons.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                                    <i className="fas fa-ticket-alt text-4xl mb-3 block"></i>
                                                    No coupons found
                                                </td>
                                            </tr>
                                        ) : (
                                            coupons.map((coupon) => (
                                                <tr key={coupon.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="font-mono font-bold text-[#03325a]">{coupon.code}</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {coupon.discount_type === 'percentage'
                                                            ? `${coupon.discount_value}%`
                                                            : paymentService.formatCurrency(coupon.discount_value)
                                                        }
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {coupon.times_used} / {coupon.max_uses || '∞'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {coupon.valid_until
                                                            ? new Date(coupon.valid_until).toLocaleDateString()
                                                            : 'No expiry'
                                                        }
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${coupon.is_active && coupon.is_valid
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {coupon.is_active && coupon.is_valid ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <button
                                                            onClick={() => { setEditingCoupon(coupon); setShowCouponModal(true); }}
                                                            className="text-[#30d9fe] hover:text-[#00b8d4] mr-3"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button
                                                            onClick={async () => {
                                                                if (confirm('Delete this coupon?')) {
                                                                    await paymentService.deleteCoupon(coupon.id);
                                                                    fetchData();
                                                                }
                                                            }}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminPayments;
