"use client";

import { useState } from 'react';
import OriginalLayout from '@/components/OriginalLayout';
import {
    CreditCardIcon,
    ShieldCheckIcon,
    RocketLaunchIcon,
    ReceiptPercentIcon,
    CurrencyDollarIcon,
    LockClosedIcon
} from '@heroicons/react/24/outline';

export default function CheckoutPage({ params }: { params: { id: string } }) {
    const [coupon, setCoupon] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('paypal');

    // Mock program
    const program = {
        title: 'Full Stack Web Development Bootcamp',
        price: 499,
        duration: '12 Weeks',
        id: params.id
    };

    return (
        <OriginalLayout>
            <div className="min-h-screen bg-slate-900 py-20 font-sans">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">Complete Your Enrollment</h1>
                        <p className="text-gray-400 text-lg">Secure your spot in the future of technology.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
                        {/* Left: Billing & Payment */}
                        <div className="lg:col-span-8 space-y-8">
                            {/* Program Summary Card (Mobile only/Quick view) */}
                            <div className="bg-[#03325a] rounded-3xl p-8 border border-[#30d9fe]/20 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
                                    <RocketLaunchIcon className="w-40 h-40 text-[#30d9fe]" />
                                </div>
                                <div className="relative z-10">
                                    <h2 className="text-[#30d9fe] font-black uppercase tracking-widest text-xs mb-2">Selected Program</h2>
                                    <h3 className="text-3xl font-bold text-white mb-4">{program.title}</h3>
                                    <div className="flex gap-6 text-sm text-gray-300">
                                        <span className="flex items-center gap-2"><CreditCardIcon className="w-4 h-4" /> Professional Tier</span>
                                        <span className="flex items-center gap-2">⏱ {program.duration}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
                                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                                    <CurrencyDollarIcon className="w-8 h-8 text-[#eec262]" />
                                    Choose Payment Method
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <PaymentMethodCard
                                        id="paypal"
                                        name="PayPal"
                                        icon="/assets/paypal-logo.png"
                                        selected={paymentMethod === 'paypal'}
                                        onClick={() => setPaymentMethod('paypal')}
                                    />
                                    <PaymentMethodCard
                                        id="stripe"
                                        name="Credit Card (via Stripe)"
                                        icon="/assets/stripe-logo.png"
                                        selected={paymentMethod === 'stripe'}
                                        onClick={() => setPaymentMethod('stripe')}
                                    />
                                    <PaymentMethodCard
                                        id="paystack"
                                        name="Paystack (Mobile Money/Card)"
                                        icon="/assets/paystack-logo.png"
                                        selected={paymentMethod === 'paystack'}
                                        onClick={() => setPaymentMethod('paystack')}
                                    />
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <TrustCard icon={LockClosedIcon} title="SSL Encrypted" desc="Your data is 100% secure" />
                                <TrustCard icon={ShieldCheckIcon} title="Verified Payments" desc="Secure transaction processing" />
                                <TrustCard icon={ReceiptPercentIcon} title="Money Back" desc="7-day satisfaction guarantee" />
                            </div>
                        </div>

                        {/* Right: Summary */}
                        <div className="lg:col-span-4">
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 sticky top-24">
                                <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal</span>
                                        <span className="text-white font-bold">${program.price}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Taxes</span>
                                        <span className="text-white font-bold">$0.00</span>
                                    </div>
                                    <div className="pt-4 border-t border-white/10">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-white">Total</span>
                                            <span className="text-3xl font-black text-[#30d9fe]">${program.price}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Coupon Code"
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#30d9fe]"
                                            value={coupon}
                                            onChange={(e) => setCoupon(e.target.value)}
                                        />
                                        <button className="px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all">Apply</button>
                                    </div>
                                    <button className="w-full py-5 bg-[#30d9fe] hover:bg-[#eec262] text-[#03325a] font-black rounded-2xl text-xl shadow-2xl shadow-[#30d9fe]/20 transition-all transform hover:-translate-y-1">
                                        Pay & Enroll Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </OriginalLayout>
    );
}

function PaymentMethodCard({ id, name, icon, selected, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-4 p-6 rounded-2xl border-2 transition-all text-left ${selected ? 'border-[#30d9fe] bg-[#30d9fe]/10' : 'border-white/5 hover:border-white/20'}`}
        >
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-2">
                {/* Fallback for missing icon assets during build */}
                <div className="text-[10px] font-bold text-gray-400 text-center">{name.split(' ')[0]}</div>
            </div>
            <span className={`font-bold ${selected ? 'text-white' : 'text-gray-400'}`}>{name}</span>
        </button>
    );
}

function TrustCard({ icon: Icon, title, desc }: any) {
    return (
        <div className="flex items-center gap-4 p-6 bg-white/5 rounded-2xl border border-white/5">
            <Icon className="w-10 h-10 text-[#30d9fe]" />
            <div>
                <p className="font-bold text-white text-sm">{title}</p>
                <p className="text-xs text-gray-500">{desc}</p>
            </div>
        </div>
    );
}
