"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Rocket, Eye, Target, Users, Award, ShieldCheck, Heart, Sparkles, ArrowUpRight } from "lucide-react";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-6 border border-indigo-100 dark:border-indigo-800"
                        >
                            <Sparkles size={14} /> Our Story
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-6xl"
                        >
                            Building the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">African Tech</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-6 text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed"
                        >
                            Code2Deploy is more than an academy. We're an ecosystem designed to empower African developers with the industrial skills needed to compete globally.
                        </motion.p>
                    </div>
                </div>

                {/* Abstract shapes */}
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] bg-purple-500 rounded-full blur-[100px]" />
                </div>
            </section>

            {/* Purpose Cards */}
            <section className="py-24 bg-white dark:bg-zinc-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 shadow-sm"
                        >
                            <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-600/20">
                                <Target size={28} />
                            </div>
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Our Mission</h2>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                To bridge the digital skill gap by providing world-class tech education, mentorship, and career readiness for the next generation of African engineers.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 shadow-sm"
                        >
                            <div className="w-14 h-14 bg-purple-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-600/20">
                                <Eye size={28} />
                            </div>
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Our Vision</h2>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                To become the premier launchpad for African tech talent, recognized globally for producing high-caliber engineers who drive innovation.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Team / Leadership */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">Meet our Leadership</h2>
                        <p className="mt-4 text-zinc-500">The minds driving technical excellence at Code2Deploy.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { name: "Dr. Sarah Okonjo", role: "Founder & CEO", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
                            { name: "Michael Adebayo", role: "CTO", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael" },
                            { name: "Amina Hassan", role: "Head of Growth", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amina" },
                        ].map((member, i) => (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                key={member.name}
                                className="group relative"
                            >
                                <div className="aspect-square rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden mb-4 p-4">
                                    <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 ring-1 ring-zinc-200 dark:ring-zinc-700">
                                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{member.name}</h3>
                                <p className="text-indigo-600 font-medium text-sm">{member.role}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Grid */}
            <section className="py-24 bg-zinc-900 text-white overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold sm:text-4xl mb-4">Our Core Values</h2>
                        <p className="text-zinc-400">The DNA that defines how we work and teach.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: "Radical Excellence", desc: "We don't settle for 'good enough'. We ship world-class standard.", icon: ShieldCheck },
                            { title: "African Ingenuity", desc: "Leveraging our unique perspective to solve global problems.", icon: Rocket },
                            { title: "Community First", desc: "We grow together. No developer is left behind in their journey.", icon: Heart },
                        ].map((v) => (
                            <div key={v.title} className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm group hover:bg-white/[0.08] transition-all">
                                <v.icon className="text-indigo-400 mb-6 group-hover:scale-110 transition-transform" size={32} />
                                <h3 className="text-xl font-bold mb-3">{v.title}</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[3rem] p-12 sm:p-20 text-white relative overflow-hidden">
                        <h2 className="text-3xl sm:text-5xl font-extrabold mb-8 relative z-10">Ready to build your dream?</h2>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                            <button className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-100 transition-all">
                                Explore Programs <ArrowUpRight size={20} />
                            </button>
                            <button className="px-8 py-4 bg-black/20 backdrop-blur-md border border-white/20 font-bold rounded-2xl hover:bg-white/10 transition-all">
                                Partner with us
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
