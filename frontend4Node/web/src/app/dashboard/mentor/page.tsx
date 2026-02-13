"use client";

import { useState } from "react";
import {
    LayoutDashboard,
    Users,
    Calendar,
    BookOpen,
    CheckSquare,
    Folder,
    MessageSquare,
    Clock,
    BarChart3,
    Bell,
    Search,
    ChevronRight,
    MoreVertical,
    Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const SIDEBAR_ITEMS = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "mentees", label: "My Mentees", icon: Users },
    { id: "sessions", label: "Sessions", icon: Calendar },
    { id: "programs", label: "Programs", icon: BookOpen },
    { id: "assignments", label: "Assignments", icon: CheckSquare },
    { id: "resources", label: "Resources", icon: Folder },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "schedule", label: "Schedule", icon: Clock },
    { id: "reports", label: "Reports", icon: BarChart3 },
];

export default function MentorDashboard() {
    const [activeTab, setActiveTab] = useState("overview");

    return (
        <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 hidden lg:flex flex-col fixed inset-y-0">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                            <BarChart3 size={20} />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white">MentorHub</span>
                    </div>

                    <nav className="space-y-1">
                        {SIDEBAR_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                                    activeTab === item.id
                                        ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-sm"
                                        : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
                                )}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mentor" alt="avatar" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">Dr. Sarah Wilson</p>
                            <p className="text-xs text-zinc-500 truncate">Senior Mentor</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:pl-64 flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-30 px-6 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white capitalize">{activeTab}</h2>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-zinc-100 dark:bg-zinc-800 border-none rounded-full pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 transition-all"
                            />
                        </div>
                        <button className="relative p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900" />
                        </button>
                    </div>
                </header>

                <div className="p-6 max-w-7xl mx-auto w-full">
                    {activeTab === "overview" && (
                        <div className="space-y-8">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { label: "Active Mentees", value: "24", change: "+4 this month", icon: Users, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
                                    { label: "Upcoming Sessions", value: "8", change: "Next at 2:00 PM", icon: Calendar, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
                                    { label: "Pending Reviews", value: "12", change: "3 urgent", icon: CheckSquare, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
                                    { label: "Average Rating", value: "4.9", change: "Top 5% of mentors", icon: BarChart3, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
                                ].map((stat, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        key={stat.label}
                                        className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800"
                                    >
                                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", stat.bg, stat.color)}>
                                            <stat.icon size={24} />
                                        </div>
                                        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">{stat.label}</p>
                                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">{stat.value}</h3>
                                        <p className="text-xs text-zinc-400 mt-2">{stat.change}</p>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Main Schedule */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                                <Clock className="text-indigo-600" size={20} />
                                                Upcoming Sessions
                                            </h3>
                                            <button className="text-sm text-indigo-600 font-bold hover:underline">View All</button>
                                        </div>

                                        <div className="space-y-4">
                                            {[1, 2, 3].map((s) => (
                                                <div key={s} className="flex items-center gap-4 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                                                    <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0">
                                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Student${s + 5}`} alt="student" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-zinc-900 dark:text-white truncate">Frontend Architecture Review</h4>
                                                        <p className="text-xs text-zinc-500">with John Doe • 10:00 AM - 11:30 AM</p>
                                                    </div>
                                                    <button className="p-2 text-zinc-400 group-hover:text-indigo-600 transition-colors">
                                                        <ChevronRight size={20} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions & Recent Submissions */}
                                <div className="space-y-8">
                                    <div className="bg-indigo-600 rounded-2xl p-6 text-white overflow-hidden relative">
                                        <div className="relative z-10">
                                            <h3 className="font-bold text-lg mb-2">Create New Session</h3>
                                            <p className="text-indigo-100 text-sm mb-4 opacity-80">Easily schedule meetings with your mentees.</p>
                                            <button className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors">
                                                <Plus size={20} />
                                                Schedule Now
                                            </button>
                                        </div>
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                                    </div>

                                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                                        <h3 className="font-bold text-zinc-900 dark:text-white mb-6">Recent Submissions</h3>
                                        <div className="space-y-6">
                                            {[1, 2].map((sub) => (
                                                <div key={sub} className="flex items-start gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center flex-shrink-0">
                                                        <CheckSquare size={16} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-bold text-zinc-900 dark:text-white truncate">Project Alpha - Milestone 1</h4>
                                                        <p className="text-[10px] text-zinc-500">Submitted by Mark Taylor • 2h ago</p>
                                                    </div>
                                                    <button className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                                                        <MoreVertical size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
