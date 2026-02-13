"use client";

import { useState } from 'react';
import Link from 'next/link';
import {
    UserCircleIcon,
    EnvelopeIcon,
    PhoneIcon,
    BuildingOfficeIcon,
    CalendarIcon,
    ShieldCheckIcon,
    CameraIcon,
    KeyIcon,
    ArrowLeftIcon,
    CheckIcon,
    PencilIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import OriginalLayout from '@/components/OriginalLayout';

export default function ProfilePage() {
    const [editing, setEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('account');

    // Mock user
    const user = {
        first_name: 'John',
        last_name: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        phone: '+254 743 864 7890',
        organization: 'Tech Hub Nairobi',
        role: 'learner',
        date_joined: '2024-01-15',
        unique_id: 'C2D-A9B8C7D6E5F4'
    };

    return (
        <OriginalLayout>
            <div className="min-h-screen bg-slate-900 font-sans pb-20">
                {/* Header */}
                <div className="bg-[#03325a] border-b border-white/10 py-12">
                    <div className="container mx-auto px-4 md:px-6">
                        <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-[#30d9fe] mb-8 transition-colors">
                            <ArrowLeftIcon className="w-5 h-5" />
                            <span>Back to Dashboard</span>
                        </Link>

                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="relative group">
                                <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-[#30d9fe] to-[#eec262] rounded-full flex items-center justify-center text-white text-4xl font-black shadow-2xl border-4 border-white/10">
                                    <span>JD</span>
                                </div>
                                <button className="absolute bottom-2 right-2 w-10 h-10 bg-[#30d9fe] rounded-full flex items-center justify-center shadow-lg hover:rotate-12 transition-transform">
                                    <CameraIcon className="w-6 h-6 text-[#03325a]" />
                                </button>
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-4xl md:text-5xl font-black text-white mb-2">{user.first_name} {user.last_name}</h1>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                    <span className="text-[#30d9fe] font-bold">@{user.username}</span>
                                    <span className="text-gray-500">•</span>
                                    <span className="text-gray-300 font-medium">{user.email}</span>
                                </div>
                                <div className="flex gap-4 mt-6 justify-center md:justify-start">
                                    <span className="bg-green-500/20 text-green-400 px-4 py-1 rounded-full text-sm font-bold border border-green-500/20">Learner</span>
                                    <span className="text-gray-500 text-sm flex items-center gap-1">
                                        <CalendarIcon className="w-4 h-4" />
                                        Joined Jan 2024
                                    </span>
                                </div>
                            </div>

                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                                <p className="text-xs text-gray-500 mb-1 uppercase tracking-widest font-bold">Unique ID</p>
                                <p className="text-[#30d9fe] font-mono font-bold tracking-tighter">{user.unique_id.slice(0, 12)}...</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-white/5 bg-[#03325a]/30">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="flex gap-8">
                            {['account', 'security', 'settings'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-6 px-2 font-bold uppercase text-sm tracking-widest transition-all border-b-2 ${activeTab === tab ? 'text-[#30d9fe] border-[#30d9fe]' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 md:px-6 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-8">
                            {activeTab === 'account' && (
                                <div className="bg-white/5 rounded-3xl p-8 border border-white/5 backdrop-blur-xl">
                                    <div className="flex justify-between items-center mb-10">
                                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                            <UserCircleIcon className="w-8 h-8 text-[#30d9fe]" />
                                            Personal Details
                                        </h2>
                                        {!editing && (
                                            <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-6 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all">
                                                <PencilIcon className="w-4 h-4" />
                                                Edit
                                            </button>
                                        )}
                                    </div>

                                    {editing ? (
                                        <form className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-400 mb-2 font-sans">First Name</label>
                                                    <input type="text" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#30d9fe]" defaultValue={user.first_name} />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-400 mb-2 font-sans">Last Name</label>
                                                    <input type="text" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#30d9fe]" defaultValue={user.last_name} />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-400 mb-2 font-sans">Phone Number</label>
                                                <input type="text" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#30d9fe]" defaultValue={user.phone} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-400 mb-2 font-sans">Organization</label>
                                                <input type="text" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#30d9fe]" defaultValue={user.organization} />
                                            </div>
                                            <div className="flex gap-4 pt-4">
                                                <button type="button" className="px-8 py-3 bg-[#30d9fe] text-[#03325a] font-bold rounded-xl" onClick={() => setEditing(false)}>Save Changes</button>
                                                <button type="button" className="px-8 py-3 bg-white/5 text-white font-bold rounded-xl" onClick={() => setEditing(false)}>Cancel</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <DetailItem label="Full Name" value={`${user.first_name} ${user.last_name}`} icon={UserCircleIcon} />
                                            <DetailItem label="Email" value={user.email} icon={EnvelopeIcon} />
                                            <DetailItem label="Phone" value={user.phone} icon={PhoneIcon} />
                                            <DetailItem label="Organization" value={user.organization} icon={BuildingOfficeIcon} />
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="bg-white/5 rounded-3xl p-8 border border-white/5 backdrop-blur-xl">
                                    <h2 className="text-2xl font-bold text-white mb-10 flex items-center gap-3">
                                        <ShieldCheckIcon className="w-8 h-8 text-[#eec262]" />
                                        Security Settings
                                    </h2>
                                    <div className="space-y-6">
                                        <SecurityAction title="Change Password" description="Update your password for better security." icon={KeyIcon} action="Change" />
                                        <SecurityAction title="Two-Factor Authentication" description="Add an extra layer of protection to your account." icon={ShieldCheckIcon} action="Enable" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-8">
                            <div className="bg-gradient-to-br from-[#30d9fe]/10 to-[#eec262]/10 p-8 rounded-3xl border border-white/10 text-center">
                                <h3 className="text-xl font-bold text-white mb-6">Account Status</h3>
                                <div className="flex justify-between items-center bg-black/20 p-4 rounded-xl mb-4">
                                    <span className="text-gray-400 text-sm">Status</span>
                                    <span className="text-green-400 font-bold">Verified</span>
                                </div>
                                <div className="flex justify-between items-center bg-black/20 p-4 rounded-xl">
                                    <span className="text-gray-400 text-sm">Tier</span>
                                    <span className="text-[#30d9fe] font-bold uppercase tracking-widest text-xs">Standard</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </OriginalLayout>
    );
}

function DetailItem({ label, value, icon: Icon }: any) {
    return (
        <div className="space-y-1">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {label}
            </p>
            <p className="text-lg text-white font-medium">{value}</p>
        </div>
    );
}

function SecurityAction({ title, description, icon: Icon, action }: any) {
    return (
        <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#30d9fe]" />
                </div>
                <div>
                    <h4 className="font-bold text-white">{title}</h4>
                    <p className="text-xs text-gray-400 mt-1">{description}</p>
                </div>
            </div>
            <button className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all font-bold text-sm">{action}</button>
        </div>
    );
}
