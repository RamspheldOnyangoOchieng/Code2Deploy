import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import LogoutModal from './LogoutModal';
import logo from '../assets/logo2-clear.png';
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

const DashboardLayout = ({ children, sidebarItems = [], activeTab, setActiveTab, title = 'Dashboard' }) => {
    const [user, setUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            navigate('/');
            return;
        }
        authService.getCurrentUser().then(setUser).catch(console.error);
    }, [navigate]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isProfileDropdownOpen && !event.target.closest('.profile-dropdown')) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isProfileDropdownOpen]);

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
        setIsProfileDropdownOpen(false);
    };

    const handleLogoutConfirm = () => {
        authService.logout();
        setIsLogoutModalOpen(false);
        navigate('/');
    };

    const getInitials = (user) => {
        if (user?.first_name && user?.last_name) {
            return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
        }
        return user?.username ? user.username.substring(0, 2).toUpperCase() : 'U';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#03325a] to-slate-900">
            {/* Dashboard Header - Simplified with Profile & Settings */}
            <header className="bg-[#03325a] border-b border-[#30d9fe]/20 sticky top-0 z-40">
                <div className="flex items-center justify-between px-4 py-3">
                    {/* Left Side - Mobile Menu Toggle & Logo */}
                    <div className="flex items-center space-x-4">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden text-white hover:text-[#30d9fe] transition-colors p-2"
                        >
                            {sidebarOpen ? (
                                <XMarkIcon className="w-6 h-6" />
                            ) : (
                                <Bars3Icon className="w-6 h-6" />
                            )}
                        </button>

                        {/* Logo */}
                        <Link to="/" className="flex items-center">
                            <img src={logo} alt="Code2Deploy" className="h-8 sm:h-10 w-auto" />
                        </Link>
                    </div>

                    {/* Right Side - Notifications, Settings, Profile */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Notifications */}
                        <button className="relative p-2 text-gray-300 hover:text-[#30d9fe] transition-colors">
                            <BellIcon className="w-6 h-6" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* Settings */}
                        <Link to="/profile" className="p-2 text-gray-300 hover:text-[#30d9fe] transition-colors">
                            <Cog6ToothIcon className="w-6 h-6" />
                        </Link>

                        {/* Profile Dropdown */}
                        <div className="relative profile-dropdown">
                            <button
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#30d9fe] to-[#eec262] flex items-center justify-center text-[#03325a] font-bold text-sm overflow-hidden">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{getInitials(user)}</span>
                                    )}
                                </div>
                                <ChevronDownIcon className={`hidden sm:block w-4 h-4 text-gray-300 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                                    <div className="px-4 py-3 border-b border-gray-200">
                                        <p className="text-sm font-semibold text-gray-800">{user?.first_name} {user?.last_name}</p>
                                        <p className="text-xs text-gray-500">{user?.email}</p>
                                        {user?.role && (
                                            <span className="inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full bg-[#30d9fe] text-[#03325a]">
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </span>
                                        )}
                                    </div>

                                    <Link
                                        to="/"
                                        onClick={() => setIsProfileDropdownOpen(false)}
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                    >
                                        <HomeIcon className="w-4 h-4 mr-2" />
                                        Back to Home
                                    </Link>

                                    <Link
                                        to="/profile"
                                        onClick={() => setIsProfileDropdownOpen(false)}
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                    >
                                        <UserCircleIcon className="w-4 h-4 mr-2" />
                                        My Profile
                                    </Link>

                                    <Link
                                        to="/profile"
                                        onClick={() => setIsProfileDropdownOpen(false)}
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                    >
                                        <Cog6ToothIcon className="w-4 h-4 mr-2" />
                                        Settings
                                    </Link>

                                    <div className="border-t border-gray-200 my-1"></div>

                                    <button
                                        onClick={handleLogoutClick}
                                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                                    >
                                        <ArrowLeftOnRectangleIcon className="w-4 h-4 mr-2" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex h-[calc(100vh-60px)]">
                {/* Sidebar */}
                <aside className={`
          fixed lg:static inset-y-0 left-0 z-30 top-[60px]
          w-64 bg-gradient-to-b from-[#03325a] to-slate-900
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300 ease-in-out
          border-r border-[#30d9fe]/20
          overflow-y-auto
        `}>
                    <div className="h-full flex flex-col">
                        {/* User Profile Section in Sidebar */}
                        {user && (
                            <div className="p-4 border-b border-[#30d9fe]/20">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#30d9fe] to-[#eec262] flex items-center justify-center text-white font-bold overflow-hidden">
                                        {user?.avatar ? (
                                            <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <span>{getInitials(user)}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-white font-semibold text-sm truncate">
                                            {user?.first_name} {user?.last_name}
                                        </h2>
                                        <p className="text-[#30d9fe] text-xs truncate">@{user?.username}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation */}
                        <nav className="flex-1 px-3 py-4 space-y-1">
                            {sidebarItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setActiveTab(item.id);
                                            setSidebarOpen(false);
                                        }}
                                        className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                      transition-all duration-200 group
                      ${activeTab === item.id
                                                ? 'bg-[#30d9fe] text-[#03325a] shadow-lg shadow-[#30d9fe]/50'
                                                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                            }
                    `}
                                    >
                                        <Icon className={`w-5 h-5 ${activeTab === item.id ? 'animate-pulse' : ''}`} />
                                        <span className="font-medium text-sm">{item.name}</span>
                                        {item.badge && (
                                            <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                {item.badge}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Bottom Actions */}
                        <div className="p-4 border-t border-[#30d9fe]/20 space-y-2">
                            <Link
                                to="/"
                                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#30d9fe]/20 hover:bg-[#30d9fe]/30 text-[#30d9fe] font-semibold rounded-lg transition-all duration-200 border border-[#30d9fe]/30"
                            >
                                <HomeIcon className="w-5 h-5" />
                                <span>Back to Home</span>
                            </Link>
                            <button
                                onClick={handleLogoutClick}
                                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-lg transition-all duration-200 border border-red-500/30"
                            >
                                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Mobile Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-20 lg:hidden top-[60px]"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>

            {/* Logout Modal */}
            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogoutConfirm}
            />
        </div>
    );
};

export default DashboardLayout;
