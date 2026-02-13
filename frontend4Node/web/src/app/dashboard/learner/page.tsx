"use client";

import { useState } from "react";
import {
    BarChart3,
    BookOpen,
    Calendar,
    CheckCircle2,
    Clock,
    LayoutDashboard,
    MessageSquare,
    MoreHorizontal,
    Play,
    Search,
    Trophy,
    Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function LearnerDashboard() {
    const [activeTab, setActiveTab] = useState("overview");

    return (
        <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Mini Sidebar (Desktop) */}
            <aside className="w-20 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 hidden lg:flex flex-col items-center py-8 gap-8 fixed inset-y-0">
                <div className="bg-indigo-600 p-2 rounded-xl text-white">
                    <Trophy size={24} />
                </div>

                <nav className="flex flex-col gap-4">
                    {[
                        { id: "overview", icon: LayoutDashboard },
                        { id: "courses", icon: BookOpen },
                        { id: "sessions", icon: Calendar },
                        { id: "messages", icon: MessageSquare },
                        { id: "analytics", icon: BarChart3 },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={cn(
                                "p-3 rounded-xl transition-all",
                                activeTab === item.id
                                    ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                                    : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                            )}
                        >
                            <item.icon size={24} />
                        </button>
                    ))}
                </nav>

                <div className="mt-auto">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 overflow-hidden ring-2 ring-indigo-500/20">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Learner" alt="avatar" />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:pl-20 flex-1 min-w-0">
                <header className="h-20 px-8 flex items-center justify-between bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Welcome back, Alex! 👋</h1>
                        <p className="text-sm text-zinc-500">You've completed 75% of your weekly goals.</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search resources..."
                                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none w-64 transition-all"
                            />
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto space-y-10">
                    {/* Progress Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden group">
                            <div className="relative z-10 flex flex-col h-full">
                                <span className="text-indigo-100 font-medium mb-2 opacity-80 uppercase tracking-wider text-xs">Current Program</span>
                                <h2 className="text-3xl font-extrabold mb-6">Full-Stack Modern Web Engineering</h2>

                                <div className="mt-auto">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span>Course Progress</span>
                                        <span>72%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/20 rounded-full">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "72%" }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className="h-full bg-white rounded-full"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
                        </div>

                        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Scholarship Status</h3>
                                <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg w-fit">
                                    <CheckCircle2 size={16} /> Fully Funded
                                </div>
                            </div>
                            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 mt-6">
                                <p className="text-xs text-zinc-500 mb-1">Upcoming Payment</p>
                                <p className="text-lg font-bold text-zinc-900 dark:text-white">$0.00 <span className="text-xs font-normal text-zinc-400">(Waived)</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Learning Path */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Continuous Learning</h3>
                                <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">View Map</button>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { title: "Advanced React Patterns", duration: "45m left", status: "In Progress", icon: Play },
                                    { title: "NestJS Dependency Injection", duration: "1h 20m", status: "Upcoming", icon: Clock },
                                    { title: "PostgreSQL Indexing Deep Dive", duration: "2h 30m", status: "Completed", icon: CheckCircle2 },
                                ].map((item, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        key={item.title}
                                        className="group bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-5 hover:border-indigo-500/50 transition-all cursor-pointer shadow-sm hover:shadow-xl hover:shadow-indigo-500/5"
                                    >
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                                            item.status === "In Progress" ? "bg-indigo-100 text-indigo-600" :
                                                item.status === "Completed" ? "bg-emerald-100 text-emerald-600" : "bg-zinc-100 text-zinc-600"
                                        )}>
                                            <item.icon size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-zinc-900 dark:text-white truncate group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                                            <p className="text-xs text-zinc-500">{item.duration} • {item.status}</p>
                                        </div>
                                        <button className="text-zinc-400 group-hover:text-zinc-900 dark:hover:text-white">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Mentorship & Community */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Your Mentors</h3>
                            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                                <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 overflow-hidden">
                                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mentor1" alt="mentor" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-zinc-900 dark:text-white">Sarah Wilson</p>
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">Lead Mentor</p>
                                        </div>
                                    </div>
                                    <button className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                                        <MessageSquare size={16} />
                                    </button>
                                </div>
                                <div className="p-6 bg-zinc-50/50 dark:bg-zinc-800/30">
                                    <p className="text-xs font-bold text-zinc-500 uppercase mb-4">Upcoming Session</p>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-zinc-900 dark:text-white">Code Review</p>
                                            <p className="text-xs text-zinc-500">Tomorrow • 14:00 PM</p>
                                        </div>
                                        <button className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-zinc-50 transition-colors">
                                            Join Link
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 p-8 rounded-3xl border border-indigo-100/50 dark:border-indigo-900/30">
                                <h4 className="font-bold text-indigo-950 dark:text-indigo-200 mb-2">Join Study Group</h4>
                                <p className="text-sm text-indigo-900/70 dark:text-indigo-400 mb-6">Collaborate with fellow students in the Full-Stack cohort.</p>
                                <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">
                                    <Users size={18} /> Enter Channel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
