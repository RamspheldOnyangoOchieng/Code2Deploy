"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Clock, BarChart, BookOpen, CheckCircle, X, ChevronRight, Zap, Target, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Frontend", "Backend", "Fullstack", "DevOps", "AI & Data"];
const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];

const MOCK_PROGRAMS = [
    {
        id: "1",
        title: "Modern Frontend Engineering",
        description: "Master React, Next.js 14, and advanced CSS techniques. Build production-ready interfaces with performance in mind.",
        duration: "12 Weeks",
        level: "Intermediate",
        category: "Frontend",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
        price: 0,
        isScholarship: true,
        technologies: ["React", "Next.js", "Tailwind", "TypeScript"],
        modules: ["Fundamentals", "Mastering Hooks", "Server Components", "Optimization"]
    },
    {
        id: "2",
        title: "Scalable Backend with NestJS",
        description: "Learn to build enterprise-grade APIs using NestJS, PostgreSQL, and Prisma. Deep dive into microservices.",
        duration: "14 Weeks",
        level: "Advanced",
        category: "Backend",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
        price: 499,
        isScholarship: false,
        technologies: ["Node.js", "NestJS", "PostgreSQL", "Docker"],
        modules: ["Architecture", "Database Design", "Security", "Deployment"]
    },
    {
        id: "3",
        title: "DevOps & Cloud Native",
        description: "Master Kubernetes, Docker, CI/CD pipelines, and cloud orchestration on AWS and Google Cloud.",
        duration: "10 Weeks",
        level: "Advanced",
        category: "DevOps",
        image: "https://images.unsplash.com/photo-1667372333374-0d3c004cde7d?w=800&q=80",
        price: 599,
        isScholarship: true,
        technologies: ["K8s", "Docker", "Terraform", "AWS"],
        modules: ["Containerization", "Automation", "Monitoring", "Scaling"]
    }
];

