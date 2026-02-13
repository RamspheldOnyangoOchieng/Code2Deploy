"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    CheckCircle2, ArrowRight, PartyPopper,
    Calendar, Mail, Sparkles, GraduationCap
} from "lucide-react";
import confetti from "canvas-confetti";

export default function ConfirmedPage() {
    useEffect(() => {
        // Trigger celebration
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Celebration Background */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/20 via-transparent to-emerald-600/10" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[4rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl p-12 sm:p-20 text-center relative z-10"
            >
                <div className="relative inline-block mb-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                        className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/50"
                    >
                        <CheckCircle2 size={64} className="text-white" />
                    </motion.div>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-4 border-dashed border-emerald-500/30 rounded-full -m-4"
                    />
                </div>

                <h1 className="text-4xl sm:text-6xl font-black text-zinc-900 dark:text-white mb-6 tracking-tight italic">
                    Great choice, <br />
                    Professional.
                </h1>

                <p className="text-lg text-zinc-500 font-bold mb-12 max-w-md mx-auto">
                    Your enrollment has been confirmed. You now have full access to the program curriculum and community.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 text-left">
                        <Mail className="text-indigo-500 mb-3" size={24} />
                        <h4 className="text-sm font-black text-zinc-900 dark:text-white mb-1">Receipt Sent</h4>
                        <p className="text-xs text-zinc-500 font-bold">Check your inbox for the official enrollment receipt.</p>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 text-left">
                        <GraduationCap className="text-indigo-500 mb-3" size={24} />
                        <h4 className="text-sm font-black text-zinc-900 dark:text-white mb-1">Class Access</h4>
                        <p className="text-xs text-zinc-500 font-bold">The program content is now unlocked in your dashboard.</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/dashboard/learner"
                        className="flex-1 py-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-3xl text-lg shadow-2xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                        Go to Dashboard <ArrowRight size={20} />
                    </Link>
                    <Link
                        href="/programs"
                        className="flex-1 py-6 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-black rounded-3xl text-sm transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                        Explore More Programs
                    </Link>
                </div>

                <div className="mt-16 flex items-center justify-center gap-2 text-zinc-400 font-black text-[10px] uppercase tracking-widest">
                    <Sparkles size={14} className="text-amber-500" /> Welcome to the Elite 1%
                </div>
            </motion.div>
        </main>
    );
}
