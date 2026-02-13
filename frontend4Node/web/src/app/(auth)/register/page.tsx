"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    User, Mail, Lock, ArrowRight, Github,
    Chrome, CheckCircle, Shield, Zap, Target
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <main className="min-h-screen bg-zinc-950 flex flex-col lg:flex-row overflow-hidden">
            {/* Left Content: Brand & Social Proof */}
            <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 relative overflow-hidden p-20 flex-col justify-between">
                <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:40px_40px]" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/50 to-purple-600/50" />

                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3 text-white">
                        <div className="bg-white p-2 rounded-xl text-indigo-600">
                            <Zap size={24} fill="currentColor" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter">Code2Deploy</span>
                    </Link>
                </div>

                <div className="relative z-10 space-y-12">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl font-black text-white leading-[1.1]"
                    >
                        Master the <br />
                        <span className="text-zinc-900/40">Modern Stack</span>
                    </motion.h1>

                    <div className="space-y-6">
                        {[
                            { icon: CheckCircle, text: "Industry-standard curriculum by top engineers" },
                            { icon: Shield, text: "Verified certificates recognized globally" },
                            { icon: Target, text: "Direct mentorship from tech veterans" },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className="flex items-center gap-4 text-white/80 font-bold"
                            >
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <item.icon size={20} className="text-white" />
                                </div>
                                {item.text}
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10">
                    <div className="flex -space-x-4 mb-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-600 overflow-hidden">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="User" />
                            </div>
                        ))}
                        <div className="w-10 h-10 rounded-full bg-white text-indigo-600 flex items-center justify-center text-[10px] font-black border-2 border-indigo-600">
                            +2k
                        </div>
                    </div>
                    <p className="text-indigo-100 text-sm font-bold">Join 2,000+ engineers leveling up today.</p>
                </div>
            </div>

            {/* Right Content: Registration Form */}
            <div className="flex-1 bg-white dark:bg-zinc-950 p-8 sm:p-20 flex items-center justify-center overflow-y-auto">
                <div className="w-full max-w-md space-y-10">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">Create Account</h2>
                        <p className="text-zinc-500 font-bold text-sm">
                            Already have an account? <Link href="/login" className="text-indigo-500 hover:underline">Sign in instead</Link>
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-3 py-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all font-bold text-sm text-zinc-600 dark:text-zinc-400">
                            <Chrome size={20} /> Google
                        </button>
                        <button className="flex items-center justify-center gap-3 py-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all font-bold text-sm text-zinc-600 dark:text-zinc-400">
                            <Github size={20} /> GitHub
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-200 dark:border-zinc-800" /></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-zinc-950 px-4 text-zinc-400 font-black tracking-widest">OR CONTINUE WITH EMAIL</span></div>
                    </div>

                    <form className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full pl-16 pr-6 py-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all font-bold"
                                />
                            </div>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                <input
                                    type="email"
                                    placeholder="Work Email"
                                    className="w-full pl-16 pr-6 py-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all font-bold"
                                />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                <input
                                    type="password"
                                    placeholder="Create Password"
                                    className="w-full pl-16 pr-6 py-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all font-bold"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-2">
                            <input type="checkbox" id="terms" className="w-5 h-5 rounded-lg border-zinc-300 text-indigo-600 focus:ring-indigo-500" />
                            <label htmlFor="terms" className="text-xs font-bold text-zinc-500">
                                I agree to the <Link href="#" className="text-zinc-900 dark:text-white underline">Terms of Service</Link> and <Link href="#" className="text-zinc-900 dark:text-white underline">Privacy Policy</Link>
                            </label>
                        </div>

                        <button
                            type="button"
                            className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-3xl text-lg shadow-2xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                            onClick={() => setIsLoading(true)}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>Get Started <ArrowRight size={20} /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                        SECURED BY SUPABASE 256-BIT ENCRYPTION
                    </p>
                </div>
            </div>
        </main>
    );
}
