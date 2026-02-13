"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
    HomeIcon,
    UsersIcon,
    CalendarDaysIcon,
    AcademicCapIcon,
    ClipboardDocumentListIcon,
    FolderIcon,
    ChatBubbleLeftRightIcon,
    ClockIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';

export default function MentorDashboard() {
    const [activeTab, setActiveTab] = useState('overview');

    const sidebarItems = [
        { id: 'overview', name: 'Overview', icon: HomeIcon },
        { id: 'mentees', name: 'My Mentees', icon: UsersIcon },
        { id: 'sessions', name: 'Sessions', icon: CalendarDaysIcon },
        { id: 'programs', name: 'Programs', icon: AcademicCapIcon },
        { id: 'assignments', name: 'Assignments & Reviews', icon: ClipboardDocumentListIcon },
        { id: 'resources', name: 'Resources', icon: FolderIcon },
        { id: 'messages', name: 'Messages', icon: ChatBubbleLeftRightIcon },
        { id: 'schedule', name: 'Schedule', icon: ClockIcon },
        { id: 'reports', name: 'Reports', icon: ChartBarIcon },
    ];

    return (
        <DashboardLayout
            sidebarItems={sidebarItems}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            title="Mentor Dashboard"
        >
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-gradient-to-r from-[#03325a] to-[#0a5a8a] rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-2">Welcome, Mentor! 🚀</h1>
                        <p className="text-xl text-white/80">Manage your sessions and mentees with ease.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total Mentees" value={12} icon={UsersIcon} color="text-blue-400" />
                    <StatCard title="Upcoming Sessions" value={4} icon={CalendarDaysIcon} color="text-green-400" />
                    <StatCard title="Pending Reviews" value={7} icon={ClipboardDocumentListIcon} color="text-yellow-400" />
                    <StatCard title="Unread Messages" value={3} icon={ChatBubbleLeftRightIcon} color="text-purple-400" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                        <h2 className="text-2xl font-bold text-white mb-6">Recent Mentee Performance</h2>
                        <div className="space-y-4">
                            <PerformanceItem name="Alice Johnson" program="React Native" score={92} />
                            <PerformanceItem name="Bob Smith" program="Backend Dev" score={78} />
                            <PerformanceItem name="Charlie Brown" program="UI/UX Design" score={85} />
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                        <h2 className="text-2xl font-bold text-white mb-6">Today's Schedule</h2>
                        <div className="space-y-4">
                            <ScheduleItem time="10:00 AM" title="1-on-1: Alice Johnson" type="Meeting" />
                            <ScheduleItem time="02:00 PM" title="Q&A: React Bootcamp" type="Webinar" />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function StatCard({ title, value, icon: Icon, color }: any) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group">
            <Icon className={`w-8 h-8 ${color} mb-4 group-hover:scale-110 transition-transform`} />
            <div className="text-3xl font-black text-white">{value}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</div>
        </div>
    );
}

function PerformanceItem({ name, program, score }: any) {
    return (
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
            <div>
                <p className="font-bold text-white">{name}</p>
                <p className="text-xs text-gray-500">{program}</p>
            </div>
            <div className="text-[#30d9fe] font-black">{score}%</div>
        </div>
    );
}

function ScheduleItem({ time, title, type }: any) {
    return (
        <div className="flex gap-4 p-4 border-l-4 border-[#30d9fe] bg-white/5 rounded-r-2xl">
            <div className="text-sm font-bold text-[#30d9fe]">{time}</div>
            <div>
                <p className="font-bold text-white">{title}</p>
                <p className="text-xs text-gray-500">{type}</p>
            </div>
        </div>
    );
}
