"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, GraduationCap, Users, ShieldCheck, Heart, ArrowRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const BENEFITS = [
    {
        title: "100% Tuition Waiver",
        description: "Covering the full cost of your chosen tech program, from beginner to advanced levels.",
        icon: Sparkles
    },
    {
        title: "Exclusive Mentorship",
        description: "Personal 1-on-1 guidance from senior engineers at top-tier global tech companies.",
        icon: Users
    },
    {
        title: "Career Placement",
        description: "Direct referrals and placement assistance into our partner hiring network.",
        icon: ShieldCheck
    }
];

export default function ScholarshipsPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        background: "",
        interests: "",
        reason: ""
    });

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-8"
                        >
                            <Heart size={16} fill="currentColor" />
                            <span>Accessibility in Tech initiative</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl sm:text-7xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.1]"
                        >
                            Your Future is <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Priceless.</span> Let's Fund It.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mt-8 text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto"
                        >
                            We believe talent is distributed equally, but opportunity is not. Our scholarship program bridges that gap for passionate builders.
                        </motion.p>
                    </div>
                </div>

                {/* Background Gradients */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
            </section>

            {/* Benefits Grid */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {BENEFITS.map((benefit, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={benefit.title}
                            className="bg-white dark:bg-zinc-900 p-10 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm"
                        >
                            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 mb-8">
                                <benefit.icon size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">{benefit.title}</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">{benefit.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Main Content Split */}
            <section className="py-24 bg-white dark:bg-zinc-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                        <div>
                            <h2 className="text-4xl font-black text-zinc-900 dark:text-white mb-8">Who should apply?</h2>
                            <div className="space-y-6">
                                {[
                                    "Passionate innovators from underrepresented communities.",
                                    "Self-taught developers looking for a structured leap.",
                                    "Talented students facing financial barriers to high-end tech education.",
                                    "Dedicated builders with a strong GitHub presence or portfolio."
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="flex-shrink-0 mt-1">
                                            <CheckCircle2 size={24} className="text-emerald-500" />
                                        </div>
                                        <p className="text-zinc-700 dark:text-zinc-300 font-medium">{item}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl p-8 border border-zinc-100 dark:border-zinc-800">
                                <div className="flex gap-4 items-center mb-4">
                                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                                        <GraduationCap size={20} />
                                    </div>
                                    <span className="font-bold text-zinc-900 dark:text-white">Scholarship Stats</span>
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <div className="text-3xl font-black text-indigo-600">$2.4M+</div>
                                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Total Funded</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-black text-indigo-600">450+</div>
                                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Beneficiaries</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Application Form */}
                        <div className="bg-zinc-50 dark:bg-zinc-950 rounded-[3rem] p-8 sm:p-12 border border-zinc-200 dark:border-zinc-800 shadow-2xl relative">
                            {submitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-12"
                                >
                                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
                                        <Zap size={40} fill="currentColor" />
                                    </div>
                                    <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-4">Application Received!</h2>
                                    <p className="text-zinc-600 dark:text-zinc-400">Our team will review your application and get back to you within 7-10 working days.</p>
                                </motion.div>
                            ) : (
                                <>
                                    <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-8">Application Form</h2>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Full Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full px-5 py-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Email Address</label>
                                                <input
                                                    type="email"
                                                    required
                                                    className="w-full px-5 py-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Educational Background</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-5 py-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                placeholder="e.g. Computer Science Student, Self-taught"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Why do you need this scholarship?</label>
                                            <textarea
                                                required
                                                rows={4}
                                                className="w-full px-5 py-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                                                placeholder="Tell us about your story and goals..."
                                            />
                                        </div>

                                        <button className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 group active:scale-[0.98]">
                                            Submit Application
                                            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                        </button>

                                        <p className="text-center text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                                            Applications close on April 30th, 2026
                                        </p>
                                    </form>
                                </>
                            )}
                        </div>

                    </div>
                </div>
            </section>

            {/* Partnership Section */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-zinc-400 font-bold text-sm uppercase tracking-[0.3em] mb-12">Proudly Supported By</h2>
                <div className="flex flex-wrap justify-center gap-12 sm:gap-20 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                    <div className="h-8 font-black text-2xl">GOOGLE</div>
                    <div className="h-8 font-black text-2xl">AMAZON</div>
                    <div className="h-8 font-black text-2xl">MICROSOFT</div>
                    <div className="h-8 font-black text-2xl">STRIPE</div>
                </div>
            </section>
        </main>
    );
}
