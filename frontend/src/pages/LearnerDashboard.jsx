import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import authService from '../services/authService';
import { API_BASE_URL } from '../config/api';
import { useToast } from '../contexts/ToastContext';
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
  const toast = useToast();
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
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

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
      toast.error('Failed to load user data');
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

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      activeTab={activeTab}
      setActiveTab={handleTabChange}
      title="Learner Dashboard"
    >
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#30d9fe] via-[#03325a] to-[#eec262] rounded-2xl p-8 text-white shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                    Welcome back, {user?.first_name}! 👋
                  </h1>
                  <p className="text-white/90">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pendingAssignments > 0 && (
                <div onClick={() => setActiveTab('assignments')} className="bg-yellow-500/20 backdrop-blur-lg border border-yellow-500/30 rounded-xl p-4 cursor-pointer hover:bg-yellow-500/30 transition-all">
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
                <div onClick={() => setActiveTab('sessions')} className="bg-blue-500/20 backdrop-blur-lg border border-blue-500/30 rounded-xl p-4 cursor-pointer hover:bg-blue-500/30 transition-all">
                  <div className="flex items-center space-x-3">
                    <ClockIcon className="w-8 h-8 text-blue-400" />
                    <div>
                      <p className="text-white font-semibold">{upcomingSessions.length} Upcoming Sessions</p>
                    </div>
                  </div>
                </div>
              )}
              <Link to="/programs" className="bg-green-500/20 backdrop-blur-lg border border-green-500/30 rounded-xl p-4 hover:bg-green-500/30 transition-all">
                <div className="flex items-center space-x-3">
                  <BookOpenIcon className="w-8 h-8 text-green-400" />
                  <div>
                    <p className="text-white font-semibold">Browse Programs</p>
                  </div>
                </div>
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard count={enrollments.length} label="My Programs" icon={AcademicCapIcon} color="text-[#30d9fe]" borderColor="border-[#30d9fe]/30" />
              <StatCard count={eventRegistrations.length} label="My Events" icon={CalendarIcon} color="text-[#eec262]" borderColor="border-[#eec262]/30" />
              <StatCard count={certificates.length} label="Certificates" icon={DocumentTextIcon} color="text-green-400" borderColor="border-green-400/30" />
              <StatCard count={badges.length} label="Badges" icon={ShieldCheckIcon} color="text-purple-400" borderColor="border-purple-400/30" />
            </div>
          </div>
        )}

        {/* Tab contents */}
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
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 text-xs rounded-full font-medium ${assignment.submitted ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                            {assignment.submitted ? 'Submitted' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <NoData icon={ClipboardDocumentCheckIcon} text="No assignments yet." />}
            </div>
          </div>
        )}

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
                      <h3 className="font-semibold text-white">{session.title}</h3>
                    </div>
                  ))}
                </div>
              ) : <NoData icon={PlayCircleIcon} text="No upcoming sessions." />}
            </div>
          </div>
        )}

        {activeTab === 'programs' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-between">
                <div className="flex items-center">
                  <AcademicCapIcon className="w-7 h-7 mr-2 text-[#30d9fe]" />
                  My Programs
                </div>
                <Link to="/programs" className="text-sm bg-[#30d9fe] text-[#03325a] px-4 py-2 rounded-lg">Browse</Link>
              </h2>
              {enrollments.length > 0 ? (
                <div className="space-y-4">
                  {enrollments.map((enrollment) => (
                    <div key={enrollment.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <h3 className="font-semibold text-white">{enrollment.program?.title}</h3>
                      <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-[#30d9fe] h-2 rounded-full" style={{ width: `${enrollment.progress || 0}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : <NoData icon={AcademicCapIcon} text="No programs yet." />}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-between">
                <div className="flex items-center">
                  <CalendarIcon className="w-7 h-7 mr-2 text-[#eec262]" />
                  My Events
                </div>
                <Link to="/events" className="text-sm bg-[#eec262] text-[#03325a] px-4 py-2 rounded-lg">Browse</Link>
              </h2>
              {eventRegistrations.length > 0 ? (
                <div className="space-y-4">
                  {eventRegistrations.map((reg) => (
                    <div key={reg.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <h3 className="font-semibold text-white">{reg.event?.title}</h3>
                    </div>
                  ))}
                </div>
              ) : <NoData icon={CalendarIcon} text="No events yet." />}
            </div>
          </div>
        )}

        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6"><DocumentTextIcon className="w-7 h-7 inline mr-2 text-green-400" /> Certificates</h2>
              {certificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {certificates.map(cert => <div key={cert.id} className="bg-white/5 border border-white/10 p-4 rounded-lg text-white">{cert.title}</div>)}
                </div>
              ) : <NoData icon={DocumentTextIcon} text="No certificates yet." />}
            </div>
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6"><ShieldCheckIcon className="w-7 h-7 inline mr-2 text-purple-400" /> Badges</h2>
              {badges.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {badges.map(badge => <div key={badge.id} className="bg-white/5 border border-white/10 p-4 rounded-lg text-white text-center">{badge.title}</div>)}
                </div>
              ) : <NoData icon={ShieldCheckIcon} text="No badges yet." />}
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6"><BellIcon className="w-7 h-7 inline mr-2 text-[#30d9fe]" /> Notifications</h2>
              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((n, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-lg text-white">
                      <p>{n.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{new Date(n.created_at).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ) : <NoData icon={BellIcon} text="No notifications yet." />}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

const StatCard = ({ count, label, icon: Icon, color, borderColor }) => (
  <div className={`bg-white/10 backdrop-blur-lg border ${borderColor} rounded-xl p-6 text-center hover:scale-105 transition-transform duration-200`}>
    <Icon className={`w-8 h-8 ${color} mx-auto mb-2`} />
    <div className="text-3xl font-bold text-white mb-1">{count}</div>
    <div className="text-sm text-gray-300">{label}</div>
  </div>
);

const NoData = ({ icon: Icon, text }) => (
  <div className="text-center py-12">
    <Icon className="w-16 h-16 mx-auto text-gray-500 mb-4" />
    <p className="text-gray-400">{text}</p>
  </div>
);

export default LearnerDashboard;
