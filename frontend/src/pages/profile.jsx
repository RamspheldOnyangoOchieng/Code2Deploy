import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import {
  UserCircleIcon,
  AcademicCapIcon,
  CalendarIcon,
  BellIcon,
  ArrowLeftOnRectangleIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  CameraIcon,
  Cog6ToothIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [eventRegistrations, setEventRegistrations] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [badges, setBadges] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadUserData();
  }, [navigate]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const [
        userData,
        enrollmentsData,
        eventRegistrationsData,
        certificatesData,
        badgesData,
        notificationsData
      ] = await Promise.all([
        authService.getCurrentUser(),
        authService.getUserEnrollments(),
        authService.getUserEventRegistrations(),
        authService.getUserCertificates(),
        authService.getUserBadges(),
        authService.getUserNotifications()
      ]);

      setUser(userData);
      setEnrollments(enrollmentsData.results || enrollmentsData);
      setEventRegistrations(eventRegistrationsData.results || eventRegistrationsData);
      setCertificates(certificatesData.results || certificatesData);
      setBadges(badgesData.results || badgesData);
      setNotifications(notificationsData.results || notificationsData);
      setEditForm({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        phone: userData.phone || '',
        organization: userData.organization || ''
      });
    } catch (err) {
      setError('Failed to load user data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await authService.updateProfile(editForm);
      setUser(updatedUser);
      setEditing(false);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    try {
      setUploadingAvatar(true);
      setError('');
      const updatedUser = await authService.uploadAvatar(file);
      setUser(updatedUser);
    } catch (err) {
      setError('Failed to upload avatar');
      console.error(err);
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Get role-specific dashboard info
  const getRoleDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return { path: '/admin', label: 'Admin Dashboard', icon: Cog6ToothIcon, color: 'bg-purple-500' };
      case 'mentor':
        return { path: '/mentor-dashboard', label: 'Mentor Dashboard', icon: UsersIcon, color: 'bg-teal-500' };
      default:
        return null;
    }
  };

  const roleDashboard = getRoleDashboard();

  const sidebarItems = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'profile', name: 'Profile Info', icon: UserCircleIcon },
    { id: 'programs', name: 'My Programs', icon: AcademicCapIcon },
    { id: 'events', name: 'My Events', icon: CalendarIcon },
    { id: 'certificates', name: 'Certificates', icon: DocumentTextIcon },
    { id: 'badges', name: 'Badges', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#03325a] to-slate-900">
      <div className="flex h-screen overflow-hidden">
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-gradient-to-b from-[#03325a] to-slate-900
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300 ease-in-out
          border-r border-[#30d9fe]/20
        `}>
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-[#30d9fe]/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative group">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#30d9fe] to-[#eec262] rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg ring-4 ring-[#30d9fe]/30 overflow-hidden">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{user?.first_name?.[0]}{user?.last_name?.[0]}</span>
                    )}
                  </div>
                  <button
                    onClick={handleAvatarClick}
                    disabled={uploadingAvatar}
                    className="absolute inset-0 w-16 h-16 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
                    title="Change avatar"
                  >
                    {uploadingAvatar ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <CameraIcon className="w-6 h-6 text-white" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-white font-bold text-lg truncate">
                    {user?.first_name} {user?.last_name}
                  </h2>
                  <p className="text-[#30d9fe] text-sm truncate">@{user?.username}</p>
                  {user?.role && (
                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                      user.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50' :
                      user.role === 'mentor' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/50' :
                      user.role === 'sponsor' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50' :
                      user.role === 'partner' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50' :
                      'bg-green-500/20 text-green-300 border border-green-500/50'
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-400">
                ID: {user?.unique_id}
              </div>
            </div>

            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
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
                    <span className="font-medium">{item.name}</span>
                    {item.id === 'notifications' && notifications.length > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-[#30d9fe]/20 space-y-3">
              {/* Role-specific Dashboard Link */}
              {roleDashboard && (
                <Link
                  to={roleDashboard.path}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-3 ${roleDashboard.color} hover:opacity-90 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg`}
                >
                  <roleDashboard.icon className="w-5 h-5" />
                  <span>{roleDashboard.label}</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500/90 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 overflow-y-auto">
          <div className="lg:hidden bg-[#03325a] border-b border-[#30d9fe]/20 p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-[#30d9fe] via-[#03325a] to-[#eec262] rounded-2xl p-8 text-white shadow-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                        Welcome back, {user?.first_name}! 👋
                      </h1>
                      <p className="text-white/90">{user?.email}</p>
                      <p className="text-sm text-white/70 mt-2">
                        Member since {new Date(user?.date_joined).toLocaleDateString()}
                      </p>
                    </div>
                    {roleDashboard && (
                      <Link
                        to={roleDashboard.path}
                        className={`mt-4 sm:mt-0 inline-flex items-center space-x-2 px-6 py-3 ${roleDashboard.color} hover:opacity-90 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg`}
                      >
                        <roleDashboard.icon className="w-5 h-5" />
                        <span>Go to {roleDashboard.label}</span>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Role Badge */}
                {user?.role && (
                  <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-300">Your Role:</span>
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-purple-500 text-white' :
                        user.role === 'mentor' ? 'bg-teal-500 text-white' :
                        user.role === 'sponsor' ? 'bg-yellow-500 text-gray-900' :
                        user.role === 'partner' ? 'bg-blue-500 text-white' :
                        'bg-green-500 text-white'
                      }`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                    {roleDashboard && (
                      <span className="text-sm text-gray-400">
                        Access your {user.role} tools in the dashboard →
                      </span>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white/10 backdrop-blur-lg border border-[#30d9fe]/30 rounded-xl p-6 text-center hover:scale-105 transition-transform duration-200">
                    <AcademicCapIcon className="w-8 h-8 text-[#30d9fe] mx-auto mb-2" />
                    <div className="text-3xl font-bold text-white mb-1">{enrollments.length}</div>
                    <div className="text-sm text-gray-300">Programs</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-lg border border-[#eec262]/30 rounded-xl p-6 text-center hover:scale-105 transition-transform duration-200">
                    <CalendarIcon className="w-8 h-8 text-[#eec262] mx-auto mb-2" />
                    <div className="text-3xl font-bold text-white mb-1">{eventRegistrations.length}</div>
                    <div className="text-sm text-gray-300">Events</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-lg border border-green-400/30 rounded-xl p-6 text-center hover:scale-105 transition-transform duration-200">
                    <DocumentTextIcon className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-white mb-1">{certificates.length}</div>
                    <div className="text-sm text-gray-300">Certificates</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-lg border border-purple-400/30 rounded-xl p-6 text-center hover:scale-105 transition-transform duration-200">
                    <ShieldCheckIcon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-white mb-1">{badges.length}</div>
                    <div className="text-sm text-gray-300">Badges</div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <ChartBarIcon className="w-6 h-6 mr-2 text-[#30d9fe]" />
                    Recent Activity
                  </h2>
                  <div className="space-y-3">
                    {enrollments.length === 0 && eventRegistrations.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">No recent activity</p>
                    ) : (
                      <>
                        {enrollments.slice(0, 3).map((enrollment) => (
                          <div key={enrollment.id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-white">{enrollment.program.title}</h3>
                                <p className="text-sm text-gray-400 mt-1">Progress: {enrollment.progress}%</p>
                              </div>
                              <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                enrollment.status === 'completed' 
                                  ? 'bg-green-500/20 text-green-300 border border-green-500/50' 
                                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                              }`}>
                                {enrollment.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <UserCircleIcon className="w-7 h-7 mr-2 text-[#30d9fe]" />
                      Profile Information
                    </h2>
                    <button
                      onClick={() => setEditing(!editing)}
                      className="px-4 py-2 bg-[#30d9fe] text-[#03325a] font-semibold rounded-lg hover:bg-[#30d9fe]/90 transition-all shadow-lg"
                    >
                      {editing ? 'Cancel' : 'Edit Profile'}
                    </button>
                  </div>

                  {editing ? (
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-1">First Name</label>
                        <input
                          type="text"
                          value={editForm.first_name}
                          onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-1">Last Name</label>
                        <input
                          type="text"
                          value={editForm.last_name}
                          onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-1">Organization</label>
                        <input
                          type="text"
                          value={editForm.organization}
                          onChange={(e) => setEditForm({...editForm, organization: e.target.value})}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                        />
                      </div>
                      <button type="submit" className="w-full py-2 bg-[#30d9fe] text-[#03325a] font-semibold rounded-lg hover:bg-opacity-90 transition-all">
                        Save Changes
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-start justify-between py-3 border-b border-white/10">
                        <span className="text-sm font-semibold text-gray-400">Email:</span>
                        <p className="text-white text-right">{user?.email}</p>
                      </div>
                      <div className="flex items-start justify-between py-3 border-b border-white/10">
                        <span className="text-sm font-semibold text-gray-400">Phone:</span>
                        <p className="text-white text-right">{user?.phone || 'Not provided'}</p>
                      </div>
                      <div className="flex items-start justify-between py-3 border-b border-white/10">
                        <span className="text-sm font-semibold text-gray-400">Organization:</span>
                        <p className="text-white text-right">{user?.organization || 'Not provided'}</p>
                      </div>
                      <div className="flex items-start justify-between py-3 border-b border-white/10">
                        <span className="text-sm font-semibold text-gray-400">Role:</span>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                          user?.role === 'admin' ? 'bg-purple-500 text-white' :
                          user?.role === 'mentor' ? 'bg-teal-500 text-white' :
                          user?.role === 'sponsor' ? 'bg-yellow-500 text-gray-900' :
                          user?.role === 'partner' ? 'bg-blue-500 text-white' :
                          'bg-green-500 text-white'
                        }`}>
                          {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Learner'}
                        </span>
                      </div>
                      <div className="flex items-start justify-between py-3">
                        <span className="text-sm font-semibold text-gray-400">Member Since:</span>
                        <p className="text-white text-right">{new Date(user?.date_joined).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'programs' && (
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl">
                  <h2 className="text-2xl font-bold text-white flex items-center mb-4">
                    <AcademicCapIcon className="w-7 h-7 mr-2 text-[#30d9fe]" />
                    My Programs
                  </h2>
                  {enrollments.length > 0 ? (
                    <div className="space-y-4">
                      {enrollments.map((enrollment) => (
                        <div key={enrollment.id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-white">{enrollment.program.title}</h3>
                              <p className="text-sm text-gray-300 mt-1">{enrollment.program.description}</p>
                              <div className="mt-2 flex items-center gap-2">
                                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                  enrollment.status === 'completed' 
                                    ? 'bg-green-500/20 text-green-300 border border-green-500/50' 
                                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                                }`}>
                                  {enrollment.status}
                                </span>
                                <span className="text-sm text-gray-400">Progress: {enrollment.progress}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-8">No program enrollments yet.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl">
                  <h2 className="text-2xl font-bold text-white flex items-center mb-4">
                    <CalendarIcon className="w-7 h-7 mr-2 text-[#eec262]" />
                    My Events
                  </h2>
                  {eventRegistrations.length > 0 ? (
                    <div className="space-y-4">
                      {eventRegistrations.map((registration) => (
                        <div key={registration.id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-white">{registration.event.title}</h3>
                              <p className="text-sm text-gray-300 mt-1">{registration.event.description}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(registration.event.date).toLocaleDateString()}
                              </p>
                              <div className="mt-2">
                                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                  registration.status === 'attended' 
                                    ? 'bg-green-500/20 text-green-300 border border-green-500/50' 
                                    : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
                                }`}>
                                  {registration.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-8">No event registrations yet.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'certificates' && (
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl">
                  <h2 className="text-2xl font-bold text-white flex items-center mb-4">
                    <DocumentTextIcon className="w-7 h-7 mr-2 text-green-400" />
                    Certificates
                  </h2>
                  {certificates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {certificates.map((cert) => (
                        <div key={cert.id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all">
                          <h3 className="font-semibold text-white">{cert.title}</h3>
                          <p className="text-sm text-gray-300 mt-1">{cert.description}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            Awarded: {new Date(cert.awarded_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-8">No certificates yet.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'badges' && (
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl">
                  <h2 className="text-2xl font-bold text-white flex items-center mb-4">
                    <ShieldCheckIcon className="w-7 h-7 mr-2 text-purple-400" />
                    Badges
                  </h2>
                  {badges.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {badges.map((badge) => (
                        <div key={badge.id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all">
                          <h3 className="font-semibold text-white">{badge.title}</h3>
                          <p className="text-sm text-gray-300 mt-1">{badge.description}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            Awarded: {new Date(badge.awarded_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-8">No badges yet.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl">
                  <h2 className="text-2xl font-bold text-white flex items-center mb-4">
                    <BellIcon className="w-7 h-7 mr-2 text-[#30d9fe]" />
                    Notifications
                  </h2>
                  {notifications.length > 0 ? (
                    <div className="space-y-3">
                      {notifications.map((notification, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all">
                          <p className="text-sm text-white">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-8">No notifications yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