export default function ProgramsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeLevel, setActiveLevel] = useState("All");
    const [selectedProgram, setSelectedProgram] = useState<any>(null);

    const filteredPrograms = MOCK_PROGRAMS.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === "All" || p.category === activeCategory;
        const matchesLevel = activeLevel === "All" || p.level === activeLevel;
        return matchesSearch && matchesCategory && matchesLevel;
    });

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Navbar />

            {/* Premium Header */}
            <section className="pt-40 pb-20 bg-white dark:bg-zinc-900 overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
                            Accelerate Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Engineering Journey</span>
                        </h1>
                        <p className="mt-8 text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
                            World-class curricula designed by engineers from Google, Amazon, and Meta.
                            From zero to production-ready deployments.
                        </p>
                    </motion.div>

                    {/* Dynamic Filters Bar */}
                    <div className="mt-16 bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-3xl border border-zinc-200 dark:border-zinc-700 backdrop-blur-sm flex flex-col lg:flex-row gap-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search by tech, role, or path..."
                                className="w-full pl-14 pr-4 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex bg-white dark:bg-zinc-900 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-700">
                                {CATEGORIES.slice(0, 4).map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setActiveCategory(c)}
                                        className={cn(
                                            "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                                            activeCategory === c
                                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                                        )}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative background gradients */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            </section>

            {/* Main Grid */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <AnimatePresence mode="popLayout">
                            {filteredPrograms.map((program, i) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: i * 0.1 }}
                                    key={program.id}
                                    className="group relative bg-white dark:bg-zinc-900 rounded-[3rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 hover:shadow-[0_32px_64px_-16px_rgba(79,70,229,0.15)] transition-all cursor-pointer flex flex-col"
                                    onClick={() => setSelectedProgram(program)}
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        <img
                                            src={program.image}
                                            alt={program.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                                        <div className="absolute top-6 left-6 flex gap-2">
                                            <span className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur px-4 py-1.5 rounded-2xl text-[10px] font-black tracking-widest uppercase text-indigo-600 border border-indigo-100 dark:border-indigo-900 shadow-xl">
                                                {program.duration}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-6 left-6">
                                            <div className="flex gap-2">
                                                {program.technologies.slice(0, 3).map(t => (
                                                    <span key={t} className="px-2 py-1 bg-white/20 backdrop-blur rounded-lg text-[10px] font-bold text-white border border-white/20">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-10 flex-1 flex flex-col">
                                        <div className="flex items-center gap-3 mb-6">
                                            <span className={cn(
                                                "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                                                program.level === "Advanced" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" :
                                                    program.level === "Intermediate" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                                                        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                            )}>
                                                {program.level}
                                            </span>
                                            {program.isScholarship && (
                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg text-[10px] font-black tracking-widest uppercase">
                                                    <Zap size={12} fill="currentColor" /> Scholarship
                                                </div>
                                            )}
                                        </div>

                                        <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-4 group-hover:text-indigo-600 transition-colors leading-tight">
                                            {program.title}
                                        </h3>
                                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-10 line-clamp-3">
                                            {program.description}
                                        </p>

                                        <div className="mt-auto flex items-center justify-between pt-8 border-t border-zinc-100 dark:border-zinc-800">
                                            <div className="text-lg font-black text-zinc-900 dark:text-white">
                                                {program.price === 0 ? "FREE" : `$${program.price}`}
                                            </div>
                                            <div className="text-indigo-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                                                Enroll Now <ChevronRight size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* Quick View Modal */}
            <AnimatePresence>
                {selectedProgram && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"
                            onClick={() => setSelectedProgram(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="relative w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh]"
                        >
                            <div className="lg:w-1/2 h-64 lg:h-auto relative">
                                <img
                                    src={selectedProgram.image}
                                    alt={selectedProgram.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/60 to-transparent lg:hidden" />
                                <button
                                    onClick={() => setSelectedProgram(null)}
                                    className="absolute top-6 left-6 p-3 bg-white/20 hover:bg-white/40 backdrop-blur-xl rounded-2xl text-white transition-all z-20"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="lg:w-1/2 p-10 sm:p-16 overflow-y-auto custom-scrollbar">
                                <div className="inline-flex gap-4 mb-8">
                                    <div className="flex items-center gap-2 text-zinc-500 font-bold text-sm uppercase tracking-widest bg-zinc-50 dark:bg-zinc-800 px-4 py-2 rounded-xl">
                                        <Clock size={16} className="text-indigo-600" />
                                        {selectedProgram.duration}
                                    </div>
                                    <div className="flex items-center gap-2 text-zinc-500 font-bold text-sm uppercase tracking-widest bg-zinc-50 dark:bg-zinc-800 px-4 py-2 rounded-xl">
                                        <BarChart size={16} className="text-indigo-600" />
                                        {selectedProgram.level}
                                    </div>
                                </div>

                                <h2 className="text-4xl font-black text-zinc-900 dark:text-white mb-6 leading-[1.1]">{selectedProgram.title}</h2>
                                <p className="text-zinc-600 dark:text-zinc-400 mb-10 text-lg leading-relaxed">
                                    {selectedProgram.description}
                                </p>

                                <div className="space-y-10">
                                    <div>
                                        <h4 className="font-black text-zinc-900 dark:text-white mb-6 flex items-center gap-3 uppercase tracking-tighter text-xl">
                                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                                                <Target size={18} />
                                            </div>
                                            Curriculum Highlights
                                        </h4>
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {selectedProgram.modules.map((m: string) => (
                                                <li key={m} className="flex items-center gap-3 text-sm font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl">
                                                    <CheckCircle size={18} className="text-indigo-600 flex-shrink-0" />
                                                    {m}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="pt-10 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center gap-8">
                                        <div className="flex-1">
                                            <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Tuition Fee</div>
                                            <div className="text-4xl font-black text-zinc-900 dark:text-white">
                                                {selectedProgram.price === 0 ? "FREE" : `$${selectedProgram.price}`}
                                            </div>
                                        </div>
                                        <button className="w-full sm:w-auto px-12 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-600/30 transition-all active:scale-[0.98]">
                                            {selectedProgram.isScholarship ? "Apply Now" : "Enroll Now"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}
