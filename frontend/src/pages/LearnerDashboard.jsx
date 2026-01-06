import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import { API_BASE_URL } from '../config/api';
import LogoutModal from '../components/LogoutModal';
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
  BookOpenIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon,
  PlayCircleIcon,
  ClockIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

const LearnerDashboard = () => {
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [eventRegistrations, setEventRegistrations] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [badges, setBadges] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

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

      // Load learner-specific data
      loadAssignments();
      loadUpcomingSessions();
    } catch (err) {
      setError('Failed to load user data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadAssignments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/programs/my-assignments/`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAssignments(data.results || data);
      }
    } catch (err) {
      console.error('Failed to load assignments:', err);
    }
  };

  const loadUpcomingSessions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/mentors/my-sessions/`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUpcomingSessions(data.results || data);
      }
    } catch (err) {
      console.error('Failed to load sessions:', err);
    }
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    authService.logout();
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPG, PNG, GIF, or WebP)');
      return;
    }

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

  // Sidebar items for learner dashboard
  const sidebarItems = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'assignments', name: 'Assignments & Tests', icon: ClipboardDocumentCheckIcon },
    { id: 'sessions', name: 'Upcoming Sessions', icon: PlayCircleIcon },
    { id: 'programs', name: 'My Programs', icon: AcademicCapIcon },
    { id: 'events', name: 'My Events', icon: CalendarIcon },
    { id: 'certificates', name: 'Certificates', icon: DocumentTextIcon },
    { id: 'badges', name: 'Badges', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
  ];

  // Get pending assignments count
  const pendingAssignments = assignments.filter(a => a.status === 'pending' || !a.submitted).length;

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
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-gradient-to-b from-[#03325a] to-slate-900
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300 ease-in-out
          border-r border-[#30d9fe]/20
        `}>
          <div className="h-full flex flex-col">
            {/* User Profile Section */}
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
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-green-500/20 text-green-300 border border-green-500/50">
                    Learner
                  </span>
                </div>
              </div>
              <div 
                onClick={() => copyToClipboard(user?.unique_id)}
                className="text-xs text-gray-400 flex items-center gap-2 cursor-pointer hover:text-[#30d9fe] transition-colors group"
                title="Click to copy ID"
              >
                <span>ID: {user?.unique_id}</span>
                {copied ? (
                  <ClipboardDocumentCheckIcon className="w-4 h-4 text-green-400" />
                ) : (
                  <ClipboardDocumentIcon className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                )}
              </div>
            </div>

            {/* Navigation */}
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
                    {item.id === 'assignments' && pendingAssignments > 0 && (
                      <span className="ml-auto bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {pendingAssignments}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-[#30d9fe]/20 space-y-2">
              <Link
                to="/profile"
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all duration-200"
              >
                <UserCircleIcon className="w-5 h-5" />
                <span>Profile</span>
              </Link>
              <div className="flex gap-2">
                <Link
                  to="/"
                  className="flex-1 flex items-center justify-center space-x-2 px-3 py-2.5 bg-[#30d9fe]/20 hover:bg-[#30d9fe]/30 text-[#30d9fe] font-semibold rounded-lg transition-all duration-200 border border-[#30d9fe]/30"
                >
                  <HomeIcon className="w-5 h-5" />
                  <span>Home</span>
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="flex-1 flex items-center justify-center space-x-2 px-3 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-lg transition-all duration-200 border border-red-500/30"
                >
                  <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Mobile Header */}
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
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Welcome Banner */}
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
                  </div>
                </div>

                {/* Quick Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {pendingAssignments > 0 && (
                    <div 
                      onClick={() => setActiveTab('assignments')}
                      className="bg-yellow-500/20 backdrop-blur-lg border border-yellow-500/30 rounded-xl p-4 cursor-pointer hover:bg-yellow-500/30 transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <ExclamationCircleIcon className="w-8 h-8 text-yellow-400" />
                        <div>
                          <p className="text-white font-semibold">{pendingAssignments} Pending Assignments</p>
                          <p className="text-yellow-300 text-sm">Click to view and submit</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {upcomingSessions.length > 0 && (
                    <div 
                      onClick={() => setActiveTab('sessions')}
                      className="bg-blue-500/20 backdrop-blur-lg border border-blue-500/30 rounded-xl p-4 cursor-pointer hover:bg-blue-500/30 transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <ClockIcon className="w-8 h-8 text-blue-400" />
                        <div>
                          <p className="text-white font-semibold">{upcomingSessions.length} Upcoming Sessions</p>
                          <p className="text-blue-300 text-sm">Don't miss your sessions</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <Link 
                    to="/programs"
                    className="bg-green-500/20 backdrop-blur-lg border border-green-500/30 rounded-xl p-4 hover:bg-green-500/30 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <BookOpenIcon className="w-8 h-8 text-green-400" />
                      <div>
                        <p className="text-white font-semibold">Browse Programs</p>
                        <p className="text-green-300 text-sm">Explore new learning paths</p>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white/10 backdrop-blur-lg border border-[#30d9fe]/30 rounded-xl p-6 text-center hover:scale-105 transition-transform duration-200">
                    <AcademicCapIcon className="w-8 h-8 text-[#30d9fe] mx-auto mb-2" />
                    <div className="text-3xl font-bold text-white mb-1">{enrollments.length}</div>
                    <div className="text-sm text-gray-300">My Programs</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-lg border border-[#eec262]/30 rounded-xl p-6 text-center hover:scale-105 transition-transform duration-200">
                    <CalendarIcon className="w-8 h-8 text-[#eec262] mx-auto mb-2" />
                    <div className="text-3xl font-bold text-white mb-1">{eventRegistrations.length}</div>
                    <div className="text-sm text-gray-300">My Events</div>
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

                {/* Recent Activity */}
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
                                <h3 className="font-semibold text-white">{enrollment.program?.title || 'Program'}</h3>
                                <p className="text-sm text-gray-400 mt-1">Progress: {enrollment.progress || 0}%</p>
                                <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="bg-[#30d9fe] h-2 rounded-full transition-all" 
                                    style={{ width: `${enrollment.progress || 0}%` }}
                                  />
                                </div>
                              </div>
                              <span className={`ml-4 px-3 py-1 text-xs rounded-full font-medium ${
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

            {/* Assignments & Tests Tab */}
            {activeTab === 'assignments' && (
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl">
                  <h2 className="text-2xl font-bold text-white flex items-center mb-6">
                    <ClipboardDocumentCheckIcon className="w-7 h-7 mr-2 text-[#30d9fe]" />
                    Assignments & Tests
                  </h2>
                  
                  {assignments.length > 0 ? (
                    <div className="space-y-4">
                      {assignments.map((assignment) => (
                        <div key={assignment.id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-white">{assignment.title}</h3>
                              <p className="text-sm text-gray-300 mt-1">{assignment.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                <span>Program: {assignment.program_title}</span>
                                {assignment.due_date && (
                                  <span className="flex items-center">
                                    <ClockIcon className="w-4 h-4 mr-1" />
                                    Due: {new Date(assignment.due_date).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                assignment.status === 'completed' || assignment.submitted
                                  ? 'bg-green-500/20 text-green-300 border border-green-500/50' 
                                  : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
                              }`}>
                                {assignment.status === 'completed' || assignment.submitted ? 'Submitted' : 'Pending'}
                              </span>
                              {(!assignment.submitted && assignment.status !== 'completed') && (
                                <button className="px-4 py-2 bg-[#30d9fe] text-[#03325a] font-semibold rounded-lg hover:bg-[#30d9fe]/90 transition-all flex items-center gap-2">
                                  <ArrowUpTrayIcon className="w-4 h-4" />
                                  Submit
                                </button>
                              )}
                              {assignment.grade && (
                                <span className="px-3 py-1 text-sm font-semibold text-white bg-purple-500 rounded-lg">
                                  Grade: {assignment.grade}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ClipboardDocumentCheckIcon className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                      <p className="text-gray-400">No assignments yet.</p>
                      <p className="text-sm text-gray-500 mt-2">Enroll in a program to get started!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Upcoming Sessions Tab */}
            {activeTab === 'sessions' && (
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl">
                  <h2 className="text-2xl font-bold text-white flex items-center mb-6">
                    <PlayCircleIcon className="w-7 h-7 mr-2 text-[#30d9fe]" />
                    Upcoming Sessions
                  </h2>
                  
                  {upcomingSessions.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingSessions.map((session) => (
                        <div key={session.id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-white">{session.title}</h3>
                              <p className="text-sm text-gray-300 mt-1">{session.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                <span className="flex items-center">
                                  <CalendarIcon className="w-4 h-4 mr-1" />
                                  {new Date(session.scheduled_at).toLocaleString()}
                                </span>
                                <span>Mentor: {session.mentor_name}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                session.status === 'completed' 
                                  ? 'bg-green-500/20 text-green-300 border border-green-500/50' 
                                  : session.status === 'in_progress'
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                                  : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
                              }`}>
                                {session.status === 'completed' ? 'Completed' : session.status === 'in_progress' ? 'Live' : 'Scheduled'}
                              </span>
                              {session.meeting_link && session.status !== 'completed' && (
                                <a 
                                  href={session.meeting_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all flex items-center gap-2"
                                >
                                  <PlayCircleIcon className="w-4 h-4" />
                                  Join
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <PlayCircleIcon className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                      <p className="text-gray-400">No upcoming sessions.</p>
                      <p className="text-sm text-gray-500 mt-2">Your scheduled sessions will appear here.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Programs Tab */}
            {activeTab === 'programs' && (
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <AcademicCapIcon className="w-7 h-7 mr-2 text-[#30d9fe]" />
                      My Programs
                    </h2>
                    <Link 
                      to="/programs"
                      className="px-4 py-2 bg-[#30d9fe] text-[#03325a] font-semibold rounded-lg hover:bg-[#30d9fe]/90 transition-all"
                    >
                      Browse Programs
                    </Link>
                  </div>
                  {enrollments.length > 0 ? (
                    <div className="space-y-4">
                      {enrollments.map((enrollment) => (
                        <div key={enrollment.id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-white">{enrollment.program?.title}</h3>
                              <p className="text-sm text-gray-300 mt-1">{enrollment.program?.description}</p>
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-sm mb-1">
                                  <span className="text-gray-400">Progress</span>
                                  <span className="text-[#30d9fe]">{enrollment.progress || 0}%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-[#30d9fe] to-[#eec262] h-2 rounded-full transition-all" 
                                    style={{ width: `${enrollment.progress || 0}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                            <span className={`ml-4 px-2 py-1 text-xs rounded-full font-medium ${
                              enrollment.status === 'completed' 
                                ? 'bg-green-500/20 text-green-300 border border-green-500/50' 
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                            }`}>
                              {enrollment.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <AcademicCapIcon className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                      <p className="text-gray-400">No program enrollments yet.</p>
                      <Link to="/programs" className="text-[#30d9fe] hover:underline">Browse available programs</Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <CalendarIcon className="w-7 h-7 mr-2 text-[#eec262]" />
                      My Events
                    </h2>
                    <Link 
                      to="/events"
                      className="px-4 py-2 bg-[#eec262] text-[#03325a] font-semibold rounded-lg hover:bg-[#eec262]/90 transition-all"
                    >
                      Browse Events
                    </Link>
                  </div>
                  {eventRegistrations.length > 0 ? (
                    <div className="space-y-4">
                      {eventRegistrations.map((registration) => (
                        <div key={registration.id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-white">{registration.event?.title}</h3>
                              <p className="text-sm text-gray-300 mt-1">{registration.event?.description}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(registration.event?.date).toLocaleDateString()}
                              </p>
                            </div>
                            <span className={`ml-4 px-2 py-1 text-xs rounded-full font-medium ${
                              registration.status === 'attended' 
                                ? 'bg-green-500/20 text-green-300 border border-green-500/50' 
                                : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
                            }`}>
                              {registration.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CalendarIcon className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                      <p className="text-gray-400">No event registrations yet.</p>
                      <Link to="/events" className="text-[#eec262] hover:underline">Browse upcoming events</Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Certificates Tab */}
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
                          <div className="flex items-start gap-4">
                            <CheckCircleIcon className="w-10 h-10 text-green-400 flex-shrink-0" />
                            <div>
                              <h3 className="font-semibold text-white">{cert.title}</h3>
                              <p className="text-sm text-gray-300 mt-1">{cert.description}</p>
                              <p className="text-xs text-gray-400 mt-2">
                                Awarded: {new Date(cert.awarded_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <DocumentTextIcon className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                      <p className="text-gray-400">No certificates yet.</p>
                      <p className="text-sm text-gray-500 mt-2">Complete programs to earn certificates!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Badges Tab */}
            {activeTab === 'badges' && (
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl">
                  <h2 className="text-2xl font-bold text-white flex items-center mb-4">
                    <ShieldCheckIcon className="w-7 h-7 mr-2 text-purple-400" />
                    Badges
                  </h2>
                  {badges.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {badges.map((badge) => (
                        <div key={badge.id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all text-center">
                          <ShieldCheckIcon className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                          <h3 className="font-semibold text-white">{badge.title}</h3>
                          <p className="text-xs text-gray-400 mt-1">{badge.description}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(badge.awarded_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ShieldCheckIcon className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                      <p className="text-gray-400">No badges yet.</p>
                      <p className="text-sm text-gray-500 mt-2">Complete achievements to earn badges!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notifications Tab */}
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
                    <div className="text-center py-12">
                      <BellIcon className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                      <p className="text-gray-400">No notifications yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
};

export default LearnerDashboard;
