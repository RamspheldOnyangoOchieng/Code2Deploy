"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Mail, ArrowLeft, Key, CheckCircle,
    Zap, AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ResetPasswordPage() {
    const [isSent, setIsSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden relative z-10"
            >
                <div className="p-10 sm:p-16">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-500 mx-auto mb-6">
                            <Key size={32} />
                        </div>
                        <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-3">Forgot Password?</h1>
                        <p className="text-zinc-500 font-bold text-sm">
                            No worries, we'll send you reset instructions.
                        </p>
                    </div>

                    {!isSent ? (
                        <form className="space-y-8">
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full pl-16 pr-6 py-5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-900 dark:text-white transition-all font-bold"
                                />
                            </div>

                            <button
                                type="button"
                                className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-3xl text-lg shadow-2xl shadow-indigo-600/30 transition-all active:scale-[0.98]"
                                onClick={() => {
                                    setIsLoading(true);
                                    setTimeout(() => {
                                        setIsLoading(false);
                                        setIsSent(true);
                                    }, 1500);
                                }}
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    "Reset Password"
                                )}
                            </button>
                        </form>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center space-y-8"
                        >
                            <div className="p-10 bg-emerald-500/10 rounded-[2rem] border border-emerald-500/20">
                                <CheckCircle className="text-emerald-500 mx-auto mb-4" size={48} />
                                <h3 className="text-emerald-500 font-black text-xl mb-2">Check your email</h3>
                                <p className="text-zinc-500 text-sm font-bold">
                                    We've sent password reset instructions to your email address.
                                </p>
                            </div>

                            <button
                                onClick={() => setIsSent(false)}
                                className="text-indigo-500 font-black text-xs uppercase tracking-widest hover:text-indigo-400 transition-colors"
                            >
                                Didn't receive the email? Resend
                            </button>
                        </motion.div>
                    )}

                    <div className="mt-12 text-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-black text-xs uppercase tracking-widest transition-colors"
                        >
                            <ArrowLeft size={16} /> Back to Login
                        </Link>
                    </div>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-800/50 py-4 px-10 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
                    <AlertCircle size={14} className="text-zinc-400" />
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">
                        Protected by bank-grade TLS 1.3 encryption
                    </p>
                </div>
            </motion.div>
        </main>
    );
}
