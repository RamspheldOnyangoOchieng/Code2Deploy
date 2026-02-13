"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck, CreditCard, Zap, Tag, CheckCircle,
    ChevronRight, ArrowLeft, Lock, Globe, Smartphone,
    Package, Info, AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [selectedGateway, setSelectedGateway] = useState<"stripe" | "paystack">("stripe");
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [program, setProgram] = useState<any>(null);

    useEffect(() => {
        // Mock program fetch - replace with real API call
        setTimeout(() => {
            setProgram({
                id: params.id,
                title: "Scalable Backend with NestJS",
                price: 499,
                duration: "14 Weeks",
                image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
                category: "Backend",
            });
            setLoading(false);
        }, 1000);
    }, [params.id]);

    const handleCheckout = async () => {
        setProcessing(true);
        // This will call our NestJS API: POST /payments/intent
        // and redirect to the returned URL
        setTimeout(() => {
            alert(`Redirecting to ${selectedGateway} gateway...`);
            setProcessing(false);
        }, 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Navbar />

            <div className="pt-32 pb-20 px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Stepper / Back */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-zinc-500 hover:text-indigo-500 transition-colors font-bold text-sm mb-12"
                >
                    <ArrowLeft size={16} /> Back to Program
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Details & Forms */}
                    <div className="lg:col-span-7 space-y-10">
                        <section>
                            <h1 className="text-4xl font-black text-zinc-900 dark:text-white mb-8">Secure Checkout</h1>

                            {/* Program Summary Card */}
                            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8 shadow-xl flex gap-6">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                                    <img src={program.image} alt={program.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{program.category}</span>
                                    <h3 className="text-xl font-black text-zinc-900 dark:text-white mt-1">{program.title}</h3>
                                    <div className="flex items-center gap-4 mt-2 text-zinc-500 text-sm font-bold">
                                        <span className="flex items-center gap-1"><Package size={14} /> {program.duration}</span>
                                        <span className="flex items-center gap-1 text-emerald-500"><ShieldCheck size={14} /> Certified</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Payment Gateway Choice */}
                        <section className="space-y-6">
                            <h3 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-3">
                                <CreditCard className="text-indigo-500" />
                                Choose Payment Gateway
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    onClick={() => setSelectedGateway("stripe")}
                                    className={cn(
                                        "p-6 rounded-[2rem] border-2 transition-all flex flex-col items-start gap-4 text-left group",
                                        selectedGateway === "stripe"
                                            ? "border-indigo-600 bg-indigo-600/5 shadow-lg shadow-indigo-600/10"
                                            : "border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50"
                                    )}
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                        selectedGateway === "stripe" ? "bg-indigo-600 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                                    )}>
                                        <Globe size={20} />
                                    </div>
                                    <div>
                                        <p className="font-black text-zinc-900 dark:text-white">Stripe (Global)</p>
                                        <p className="text-xs text-zinc-500 font-bold mt-1">Best for International Cards, Apple Pay, Google Pay.</p>
                                    </div>
                                    <div className="mt-auto pt-4 flex gap-2">
                                        <div className="h-4 w-6 bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
                                        <div className="h-4 w-6 bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
                                        <div className="h-4 w-6 bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
                                    </div>
                                </button>

                                <button
                                    onClick={() => setSelectedGateway("paystack")}
                                    className={cn(
                                        "p-6 rounded-[2rem] border-2 transition-all flex flex-col items-start gap-4 text-left group",
                                        selectedGateway === "paystack"
                                            ? "border-emerald-600 bg-emerald-600/5 shadow-lg shadow-emerald-600/10"
                                            : "border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50"
                                    )}
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                        selectedGateway === "paystack" ? "bg-emerald-600 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                                    )}>
                                        <Smartphone size={20} />
                                    </div>
                                    <div>
                                        <p className="font-black text-zinc-900 dark:text-white">Paystack (Africa)</p>
                                        <p className="text-xs text-zinc-500 font-bold mt-1">Faster for MPESA, Bank Transfers & African Cards.</p>
                                    </div>
                                    <div className="mt-auto pt-4 flex gap-2">
                                        <div className="h-4 w-6 bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
                                        <div className="h-4 w-6 bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
                                    </div>
                                </button>
                            </div>
                        </section>

                        {/* Promo Code Section */}
                        <div className="bg-zinc-100 dark:bg-zinc-900/50 p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800">
                            <h4 className="text-sm font-black text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                                <Tag size={16} className="text-indigo-500" /> Have a promo code?
                            </h4>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    placeholder="ENTER CODE"
                                    className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm tracking-widest"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                />
                                <button className="px-8 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black rounded-2xl text-sm transition-all hover:scale-95 active:scale-90">
                                    APPLY
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary (Sticky) */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-32 space-y-6">
                            <div className="bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 p-10 shadow-2xl">
                                <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-8 pb-8 border-b border-zinc-100 dark:border-zinc-800">Order Summary</h3>

                                <div className="space-y-4 mb-10">
                                    <div className="flex justify-between items-center text-sm font-bold text-zinc-600 dark:text-zinc-400">
                                        <span>Subtotal</span>
                                        <span>${program.price}.00</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-bold text-emerald-500">
                                        <span>Discount</span>
                                        <span>-$0.00</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-bold text-zinc-600 dark:text-zinc-400">
                                        <span>Platform Fee</span>
                                        <span>$0.00</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-end mb-10">
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Total Amount</p>
                                        <p className="text-4xl font-black text-zinc-900 dark:text-white">${program.price}.00</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">
                                            <Lock size={10} /> Secure
                                        </div>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Encrypted by AES-256</p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={processing}
                                    className={cn(
                                        "w-full py-6 rounded-[2rem] font-black text-lg transition-all flex items-center justify-center gap-3",
                                        selectedGateway === "stripe"
                                            ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xl shadow-indigo-600/30"
                                            : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl shadow-emerald-600/30"
                                    )}
                                >
                                    {processing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Initializing...
                                        </>
                                    ) : (
                                        <>
                                            Complete Enrollment <ChevronRight size={20} />
                                        </>
                                    )}
                                </button>

                                <div className="mt-8 flex flex-col gap-4">
                                    <div className="flex items-start gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                        <CheckCircle className="text-emerald-500 mt-1 flex-shrink-0" size={16} />
                                        <div>
                                            <p className="text-xs font-black text-zinc-900 dark:text-white">Lifetime Access</p>
                                            <p className="text-[10px] text-zinc-500 font-bold">You'll have permanent access to all materials.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                        <Zap className="text-amber-500 mt-1 flex-shrink-0" size={16} />
                                        <div>
                                            <p className="text-xs font-black text-zinc-900 dark:text-white">Immediate Setup</p>
                                            <p className="text-[10px] text-zinc-500 font-bold">Dashboard unlocks instantly after payment.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-4 py-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default">
                                <ShieldCheck size={20} className="text-zinc-400" />
                                <Lock size={20} className="text-zinc-400" />
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">SSL SECURED PAYMENT</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
