import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import authService from '../services/authService';
import { API_BASE_URL } from '../config/api';
import DashboardLayout from '../components/DashboardLayout';
import {
  HomeIcon,
  UsersIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  FolderIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  ChartBarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useToast } from '../contexts/ToastContext';

const MentorDashboard = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dashboard data states
  const [dashboardStats, setDashboardStats] = useState(null);
  const [mentees, setMentees] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [resources, setResources] = useState([]);
  const [messages, setMessages] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [reports, setReports] = useState(null);

  // Modal states
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    authService.logout();
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  const sidebarItems = [
    { id: 'overview', name: 'Overview', icon: HomeIcon },
    { id: 'mentees', name: 'My Mentees', icon: UsersIcon },
    { id: 'sessions', name: 'Sessions', icon: CalendarDaysIcon },
    { id: 'programs', name: 'Programs', icon: AcademicCapIcon },
    { id: 'assignments', name: 'Assignments & Reviews', icon: ClipboardDocumentListIcon, badge: pendingReviews.length > 0 ? pendingReviews.length : null },
    { id: 'resources', name: 'Resources', icon: FolderIcon },
    { id: 'messages', name: 'Messages', icon: ChatBubbleLeftRightIcon },
    { id: 'schedule', name: 'Schedule', icon: ClockIcon },
    { id: 'reports', name: 'Reports', icon: ChartBarIcon },
  ];

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadTabData(activeTab);
    }
  }, [activeTab, user]);

  const checkAuth = async () => {
    try {
      if (!authService.isAuthenticated()) {
        navigate('/');
        return;
      }
      const userData = await authService.getCurrentUser();
      // Allow access for mentors and admins (admins have access to all dashboards)
      if (userData.role !== 'mentor' && userData.role !== 'admin') {
        navigate('/learner-dashboard');
        return;
      }
      setUser(userData);
      setLoading(false);
    } catch (err) {
      navigate('/');
    }
  };

  const getHeaders = () => ({
    'Authorization': `Bearer ${authService.getToken()}`,
    'Content-Type': 'application/json'
  });

  const loadTabData = async (tab) => {
    setLoading(true);
    setError(null);
    try {
      switch (tab) {
        case 'overview':
          await loadDashboard();
          break;
        case 'mentees':
          await loadMentees();
          break;
        case 'sessions':
          await loadSessions();
          break;
        case 'programs':
          await loadPrograms();
          break;
        case 'assignments':
          await loadAssignments();
          await loadPendingReviews();
          break;
        case 'resources':
          await loadResources();
          break;
        case 'messages':
          await loadMessages();
          break;
        case 'schedule':
          await loadAvailability();
          break;
        case 'reports':
          await loadReports();
          break;
      }
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboard = async () => {
    const response = await fetch(`${API_BASE_URL}/mentors/dashboard/`, { headers: getHeaders() });
    if (response.ok) {
      const data = await response.json();
      setDashboardStats(data);
    }
  };

  const loadMentees = async () => {
    const response = await fetch(`${API_BASE_URL}/mentors/mentees/`, { headers: getHeaders() });
    if (response.ok) {
      const data = await response.json();
      setMentees(data.results || data);
    }
  };

  const loadSessions = async () => {
    const response = await fetch(`${API_BASE_URL}/mentors/sessions/`, { headers: getHeaders() });
    if (response.ok) {
      const data = await response.json();
      setSessions(data.results || data);
    }
  };

  const loadPrograms = async () => {
    const response = await fetch(`${API_BASE_URL}/mentors/programs/`, { headers: getHeaders() });
    if (response.ok) {
      const data = await response.json();
      setPrograms(data.results || data);
    }
  };

  const loadAssignments = async () => {
    const response = await fetch(`${API_BASE_URL}/mentors/assignments/`, { headers: getHeaders() });
    if (response.ok) {
      const data = await response.json();
      setAssignments(data.results || data);
    }
  };

  const loadPendingReviews = async () => {
    const response = await fetch(`${API_BASE_URL}/mentors/reviews/pending/`, { headers: getHeaders() });
    if (response.ok) {
      const data = await response.json();
      setPendingReviews(data.results || data);
    }
  };

  const loadResources = async () => {
    const response = await fetch(`${API_BASE_URL}/mentors/resources/`, { headers: getHeaders() });
    if (response.ok) {
      const data = await response.json();
      setResources(data.results || data);
    }
  };

  const loadMessages = async () => {
    const response = await fetch(`${API_BASE_URL}/mentors/messages/`, { headers: getHeaders() });
    if (response.ok) {
      const data = await response.json();
      setMessages(data.results || data);
    }
  };

  const loadAvailability = async () => {
    const response = await fetch(`${API_BASE_URL}/mentors/availability/`, { headers: getHeaders() });
    if (response.ok) {
      const data = await response.json();
      setAvailability(data.results || data);
    }
  };

  const loadReports = async () => {
    const response = await fetch(`${API_BASE_URL}/mentors/reports/`, { headers: getHeaders() });
    if (response.ok) {
      const data = await response.json();
      setReports(data);
    }
  };

  // ============== RENDER TABS ==============

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Mentees" value={dashboardStats?.total_mentees || 0} icon={UsersIcon} color="blue" />
        <StatCard title="Upcoming Sessions" value={dashboardStats?.upcoming_sessions || 0} icon={CalendarDaysIcon} color="green" />
        <StatCard title="Pending Reviews" value={dashboardStats?.pending_reviews || 0} icon={ClipboardDocumentListIcon} color="yellow" />
        <StatCard title="Unread Messages" value={dashboardStats?.unread_messages || 0} icon={ChatBubbleLeftRightIcon} color="purple" />
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Sessions" value={dashboardStats?.total_sessions || 0} icon={CalendarDaysIcon} color="indigo" />
        <StatCard title="Programs Assigned" value={dashboardStats?.total_programs || 0} icon={AcademicCapIcon} color="pink" />
        <StatCard title="Total Assignments" value={dashboardStats?.total_assignments || 0} icon={ClipboardDocumentListIcon} color="orange" />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Sessions</h3>
          {dashboardStats?.recent_sessions?.length > 0 ? (
            <div className="space-y-3">
              {dashboardStats.recent_sessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="min-w-0 flex-1 mr-3">
                    <p className="font-medium text-gray-800 truncate">{session.title}</p>
                    <p className="text-sm text-gray-500 truncate">{new Date(session.scheduled_at).toLocaleString()}</p>
                  </div>
                  <span className={`flex-shrink-0 px-2 py-1 text-xs rounded-full whitespace-nowrap ${session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                    {session.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No upcoming sessions</p>
          )}
        </div>

        {/* Recent Submissions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Submissions to Review</h3>
          {dashboardStats?.recent_submissions?.length > 0 ? (
            <div className="space-y-3">
              {dashboardStats.recent_submissions.map((submission) => (
                <div key={submission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="min-w-0 flex-1 mr-3">
                    <p className="font-medium text-gray-800 truncate">{submission.assignment_title}</p>
                    <p className="text-sm text-gray-500 truncate">By: {submission.student_details?.username}</p>
                  </div>
                  <button className="flex-shrink-0 px-3 py-1 bg-[#30d9fe] text-[#03325a] text-sm rounded-lg hover:bg-opacity-80">
                    Review
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No pending submissions</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderMentees = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Mentees</h2>
        <span className="text-gray-500">{mentees.length} total</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentees.map((mentee) => (
          <div key={mentee.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-4 mb-3">
              <div className="flex-shrink-0 w-12 h-12 bg-[#03325a] rounded-full flex items-center justify-center text-white font-bold">
                {mentee.mentee_details?.first_name?.[0] || mentee.mentee_details?.username?.[0] || '?'}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-800 truncate">
                  {mentee.mentee_details?.first_name} {mentee.mentee_details?.last_name}
                </h3>
                <p className="text-sm text-gray-500 truncate">{mentee.mentee_details?.email}</p>
              </div>
            </div>
            {mentee.program_title && (
              <p className="mt-3 text-sm text-gray-600">
                <span className="font-medium">Program:</span> {mentee.program_title}
              </p>
            )}
            <div className="mt-4 flex space-x-2">
              <button className="flex-1 px-3 py-2 bg-[#30d9fe] text-[#03325a] text-sm rounded-lg hover:bg-opacity-80">
                Message
              </button>
              <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50">
                View Progress
              </button>
            </div>
          </div>
        ))}
      </div>

      {mentees.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <UsersIcon className="w-16 h-16 mx-auto text-gray-400" />
          <p className="mt-4 text-gray-500">No mentees assigned yet</p>
        </div>
      )}
    </div>
  );

  const renderSessions = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Sessions</h2>
        <button
          onClick={() => setShowSessionModal(true)}
          className="flex items-center px-4 py-2 bg-[#30d9fe] text-[#03325a] rounded-lg hover:bg-opacity-80"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Session
        </button>
      </div>

      {/* Session Filters */}
      <div className="flex space-x-4">
        <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">All</button>
        <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200">Upcoming</button>
        <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200">Completed</button>
        <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200">Cancelled</button>
      </div>

      {/* Sessions List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Session</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Attendees</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{session.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{session.program_title}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {session.session_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="flex flex-col">
                      <span className="font-medium">{new Date(session.scheduled_at).toLocaleDateString()}</span>
                      <span className="text-xs text-gray-500">{new Date(session.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="flex items-center">
                      <UsersIcon className="w-4 h-4 text-gray-400 mr-2" />
                      {session.attendee_count || 0}/{session.max_attendees}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={session.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-3">
                      <button className="text-blue-600 hover:text-blue-900 transition-colors" title="View Details">
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 transition-colors" title="Edit Session">
                        <PencilIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sessions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarDaysIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No sessions yet</h3>
            <p className="mt-1 text-gray-500">Get started by scheduling your first session.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderPrograms = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">My Programs</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <div key={program.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
            <div className="h-32 bg-gradient-to-r from-[#03325a] to-[#0a5a8a] flex items-center justify-center relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <AcademicCapIcon className="w-16 h-16 text-white/90 relative z-10" />
              {program.is_active && (
                <span className="absolute top-3 right-3 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-sm">
                  ACTIVE
                </span>
              )}
            </div>
            <div className="p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-1">{program.program_title}</h3>
              <p className="text-sm text-gray-500 font-medium mb-4 flex items-center">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                {program.role}
              </p>

              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className={`text-xs px-2 py-1 rounded-md font-medium ${program.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                  {program.is_active ? 'Currently Teaching' : 'Past Program'}
                </span>
                <button className="text-[#30d9fe] text-sm font-semibold hover:text-[#03325a] transition-colors flex items-center">
                  View Details <span className="ml-1">→</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {programs.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AcademicCapIcon className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No programs assigned</h3>
          <p className="mt-1 text-gray-500">You haven't been assigned to any programs yet.</p>
        </div>
      )}
    </div>
  );

  const renderAssignments = () => (
    <div className="space-y-8">
      {/* Pending Reviews Section */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Pending Reviews</h2>
            <p className="text-gray-500 text-sm mt-1">Submissions waiting for your feedback</p>
          </div>
          <span className="px-4 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold border border-yellow-200">
            {pendingReviews.length} Pending
          </span>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Assignment</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingReviews.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-3 text-xs">
                          {submission.student_details?.username?.[0] || 'S'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{submission.student_details?.username}</p>
                          <p className="text-xs text-gray-500">{submission.student_details?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{submission.assignment_title}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded w-fit">
                        <ClockIcon className="w-3 h-3 mr-1 text-gray-500" />
                        {new Date(submission.submitted_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="inline-flex items-center px-4 py-2 bg-[#30d9fe] text-[#03325a] text-sm font-semibold rounded-lg hover:bg-[#2bc4e6] transition-colors shadow-sm cursor-pointer whitespace-nowrap">
                        <PencilIcon className="w-4 h-4 mr-2" />
                        Grade Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pendingReviews.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
              <p className="mt-1 text-gray-500">You have no pending reviews at the moment.</p>
            </div>
          )}
        </div>
      </div>

      {/* Assignments Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">My Assignments</h2>
          <button
            onClick={() => setShowAssignmentModal(true)}
            className="flex items-center px-4 py-2 bg-[#30d9fe] text-[#03325a] rounded-lg hover:bg-opacity-80"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Create Assignment
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-800">{assignment.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{assignment.program_title}</p>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{assignment.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Due: {new Date(assignment.due_date).toLocaleDateString()}
                </div>
                <div className="text-sm">
                  <span className="text-blue-600">{assignment.submission_count || 0}</span> submissions
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Resources</h2>
        <button
          onClick={() => setShowResourceModal(true)}
          className="flex items-center px-4 py-2 bg-[#30d9fe] text-[#03325a] rounded-lg hover:bg-opacity-80"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Resource
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <div key={resource.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                  <FolderIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-800 truncate">{resource.title}</h3>
                  <p className="text-sm text-gray-500 truncate">{resource.resource_type}</p>
                </div>
              </div>
              <span className={`flex-shrink-0 px-2 py-1 text-xs rounded-full ${resource.is_public ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                {resource.is_public ? 'Public' : 'Private'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-3 line-clamp-2">{resource.description}</p>
            <div className="mt-4 flex space-x-2">
              {resource.url && (
                <a href={resource.url} target="_blank" rel="noopener noreferrer"
                  className="flex-1 px-3 py-2 bg-[#30d9fe] text-[#03325a] text-sm text-center rounded-lg hover:bg-opacity-80">
                  Open
                </a>
              )}
              <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {resources.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <FolderIcon className="w-16 h-16 mx-auto text-gray-400" />
          <p className="mt-4 text-gray-500">No resources yet</p>
        </div>
      )}
    </div>
  );

  const renderMessages = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
        <button
          onClick={() => setShowMessageModal(true)}
          className="flex items-center px-4 py-2 bg-[#30d9fe] text-[#03325a] rounded-lg hover:bg-opacity-80"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Message
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {messages.map((message) => (
            <div key={message.id} className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!message.is_read ? 'bg-blue-50' : ''}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#03325a] rounded-full flex items-center justify-center text-white font-bold">
                    {message.sender_details?.username?.[0] || '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between sm:justify-start sm:gap-2">
                      <p className="font-medium text-gray-800 truncate">{message.sender_details?.username}</p>
                      <span className="text-xs text-gray-500 sm:hidden whitespace-nowrap">
                        {new Date(message.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{message.subject || 'No subject'}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500 hidden sm:block whitespace-nowrap">
                  {new Date(message.created_at).toLocaleDateString()}
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600 line-clamp-1">{message.content}</p>
            </div>
          ))}
        </div>
        {messages.length === 0 && (
          <div className="text-center py-12">
            <ChatBubbleLeftRightIcon className="w-16 h-16 mx-auto text-gray-400" />
            <p className="mt-4 text-gray-500">No messages yet</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Schedule & Availability</h2>
        <button
          onClick={() => setShowAvailabilityModal(true)}
          className="flex items-center px-4 py-2 bg-[#30d9fe] text-[#03325a] rounded-lg hover:bg-opacity-80"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Slot
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Weekly Availability</h3>
        <div className="space-y-3">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => {
            const daySlots = availability.filter(slot => slot.day_of_week === index);
            return (
              <div key={day} className="flex flex-col sm:flex-row sm:items-center border-b pb-3 pt-3 sm:pt-0">
                <span className="w-32 font-medium text-gray-700 mb-2 sm:mb-0">{day}</span>
                <div className="flex-1 flex flex-wrap gap-2">
                  {daySlots.length > 0 ? (
                    daySlots.map((slot) => (
                      <span key={slot.id} className={`px-3 py-1 rounded-full text-sm ${slot.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {slot.start_time} - {slot.end_time}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm italic">Not set</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Performance Reports</h2>

      {reports && (
        <>
          {/* Session Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Session Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-[#03325a]">{reports.session_stats?.total || 0}</p>
                <p className="text-sm text-gray-500">Total Sessions</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">{reports.session_stats?.completed || 0}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-3xl font-bold text-red-600">{reports.session_stats?.cancelled || 0}</p>
                <p className="text-sm text-gray-500">Cancelled</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-3xl font-bold text-yellow-600">{reports.session_stats?.average_rating || 0}</p>
                <p className="text-sm text-gray-500">Avg Rating</p>
              </div>
            </div>
          </div>

          {/* Assignment Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Assignment Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-[#03325a]">{reports.assignment_stats?.total_assignments || 0}</p>
                <p className="text-sm text-gray-500">Assignments Created</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">{reports.assignment_stats?.total_submissions || 0}</p>
                <p className="text-sm text-gray-500">Total Submissions</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">{reports.assignment_stats?.reviewed_submissions || 0}</p>
                <p className="text-sm text-gray-500">Reviewed</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-3xl font-bold text-purple-600">{reports.assignment_stats?.average_score || 0}</p>
                <p className="text-sm text-gray-500">Avg Score</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderContent = () => {
    if (loading && !dashboardStats) {
      return (
        <div className="flex items-center justify-center h-64">
          <ArrowPathIcon className="w-8 h-8 animate-spin text-[#30d9fe]" />
        </div>
      );
    }

    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'mentees': return renderMentees();
      case 'sessions': return renderSessions();
      case 'programs': return renderPrograms();
      case 'assignments': return renderAssignments();
      case 'resources': return renderResources();
      case 'messages': return renderMessages();
      case 'schedule': return renderSchedule();
      case 'reports': return renderReports();
      default: return renderOverview();
    }
  };

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      activeTab={activeTab}
      setActiveTab={handleTabChange}
      title="Mentor Dashboard"
    >
      {renderContent()}
    </DashboardLayout>
  );
};

// Helper Components
const StatCard = ({ title, value, icon: Icon, color }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    pink: 'bg-pink-100 text-pink-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    scheduled: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    no_show: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status?.replace('_', ' ')}
    </span>
  );
};

export default MentorDashboard;
