"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
    Squares2X2Icon,
    UsersIcon,
    AcademicCapIcon,
    CalendarIcon,
    EnvelopeIcon,
    Cog6ToothIcon,
    DocumentTextIcon,
    ArrowTrendingUpIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview');

    const sidebarItems = [
        { id: 'overview', name: 'System Overview', icon: Squares2X2Icon },
        { id: 'users', name: 'User Management', icon: UsersIcon },
        { id: 'programs', name: 'Programs & Courses', icon: AcademicCapIcon },
        { id: 'events', name: 'Events & Sessions', icon: CalendarIcon },
        { id: 'notifications', name: 'System Announcements', icon: EnvelopeIcon },
        { id: 'reports', name: 'Analytics & Reports', icon: ArrowTrendingUpIcon },
        { id: 'settings', name: 'Site Settings', icon: Cog6ToothIcon },
    ];

    return (
        <DashboardLayout
            sidebarItems={sidebarItems}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            title="System Admin"
        >
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-white">System Administration</h1>
                        <p className="text-gray-400">Manage users, content, and system performance.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-6 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-bold flex items-center gap-2">
                            <ExclamationTriangleIcon className="w-5 h-5" />
                            System Log
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <AdminStatCard title="Active Users" value="1,284" trend="+12%" icon={UsersIcon} />
                    <AdminStatCard title="Enrollments" value="452" trend="+5%" icon={AcademicCapIcon} />
                    <AdminStatCard title="Total Revenue" value="$42,500" trend="+18%" icon={ArrowTrendingUpIcon} />
                    <AdminStatCard title="System Health" value="99.9%" trend="Stable" icon={Squares2X2Icon} color="text-green-400" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8">
                        <h2 className="text-xl font-bold text-white mb-6">Recent User Activity</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b border-white/10 text-xs font-bold text-gray-500 uppercase">
                                    <tr>
                                        <th className="pb-4">User</th>
                                        <th className="pb-4">Action</th>
                                        <th className="pb-4">Time</th>
                                        <th className="pb-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    <ActivityRow user="John Smith" action="Enrolled in React Bootcamp" time="2 mins ago" status="Success" />
                                    <ActivityRow user="Sarah Connor" action="Completed Profile" time="15 mins ago" status="Success" />
                                    <ActivityRow user="Tony Stark" action="Payment Failed" time="1 hour ago" status="Warning" />
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                        <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
                        <div className="space-y-4">
                            <ActionButton title="Export User Data" icon={DocumentTextIcon} />
                            <ActionButton title="Broadcast Message" icon={EnvelopeIcon} />
                            <ActionButton title="Backup Database" icon={Squares2X2Icon} />
                            <ActionButton title="Update Pricing" icon={ArrowTrendingUpIcon} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function AdminStatCard({ title, value, trend, icon: Icon, color = "text-[#30d9fe]" }: any) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-white/5 ${color}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black px-2 py-1 rounded-full bg-white/5 text-gray-400">{trend}</span>
            </div>
            <div className="text-2xl font-black text-white mb-1">{value}</div>
            <div className="text-sm font-bold text-gray-500">{title}</div>
        </div>
    );
}

function ActivityRow({ user, action, time, status }: any) {
    return (
        <tr className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
            <td className="py-4 font-bold text-white">{user}</td>
            <td className="py-4 text-gray-400">{action}</td>
            <td className="py-4 text-gray-500 text-xs">{time}</td>
            <td className="py-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${status === 'Success' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-500'}`}>{status}</span>
            </td>
        </tr>
    );
}

function ActionButton({ title, icon: Icon }: any) {
    return (
        <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-[#30d9fe] hover:text-[#03325a] transition-all group">
            <div className="flex items-center gap-3 font-bold text-sm">
                <Icon className="w-5 h-5 opacity-50 group-hover:opacity-100" />
                {title}
            </div>
            <span>→</span>
        </button>
    );
}
