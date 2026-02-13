"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Mail, Lock, ArrowRight, Github,
    Chrome, Zap, ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 sm:p-20 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl p-10 sm:p-20 relative z-10"
            >
                <div className="text-center mb-12">
                    <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
                        <div className="bg-indigo-600 p-2 rounded-xl text-white group-hover:scale-110 transition-transform">
                            <Zap size={20} fill="currentColor" />
                        </div>
                        <span className="text-xl font-black dark:text-white tracking-widest uppercase">Code2Deploy</span>
                    </Link>
                    <h1 className="text-4xl font-black text-zinc-900 dark:text-white mb-3 tracking-tight italic">Welcome Back.</h1>
                    <p className="text-zinc-500 font-bold">
                        New to the academy? <Link href="/register" className="text-indigo-500 hover:underline">Create an account</Link>
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                    <button className="flex items-center justify-center gap-3 py-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all font-bold text-sm text-zinc-600 dark:text-zinc-400">
                        <Chrome size={20} /> Google
                    </button>
                    <button className="flex items-center justify-center gap-3 py-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all font-bold text-sm text-zinc-600 dark:text-zinc-400">
                        <Github size={20} /> GitHub
                    </button>
                </div>

                <div className="relative mb-10">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-100 dark:border-zinc-800" /></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-zinc-900 px-4 text-zinc-400 font-black tracking-widest">OR USE EMAIL</span></div>
                </div>

                <form className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative group">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full pl-16 pr-6 py-5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-900 dark:text-white transition-all font-bold"
                            />
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full pl-16 pr-6 py-5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-900 dark:text-white transition-all font-bold"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Link href="/reset-password" Illinois className="text-xs font-bold text-indigo-500 hover:text-indigo-600 uppercase tracking-widest">Forgot Password?</Link>
                    </div>

                    <button
                        type="button"
                        className="w-full py-6 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black rounded-3xl text-lg hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-black/10"
                        onClick={() => setIsLoading(true)}
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>Sign In <ArrowRight size={20} /></>
                        )}
                    </button>
                </form>

                <div className="mt-12 flex items-center justify-center gap-2 text-zinc-400 font-bold text-[10px] uppercase tracking-widest">
                    <ShieldAlert size={14} className="text-amber-500" /> Authorized personal only
                </div>
            </motion.div>
        </main>
    );
}
