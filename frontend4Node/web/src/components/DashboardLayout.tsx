"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
    UserCircleIcon,
    Cog6ToothIcon,
    BellIcon,
    Bars3Icon,
    XMarkIcon,
    ArrowLeftOnRectangleIcon,
    HomeIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';

const DashboardLayout = ({ children, sidebarItems = [], activeTab, setActiveTab, title = 'Dashboard' }: any) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    // Mock user for UI replication
    const [user, setUser] = useState<any>({
        first_name: 'John',
        last_name: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        role: 'learner',
        avatar: null,
        unique_id: 'C2D-12345678'
    });

    const getInitials = (user: any) => {
        if (user?.first_name && user?.last_name) {
            return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
        }
        return user?.username ? user.username.substring(0, 2).toUpperCase() : 'U';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#03325a] to-slate-900 font-sans">
            {/* Header */}
            <header className="bg-[#03325a] border-b border-[#30d9fe]/20 sticky top-0 z-40">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden text-white hover:text-[#30d9fe] transition-colors p-2"
                        >
                            {sidebarOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                        </button>
                        <Link href="/" className="flex items-center">
                            <img src="/assets/logo2-clear.png" alt="Code2Deploy" className="h-10 w-auto" />
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link href="/notifications" className="p-2 text-gray-300 hover:text-[#30d9fe]">
                            <BellIcon className="w-6 h-6" />
                        </Link>
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#30d9fe] to-[#eec262] flex items-center justify-center text-[#03325a] font-bold text-sm overflow-hidden">
                                    {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <span>{getInitials(user)}</span>}
                                </div>
                                <ChevronDownIcon className="hidden sm:block w-4 h-4 text-gray-300" />
                            </button>
                            {isProfileDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                                    <div className="px-4 py-3 border-b border-gray-200">
                                        <p className="text-sm font-semibold text-gray-800">{user.first_name} {user.last_name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Profile</Link>
                                    <button onClick={() => router.push('/')} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex h-[calc(100vh-64px)] overflow-hidden">
                {/* Sidebar */}
                <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 lg:bg-transparent transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} border-r border-[#30d9fe]/20 overflow-y-auto`}>
                    <div className="p-6">
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#30d9fe] to-[#eec262] flex items-center justify-center text-[#03325a] font-bold">
                                {getInitials(user)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-bold truncate">{user.first_name}</p>
                                <p className="text-[#30d9fe] text-xs truncate">@{user.username}</p>
                            </div>
                        </div>
                        <nav className="space-y-1">
                            {sidebarItems.map((item: any) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-[#30d9fe] text-[#03325a] shadow-lg shadow-[#30d9fe]/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-bold text-sm">{item.name}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
