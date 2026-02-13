"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Mail, Phone, Building, Calendar, Shield,
    Camera, LogOut, Edit3, Check, X, Key, Bell,
    Github, Linkedin, Twitter, ExternalLink, Copy
} from "lucide-react";
import { useSupabase } from "@/lib/supabase"; // Assuming you have a hook for this
import { cn } from "@/lib/utils";

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Mock data for initial design - this will be replaced with real Supabase/API calls
    useEffect(() => {
        setTimeout(() => {
            setProfile({
                fullName: "Onyango Ochieng",
                email: "dev@code2deploy.com",
                role: "STUDENT",
                username: "onyango_dev",
                phone: "+254 712 345 678",
                organization: "Code2Deploy Academy",
                joinedAt: "Jan 2024",
                bio: "Full-stack engineer passionate about building scalable educational platforms and empowering the next generation of African developers.",
                avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Onyango",
                github: "https://github.com/onyango",
                linkedin: "https://linkedin.com/in/onyango",
            });
            setLoading(false);
        }, 1000);
    }, []);

    const TABS = [
        { id: "overview", label: "Overview", icon: User },
        { id: "security", label: "Security", icon: Shield },
        { id: "notifications", label: "Notifications", icon: Bell },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Navbar />

            {/* Premium Header */}
            <div className="pt-32 pb-48 bg-gradient-to-br from-indigo-900 via-zinc-950 to-zinc-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative group"
                        >
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] overflow-hidden ring-4 ring-white/10 shadow-2xl">
                                <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                    <Camera className="text-white w-8 h-8" />
                                </div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-indigo-600 p-3 rounded-2xl shadow-xl text-white">
                                <Edit3 size={18} />
                            </div>
                        </motion.div>

                        <div className="text-center md:text-left flex-1">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl md:text-5xl font-black text-white mb-2"
                            >
                                {profile.fullName}
                            </motion.h1>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="flex flex-wrap justify-center md:justify-start gap-4 text-zinc-400 font-bold text-sm"
                            >
                                <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 hover:border-indigo-500 transition-colors">
                                    <Mail size={14} className="text-indigo-400" /> {profile.email}
                                </span>
                                <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                                    <Calendar size={14} className="text-indigo-400" /> Joined {profile.joinedAt}
                                </span>
                                <span className="flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-full border border-indigo-500/20">
                                    {profile.role}
                                </span>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col gap-3"
                        >
                            <button className="px-8 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-2xl font-black text-sm hover:border-indigo-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/20">
                                <Edit3 size={18} /> Edit Profile
                            </button>
                            <button className="px-8 py-3 bg-red-600/10 border border-red-500/20 text-red-500 rounded-2xl font-black text-sm hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2">
                                <LogOut size={18} /> Logout
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-24 pb-20 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Navigation Sidebar */}
                    <div className="lg:col-span-3">
                        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-4 shadow-2xl">
                            <div className="space-y-2">
                                {TABS.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={cn(
                                                "w-full flex items-center gap-4 px-6 py-4 rounded-3xl font-bold transition-all",
                                                activeTab === tab.id
                                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                                    : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-300"
                                            )}
                                        >
                                            <Icon size={20} />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800 p-4">
                                <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-6">Connected Accounts</h4>
                                <div className="space-y-4">
                                    <a href={profile.github} className="flex items-center gap-3 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-indigo-500 transition-colors">
                                        <Github size={20} /> GitHub
                                        <ExternalLink size={14} className="ml-auto opacity-0 group-hover:opacity-100" />
                                    </a>
                                    <a href={profile.linkedin} className="flex items-center gap-3 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-indigo-500 transition-colors">
                                        <Linkedin size={20} /> LinkedIn
                                    </a>
                                    <a href="#" className="flex items-center gap-3 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-indigo-500 transition-colors">
                                        <Twitter size={20} /> Twitter
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Content Pane */}
                    <div className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            {activeTab === "overview" && (
                                <motion.div
                                    key="overview"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    {/* Personal Info Card */}
                                    <div className="bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 p-10 shadow-2xl">
                                        <div className="flex items-center justify-between mb-10">
                                            <h3 className="text-2xl font-black text-zinc-900 dark:text-white">Profile Details</h3>
                                            <button className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-zinc-600 dark:text-zinc-400 hover:text-indigo-500 transition-colors">
                                                <Edit3 size={20} />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-8">
                                                <div>
                                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Display Name</label>
                                                    <p className="text-zinc-900 dark:text-white font-bold text-lg">{profile.fullName}</p>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Username</label>
                                                    <p className="text-zinc-900 dark:text-white font-bold text-lg">@{profile.username}</p>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Organization</label>
                                                    <p className="text-zinc-900 dark:text-white font-bold text-lg">{profile.organization}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-8">
                                                <div>
                                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Phone Number</label>
                                                    <p className="text-zinc-900 dark:text-white font-bold text-lg">{profile.phone}</p>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Portfolio Link</label>
                                                    <p className="text-indigo-500 font-bold text-lg flex items-center gap-2">
                                                        https://onyango.och/ <ExternalLink size={16} />
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-12 pt-12 border-t border-zinc-200 dark:border-zinc-800">
                                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-4">Professional Bio</label>
                                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                                                {profile.bio}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                                        {[
                                            { label: "Enrolled Programs", value: "4", color: "text-indigo-500" },
                                            { label: "Completed Projects", value: "12", color: "text-emerald-500" },
                                            { label: "Badges Earned", value: "8", color: "text-amber-500" },
                                        ].map((stat) => (
                                            <div key={stat.label} className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8 shadow-xl">
                                                <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">{stat.label}</p>
                                                <p className={cn("text-4xl font-black", stat.color)}>{stat.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "security" && (
                                <motion.div
                                    key="security"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 p-10 shadow-2xl space-y-12"
                                >
                                    <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-10">
                                        <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500">
                                            <Key size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-zinc-900 dark:text-white">Security & Login</h3>
                                            <p className="text-sm text-zinc-500 font-bold">Manage your password and authentication methods.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="flex items-center justify-between p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-[2rem] border border-zinc-200 dark:border-zinc-700">
                                            <div>
                                                <p className="font-bold text-zinc-900 dark:text-white">Password</p>
                                                <p className="text-xs text-zinc-500 mt-1 font-bold italic">Last changed 3 months ago</p>
                                            </div>
                                            <button className="px-6 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl font-black text-xs hover:border-indigo-500 transition-all">
                                                Change Password
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-[2rem] border border-zinc-200 dark:border-zinc-700">
                                            <div>
                                                <p className="font-bold text-zinc-900 dark:text-white">Two-Factor Authentication</p>
                                                <p className="text-xs text-zinc-500 mt-1 font-bold">Secure your account with an extra verification layer.</p>
                                            </div>
                                            <button className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-black text-xs hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
                                                Enable 2FA
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </main>
    );
}
