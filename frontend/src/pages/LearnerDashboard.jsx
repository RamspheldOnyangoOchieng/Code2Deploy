import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import { API_BASE_URL } from '../config/api';
import DashboardLayout from '../components/DashboardLayout';
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

  // Get pending assignments count
  const pendingAssignments = assignments.filter(a => a.status === 'pending' || !a.submitted).length;

  // Sidebar items for learner dashboard
  const sidebarItems = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'assignments', name: 'Assignments & Tests', icon: ClipboardDocumentCheckIcon, badge: pendingAssignments > 0 ? pendingAssignments : null },
    { id: 'sessions', name: 'Upcoming Sessions', icon: PlayCircleIcon },
    { id: 'programs', name: 'My Programs', icon: AcademicCapIcon },
    { id: 'events', name: 'My Events', icon: CalendarIcon },
    { id: 'certificates', name: 'Certificates', icon: DocumentTextIcon },
    { id: 'badges', name: 'Badges', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon, badge: notifications.length > 0 ? notifications.length : null },
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
    <DashboardLayout
      sidebarItems={sidebarItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      title="Learner Dashboard"
    >
      {/* Main Content */}
      <div className="space-y-6">
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
                          <span className={`ml-4 px-3 py-1 text-xs rounded-full font-medium ${enrollment.status === 'completed'
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
                          <span className={`px-3 py-1 text-xs rounded-full font-medium ${assignment.status === 'completed' || assignment.submitted
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
                          <span className={`px-3 py-1 text-xs rounded-full font-medium ${session.status === 'completed'
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
                        <span className={`ml-4 px-2 py-1 text-xs rounded-full font-medium ${enrollment.status === 'completed'
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
                        <span className={`ml-4 px-2 py-1 text-xs rounded-full font-medium ${registration.status === 'attended'
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
    </DashboardLayout>
  );
};

export default LearnerDashboard;

