"use client";

import { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import {
    AcademicCapIcon,
    CalendarIcon,
    BellIcon,
    ChartBarIcon,
    DocumentTextIcon,
    ShieldCheckIcon,
    BookOpenIcon,
    PlayCircleIcon,
    ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';

export default function LearnerDashboard() {
    const [activeTab, setActiveTab] = useState('overview');

    const sidebarItems = [
        { id: 'overview', name: 'Overview', icon: ChartBarIcon },
        { id: 'programs', name: 'My Programs', icon: AcademicCapIcon },
        { id: 'events', name: 'My Events', icon: CalendarIcon },
        { id: 'certificates', name: 'Certificates', icon: DocumentTextIcon },
        { id: 'badges', name: 'Badges', icon: ShieldCheckIcon },
        { id: 'notifications', name: 'Notifications', icon: BellIcon },
    ];

    return (
        <DashboardLayout
            sidebarItems={sidebarItems}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            title="Learner Dashboard"
        >
            {activeTab === 'overview' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-gradient-to-r from-[#30d9fe] via-[#03325a] to-[#eec262] rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h1 className="text-4xl md:text-5xl font-extrabold mb-2">Welcome back, John! 👋</h1>
                            <p className="text-xl text-white/80 font-medium">john@example.com</p>
                        </div>
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <AcademicCapIcon className="w-48 h-48" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard count={3} label="My Programs" icon={AcademicCapIcon} color="text-[#30d9fe]" />
                        <StatCard count={5} label="My Events" icon={CalendarIcon} color="text-[#eec262]" />
                        <StatCard count={2} label="Certificates" icon={DocumentTextIcon} color="text-green-400" />
                        <StatCard count={12} label="Badges" icon={ShieldCheckIcon} color="text-purple-400" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <BookOpenIcon className="w-8 h-8 text-[#30d9fe]" />
                                Recent Activity
                            </h2>
                            <div className="space-y-4">
                                <ActivityItem title="Web Development Bootcamp" status="In Progress" progress={65} />
                                <ActivityItem title="Advanced UI Workshop" status="Completed" progress={100} />
                                <ActivityItem title="Python for AI" status="Just Started" progress={10} />
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <PlayCircleIcon className="w-8 h-8 text-[#eec262]" />
                                Recommended for You
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                <RecommendCard title="Full Stack Next.js" level="Advanced" />
                                <RecommendCard title="AI Ethics & Policy" level="Beginner" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'programs' && (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-white min-h-[400px]">
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                        <AcademicCapIcon className="w-10 h-10 text-[#30d9fe]" />
                        Registered Programs
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#03325a]/40 p-6 rounded-2xl border border-white/5">
                            <h3 className="text-xl font-bold mb-4">Web Development Immersive</h3>
                            <div className="w-full bg-slate-800 rounded-full h-3 mb-2">
                                <div className="bg-[#30d9fe] h-3 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                            <p className="text-sm text-gray-400">65% Complete</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Other tabs can be added similarly */}
        </DashboardLayout>
    );
}

function StatCard({ count, label, icon: Icon, color }: any) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all cursor-pointer group">
            <Icon className={`w-10 h-10 ${color} mx-auto mb-4 group-hover:scale-110 transition-transform`} />
            <div className="text-4xl font-black text-white mb-1">{count}</div>
            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">{label}</div>
        </div>
    );
}

function ActivityItem({ title, status, progress }: any) {
    return (
        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                <AcademicCapIcon className="w-6 h-6 text-[#30d9fe]" />
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-white">{title}</h4>
                <p className="text-xs text-gray-400">{status}</p>
            </div>
            <div className="text-[#30d9fe] font-bold">{progress}%</div>
        </div>
    );
}

function RecommendCard({ title, level }: any) {
    return (
        <div className="bg-slate-800/40 p-4 rounded-xl flex justify-between items-center border border-white/5">
            <div>
                <h4 className="font-bold text-white">{title}</h4>
                <p className="text-xs text-[#30d9fe] font-bold">{level}</p>
            </div>
            <button className="px-4 py-2 bg-[#30d9fe] text-[#03325a] font-bold text-xs rounded-lg">Details</button>
        </div>
    );
}
