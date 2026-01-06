import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout';
import authService from '../services/authService';
import { API_BASE_URL } from '../config/api';
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
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const MentorDashboard = () => {
  const navigate = useNavigate();
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

  const tabs = [
    { id: 'overview', name: 'Overview', icon: HomeIcon },
    { id: 'mentees', name: 'My Mentees', icon: UsersIcon },
    { id: 'sessions', name: 'Sessions', icon: CalendarDaysIcon },
    { id: 'programs', name: 'Programs', icon: AcademicCapIcon },
    { id: 'assignments', name: 'Assignments & Reviews', icon: ClipboardDocumentListIcon },
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
      if (userData.role !== 'mentor') {
        navigate('/profile');
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
      setError('Failed to load data');
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
                  <div>
                    <p className="font-medium text-gray-800">{session.title}</p>
                    <p className="text-sm text-gray-500">{new Date(session.scheduled_at).toLocaleString()}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
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
                  <div>
                    <p className="font-medium text-gray-800">{submission.assignment_title}</p>
                    <p className="text-sm text-gray-500">By: {submission.student_details?.username}</p>
                  </div>
                  <button className="px-3 py-1 bg-[#30d9fe] text-[#03325a] text-sm rounded-lg hover:bg-opacity-80">
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
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#03325a] rounded-full flex items-center justify-center text-white font-bold">
                {mentee.mentee_details?.first_name?.[0] || mentee.mentee_details?.username?.[0] || '?'}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {mentee.mentee_details?.first_name} {mentee.mentee_details?.last_name}
                </h3>
                <p className="text-sm text-gray-500">{mentee.mentee_details?.email}</p>
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
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Session</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendees</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sessions.map((session) => (
              <tr key={session.id}>
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-800">{session.title}</p>
                  <p className="text-sm text-gray-500">{session.program_title}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{session.session_type}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(session.scheduled_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {session.attendee_count || 0}/{session.max_attendees}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={session.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                      <PencilIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sessions.length === 0 && (
          <div className="text-center py-12">
            <CalendarDaysIcon className="w-16 h-16 mx-auto text-gray-400" />
            <p className="mt-4 text-gray-500">No sessions yet</p>
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
          <div key={program.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-[#03325a] to-[#0a5a8a] flex items-center justify-center">
              <AcademicCapIcon className="w-16 h-16 text-white opacity-50" />
            </div>
            <div className="p-6">
              <h3 className="font-semibold text-gray-800">{program.program_title}</h3>
              <p className="text-sm text-gray-500 mt-1">Role: {program.role}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  program.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {program.is_active ? 'Active' : 'Inactive'}
                </span>
                <button className="text-[#30d9fe] text-sm hover:underline">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {programs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <AcademicCapIcon className="w-16 h-16 mx-auto text-gray-400" />
          <p className="mt-4 text-gray-500">No programs assigned yet</p>
        </div>
      )}
    </div>
  );

  const renderAssignments = () => (
    <div className="space-y-6">
      {/* Pending Reviews Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Pending Reviews ({pendingReviews.length})</h2>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-yellow-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pendingReviews.map((submission) => (
                <tr key={submission.id}>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">{submission.student_details?.username}</p>
                    <p className="text-sm text-gray-500">{submission.student_details?.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{submission.assignment_title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(submission.submitted_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button className="px-4 py-2 bg-[#30d9fe] text-[#03325a] text-sm rounded-lg hover:bg-opacity-80">
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pendingReviews.length === 0 && (
            <div className="text-center py-8">
              <CheckCircleIcon className="w-12 h-12 mx-auto text-green-400" />
              <p className="mt-2 text-gray-500">All caught up! No pending reviews.</p>
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
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FolderIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{resource.title}</h3>
                  <p className="text-sm text-gray-500">{resource.resource_type}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                resource.is_public ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
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
            <div key={message.id} className={`p-4 hover:bg-gray-50 cursor-pointer ${!message.is_read ? 'bg-blue-50' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#03325a] rounded-full flex items-center justify-center text-white font-bold">
                    {message.sender_details?.username?.[0] || '?'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{message.sender_details?.username}</p>
                    <p className="text-sm text-gray-600">{message.subject || 'No subject'}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
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
              <div key={day} className="flex items-center border-b pb-3">
                <span className="w-32 font-medium text-gray-700">{day}</span>
                <div className="flex-1 flex flex-wrap gap-2">
                  {daySlots.length > 0 ? (
                    daySlots.map((slot) => (
                      <span key={slot.id} className={`px-3 py-1 rounded-full text-sm ${
                        slot.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {slot.start_time} - {slot.end_time}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">Not set</span>
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
    <Layout>
      <div className="min-h-screen bg-gray-100">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-[#03325a] min-h-screen fixed left-0 top-0 pt-20">
            <div className="p-4">
              <h2 className="text-white text-lg font-semibold mb-6">Mentor Dashboard</h2>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[#30d9fe] text-[#03325a]'
                        : 'text-gray-300 hover:bg-[#0a4a7a]'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 ml-64 p-8 pt-24">
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            {renderContent()}
          </div>
        </div>
      </div>
    </Layout>
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
