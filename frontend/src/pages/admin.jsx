import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import authService from '../services/authService';
import { API_BASE_URL } from '../config/api';
import AdminUsers from '../components/admin/AdminUsers';
import AdminPrograms from '../components/admin/AdminPrograms';
import AdminEvents from '../components/admin/AdminEvents';
import AdminCertificates from '../components/admin/AdminCertificates';
import AdminBadges from '../components/admin/AdminBadges';
import AdminMentors from '../components/admin/AdminMentors';
import AdminNotifications from '../components/admin/AdminNotifications';
import AdminSecurity from '../components/admin/AdminSecurity';
import AdminPages from '../components/admin/AdminPages';
import DashboardLayout from '../components/DashboardLayout';
import {
  ChartBarIcon,
  DocumentIcon,
  UsersIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  TrophyIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  DocumentTextIcon,
  BellIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const toast = useToast();
  const { logout, user } = useAuth(); // Use global auth context
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Logout is handled by DashboardLayout globally
  // Remove redundant local handlers if not used

  useEffect(() => {
    checkAdminAccess();
    if (activeTab === 'dashboard') {
      fetchDashboardStats();
    }
  }, [activeTab]);

  const checkAdminAccess = async () => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats/`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        toast.error('Failed to fetch dashboard stats');
      }
    } catch (err) {
      toast.error('Error fetching dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
    { id: 'pages', name: 'Pages', icon: DocumentIcon },
    { id: 'users', name: 'Users', icon: UsersIcon },
    { id: 'programs', name: 'Programs', icon: AcademicCapIcon },
    { id: 'events', name: 'Events', icon: CalendarDaysIcon },
    { id: 'certificates', name: 'Certificates', icon: TrophyIcon },
    { id: 'badges', name: 'Badges', icon: ShieldCheckIcon },
    { id: 'mentors', name: 'Mentors', icon: UserGroupIcon },
    { id: 'applications', name: 'Applications', icon: DocumentTextIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: LockClosedIcon }
  ];

  const renderDashboard = () => (
    <div className="space-y-8">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#30d9fe] border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 shadow-md">
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      ) : stats ? (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Users Stats */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg md:rounded-xl shadow-lg p-4 md:p-6 text-white hover:scale-105 transition-all duration-300">
              <div className="flex items-start justify-between mb-3 md:mb-4">
                <div>
                  <p className="text-xs md:text-sm font-medium text-blue-100 mb-1">Total Users</p>
                  <p className="text-2xl md:text-4xl font-bold">{stats.users?.total || 0}</p>
                </div>
                <div className="bg-white/20 rounded-lg p-2 md:p-3">
                  <span className="text-2xl md:text-4xl">👥</span>
                </div>
              </div>
              <div className="pt-4 border-t border-blue-400/30 space-y-1">
                <p className="text-sm text-blue-100">Active: <span className="font-semibold text-white">{stats.users?.active || 0}</span></p>
                <p className="text-sm text-blue-100">New (30d): <span className="font-semibold text-white">{stats.users?.new_30_days || 0}</span></p>
              </div>
            </div>

            {/* Programs Stats */}
            <div className="bg-gradient-to-br from-[#03325a] to-[#0A0F2C] rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-1">Programs</p>
                  <p className="text-4xl font-bold">{stats.programs?.total || 0}</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <span className="text-4xl">📚</span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-600/30 space-y-1">
                <p className="text-sm text-gray-300">Enrollments: <span className="font-semibold text-white">{stats.programs?.enrollments?.total || 0}</span></p>
                <p className="text-sm text-gray-300">Active: <span className="font-semibold text-white">{stats.programs?.enrollments?.active || 0}</span></p>
              </div>
            </div>

            {/* Events Stats */}
            <div className="bg-gradient-to-br from-[#eec262] to-[#d4a952] rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-orange-100 mb-1">Events</p>
                  <p className="text-4xl font-bold">{stats.events?.total || 0}</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <span className="text-4xl">🎫</span>
                </div>
              </div>
              <div className="pt-4 border-t border-orange-300/30 space-y-1">
                <p className="text-sm text-orange-100">Registrations: <span className="font-semibold text-white">{stats.events?.registrations?.total || 0}</span></p>
                <p className="text-sm text-orange-100">Upcoming: <span className="font-semibold text-white">{stats.events?.registrations?.upcoming || 0}</span></p>
              </div>
            </div>

            {/* Certificates Stats */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-purple-100 mb-1">Certificates</p>
                  <p className="text-4xl font-bold">{stats.certificates?.total || 0}</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <span className="text-4xl">🏆</span>
                </div>
              </div>
              <div className="pt-4 border-t border-purple-400/30 space-y-1">
                <p className="text-sm text-purple-100">Issued: <span className="font-semibold text-white">{stats.certificates?.issued || 0}</span></p>
                <p className="text-sm text-purple-100">Badges: <span className="font-semibold text-white">{stats.badges?.total || 0}</span></p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          {stats?.recent_activity && (
            <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-lg p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-[#03325a]">Recent Activity</h3>
                <span className="bg-[#30d9fe] text-[#03325a] text-xs font-bold px-3 py-1 rounded-full">Last 7 days</span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300 border border-blue-200">
                  <div className="text-5xl font-extrabold text-blue-600 mb-2">{stats.recent_activity.enrollments}</div>
                  <p className="text-sm font-semibold text-blue-700">Enrollments</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300 border border-green-200">
                  <div className="text-5xl font-extrabold text-green-600 mb-2">{stats.recent_activity.registrations}</div>
                  <p className="text-sm font-semibold text-green-700">Registrations</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300 border border-yellow-200">
                  <div className="text-5xl font-extrabold text-yellow-600 mb-2">{stats.recent_activity.certificates}</div>
                  <p className="text-sm font-semibold text-yellow-700">Certificates</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300 border border-purple-200">
                  <div className="text-5xl font-extrabold text-purple-600 mb-2">{stats.recent_activity.badges}</div>
                  <p className="text-sm font-semibold text-purple-700">Badges</p>
                </div>
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      title="Admin Dashboard"
    >
      <div className="bg-white rounded-lg md:rounded-xl shadow-lg border border-gray-200 p-4 md:p-6 lg:p-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'pages' && <AdminPages />}
        {activeTab === 'users' && <AdminUsers />}
        {activeTab === 'programs' && <AdminPrograms />}
        {activeTab === 'events' && <AdminEvents />}
        {activeTab === 'certificates' && <AdminCertificates />}
        {activeTab === 'badges' && <AdminBadges />}
        {activeTab === 'mentors' && <AdminMentors />}
        {activeTab === 'applications' && <div className="text-center py-8 text-sm md:text-base text-gray-500">Applications Management - Coming Soon</div>}
        {activeTab === 'notifications' && <AdminNotifications />}
        {activeTab === 'security' && <AdminSecurity />}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard; 