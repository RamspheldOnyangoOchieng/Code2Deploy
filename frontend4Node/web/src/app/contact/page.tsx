"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Mail, Phone, MapPin, Send, MessageSquare, ShieldCheck, Globe } from "lucide-react";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Navbar />

            <section className="pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-extrabold text-zinc-900 dark:text-white sm:text-5xl"
                        >
                            Get in Touch
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mt-4 text-lg text-zinc-600 dark:text-zinc-400"
                        >
                            Have questions about our programs or scholarships? Our team is here to help you navigate your tech journey.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
                                        <Mail size={24} />
                                    </div>
                                    <h3 className="font-bold text-zinc-900 dark:text-white mb-1">Email Us</h3>
                                    <p className="text-sm text-zinc-500">hello@code2deploy.com</p>
                                </div>
                                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                                        <Phone size={24} />
                                    </div>
                                    <h3 className="font-bold text-zinc-900 dark:text-white mb-1">Call Us</h3>
                                    <p className="text-sm text-zinc-500">+254 700 000 000</p>
                                </div>
                            </div>

                            <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold mb-4">Office Location</h3>
                                    <p className="flex items-start gap-3 opacity-90 mb-6">
                                        <MapPin className="flex-shrink-0 mt-1" />
                                        Tech Plaza, 4th Floor, Ngong Road<br />Nairobi, Kenya
                                    </p>
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                                            <ShieldCheck size={16} /> Verified
                                        </div>
                                        <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                                            <Globe size={16} /> Global Site
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-200 dark:border-zinc-800"
                        >
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Full Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email Address</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Subject</label>
                                    <select className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none">
                                        <option>Program Inquiry</option>
                                        <option>Scholarship Application</option>
                                        <option>Mentorship Program</option>
                                        <option>Partnership</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Message</label>
                                    <textarea
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        placeholder="How can we help you?"
                                    />
                                </div>
                                <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 group">
                                    Send Message
                                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>
        </main>
    );
}
