import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import LogoutModal from '../components/LogoutModal';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  ShieldCheckIcon,
  CameraIcon,
  ArrowLeftOnRectangleIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ArrowLeftIcon,
  KeyIcon,
  ClockIcon,
  Cog6ToothIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
  AcademicCapIcon,
  BellIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  SunIcon,
  MoonIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [activeTab, setActiveTab] = useState('account');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
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
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setEditForm({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        phone: userData.phone || '',
        organization: userData.organization || '',
        bio: userData.bio || ''
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
      setSaving(true);
      const updatedUser = await authService.updateProfile(editForm);
      setUser(updatedUser);
      setEditing(false);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
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

  // Get dashboard path based on role
  const getDashboardPath = () => {
    switch (user?.role) {
      case 'admin':
        return '/admin';
      case 'mentor':
        return '/mentor-dashboard';
      default:
        return '/learner-dashboard';
    }
  };

  // Get role color
  const getRoleColor = () => {
    switch (user?.role) {
      case 'admin':
        return 'bg-purple-500';
      case 'mentor':
        return 'bg-teal-500';
      case 'sponsor':
        return 'bg-yellow-500 text-gray-900';
      case 'partner':
        return 'bg-blue-500';
      default:
        return 'bg-green-500';
    }
  };

  const tabs = [
    { id: 'account', name: 'Account', icon: UserCircleIcon },
    { id: 'history', name: 'History', icon: ClockIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
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
      {/* Header Section with Avatar and Basic Info */}
      <div className="bg-gradient-to-r from-[#03325a] via-[#0a4d7a] to-[#03325a] border-b border-[#30d9fe]/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link 
            to={getDashboardPath()} 
            className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar Section */}
            <div className="relative group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-r from-[#30d9fe] to-[#eec262] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-2xl ring-4 ring-[#30d9fe]/30 overflow-hidden">
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
                className="absolute bottom-0 right-0 w-10 h-10 bg-[#30d9fe] rounded-full flex items-center justify-center shadow-lg hover:bg-[#30d9fe]/80 transition-colors disabled:opacity-50"
                title="Change avatar"
              >
                {uploadingAvatar ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CameraIcon className="w-5 h-5 text-[#03325a]" />
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

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                {user?.first_name} {user?.last_name}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
                <span className="text-[#30d9fe]">@{user?.username}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-300">{user?.email}</span>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getRoleColor()} text-white`}>
                  {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Learner'}
                </span>
                <span className="text-gray-400 text-sm flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  Joined {new Date(user?.date_joined).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Quick ID */}
            <div 
              onClick={() => copyToClipboard(user?.unique_id)}
              className="bg-[#30d9fe]/10 border border-[#30d9fe]/30 rounded-lg px-4 py-2 cursor-pointer hover:bg-[#30d9fe]/20 transition-colors group"
              title="Click to copy full ID"
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">ID</span>
                {copied ? (
                  <ClipboardDocumentCheckIcon className="w-4 h-4 text-green-400" />
                ) : (
                  <ClipboardDocumentIcon className="w-4 h-4 text-gray-400 group-hover:text-[#30d9fe] transition-colors" />
                )}
              </div>
              <p className="text-[#30d9fe] font-mono text-sm">{user?.unique_id?.slice(0, 8)}...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-[#03325a]/50 border-b border-[#30d9fe]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'text-[#30d9fe] border-[#30d9fe]'
                      : 'text-gray-400 border-transparent hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <Cog6ToothIcon className="w-6 h-6 mr-2 text-[#30d9fe]" />
                      Profile Settings
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">Manage your personal details and how you appear on the platform.</p>
                  </div>
                  {!editing && (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center px-4 py-2 bg-[#30d9fe] text-[#03325a] font-semibold rounded-lg hover:bg-[#30d9fe]/90 transition-all"
                    >
                      <PencilIcon className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                  )}
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                    {error}
                  </div>
                )}

                {editing ? (
                  <form onSubmit={handleEditSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          <UserCircleIcon className="w-4 h-4 inline mr-1" />
                          First Name
                        </label>
                        <input
                          type="text"
                          value={editForm.first_name}
                          onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          <UserCircleIcon className="w-4 h-4 inline mr-1" />
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={editForm.last_name}
                          onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          <EnvelopeIcon className="w-4 h-4 inline mr-1" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={user?.email}
                          disabled
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-400 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          <PhoneIcon className="w-4 h-4 inline mr-1" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                          placeholder="+1 XXX XXX XXXX"
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        <BuildingOfficeIcon className="w-4 h-4 inline mr-1" />
                        Organization
                      </label>
                      <input
                        type="text"
                        value={editForm.organization}
                        onChange={(e) => setEditForm({...editForm, organization: e.target.value})}
                        placeholder="Your company or school"
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                      <button 
                        type="submit" 
                        disabled={saving}
                        className="flex items-center px-6 py-3 bg-[#30d9fe] text-[#03325a] font-semibold rounded-lg hover:bg-[#30d9fe]/90 transition-all disabled:opacity-50"
                      >
                        {saving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-[#03325a] border-t-transparent rounded-full animate-spin mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <CheckIcon className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setEditing(false)}
                        className="flex items-center px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
                      >
                        <XMarkIcon className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1">
                          <UserCircleIcon className="w-4 h-4 inline mr-1" />
                          Username
                        </label>
                        <p className="text-white text-lg">{user?.username}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1">
                          <EnvelopeIcon className="w-4 h-4 inline mr-1" />
                          Email Address
                        </label>
                        <p className="text-white text-lg">{user?.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1">
                          <PhoneIcon className="w-4 h-4 inline mr-1" />
                          Phone Number
                        </label>
                        <p className="text-white text-lg">{user?.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1">
                          <BuildingOfficeIcon className="w-4 h-4 inline mr-1" />
                          Organization
                        </label>
                        <p className="text-white text-lg">{user?.organization || 'Not provided'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1">
                          <ShieldCheckIcon className="w-4 h-4 inline mr-1" />
                          Role
                        </label>
                        <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getRoleColor()} text-white`}>
                          {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Learner'}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1">
                          <CalendarIcon className="w-4 h-4 inline mr-1" />
                          Member Since
                        </label>
                        <p className="text-white text-lg">{new Date(user?.date_joined).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Links Section */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white flex items-center mb-4">
                  <LinkIcon className="w-6 h-6 mr-2 text-[#30d9fe]" />
                  Quick Links
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/programs"
                    className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all group"
                  >
                    <div className="p-2 bg-[#30d9fe]/20 rounded-lg group-hover:bg-[#30d9fe]/30 transition-colors">
                      <AcademicCapIcon className="w-5 h-5 text-[#30d9fe]" />
                    </div>
                    <span className="text-white font-medium">Browse Programs</span>
                  </Link>
                  <Link
                    to="/events"
                    className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all group"
                  >
                    <div className="p-2 bg-[#eec262]/20 rounded-lg group-hover:bg-[#eec262]/30 transition-colors">
                      <CalendarIcon className="w-5 h-5 text-[#eec262]" />
                    </div>
                    <span className="text-white font-medium">View Events</span>
                  </Link>
                  <Link
                    to={getDashboardPath()}
                    className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all group"
                  >
                    <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                      <DocumentTextIcon className="w-5 h-5 text-green-400" />
                    </div>
                    <span className="text-white font-medium">My Certificates</span>
                  </Link>
                  <Link
                    to="/contact"
                    className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all group"
                  >
                    <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                      <EnvelopeIcon className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-white font-medium">Contact Support</span>
                  </Link>
                </div>
              </div>

              {/* Preferences Section */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white flex items-center mb-4">
                  <Cog6ToothIcon className="w-6 h-6 mr-2 text-[#30d9fe]" />
                  Preferences
                </h2>
                <div className="space-y-4">
                  {/* Notifications Toggle */}
                  <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <BellIcon className="w-5 h-5 text-[#30d9fe]" />
                      <div>
                        <p className="text-white font-medium">Email Notifications</p>
                        <p className="text-gray-400 text-sm">Receive updates about your account</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#30d9fe] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#30d9fe]"></div>
                    </label>
                  </div>

                  {/* Language */}
                  <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <GlobeAltIcon className="w-5 h-5 text-[#eec262]" />
                      <div>
                        <p className="text-white font-medium">Language</p>
                        <p className="text-gray-400 text-sm">Choose your preferred language</p>
                      </div>
                    </div>
                    <select className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#30d9fe]">
                      <option value="en" className="bg-slate-800">English</option>
                      <option value="es" className="bg-slate-800">Español</option>
                      <option value="fr" className="bg-slate-800">Français</option>
                      <option value="sw" className="bg-slate-800">Swahili</option>
                    </select>
                  </div>

                  {/* Theme */}
                  <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MoonIcon className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-white font-medium">Dark Mode</p>
                        <p className="text-gray-400 text-sm">Toggle dark/light theme</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#30d9fe] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white flex items-center mb-6">
                  <ClockIcon className="w-6 h-6 mr-2 text-[#30d9fe]" />
                  Activity History
                </h2>
                <div className="space-y-4">
                  <div className="text-center py-12">
                    <ClockIcon className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                    <p className="text-gray-400">Activity history coming soon</p>
                    <p className="text-sm text-gray-500 mt-2">Track your login history, profile changes, and more.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white flex items-center mb-6">
                  <ShieldCheckIcon className="w-6 h-6 mr-2 text-[#30d9fe]" />
                  Security Settings
                </h2>
                <div className="space-y-6">
                  {/* Change Password */}
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-white font-semibold flex items-center">
                          <KeyIcon className="w-5 h-5 mr-2 text-[#eec262]" />
                          Password
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">Change your password to keep your account secure</p>
                      </div>
                      <button className="px-4 py-2 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-all">
                        Change
                      </button>
                    </div>
                  </div>

                  {/* Two-Factor Auth */}
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-white font-semibold flex items-center">
                          <ShieldCheckIcon className="w-5 h-5 mr-2 text-green-400" />
                          Two-Factor Authentication
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">Add an extra layer of security to your account</p>
                      </div>
                      <button className="px-4 py-2 bg-green-500/20 text-green-300 font-medium rounded-lg hover:bg-green-500/30 transition-all border border-green-500/50">
                        Enable
                      </button>
                    </div>
                  </div>

                  {/* Sessions */}
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-white font-semibold">Active Sessions</h3>
                        <p className="text-gray-400 text-sm mt-1">Manage your active login sessions</p>
                      </div>
                      <button className="px-4 py-2 bg-red-500/20 text-red-300 font-medium rounded-lg hover:bg-red-500/30 transition-all border border-red-500/50">
                        Sign Out All
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to={getDashboardPath()}
                  className="w-full flex items-center justify-center px-4 py-3 bg-[#30d9fe] text-[#03325a] font-semibold rounded-lg hover:bg-[#30d9fe]/90 transition-all"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold rounded-lg transition-all border border-red-500/50"
                >
                  <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Account Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-300 text-sm font-medium rounded-full border border-green-500/50">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Role</span>
                  <span className={`px-2 py-1 text-sm font-medium rounded-full ${getRoleColor()} text-white`}>
                    {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Learner'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Email Verified</span>
                  <span className="text-green-400">
                    <CheckIcon className="w-5 h-5" />
                  </span>
                </div>
              </div>
            </div>

            {/* User ID Card */}
            <div className="bg-gradient-to-br from-[#30d9fe]/20 to-[#eec262]/20 backdrop-blur-lg border border-[#30d9fe]/30 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Your Unique ID</h3>
              <div 
                onClick={() => copyToClipboard(user?.unique_id)}
                className="bg-black/30 rounded-lg p-3 font-mono text-[#30d9fe] text-sm break-all cursor-pointer hover:bg-black/40 transition-colors flex items-center justify-between gap-2 group"
                title="Click to copy"
              >
                <span>{user?.unique_id}</span>
                {copied ? (
                  <ClipboardDocumentCheckIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
                ) : (
                  <ClipboardDocumentIcon className="w-5 h-5 text-[#30d9fe]/50 group-hover:text-[#30d9fe] transition-colors flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-gray-400 mt-2">Click to copy • Use this ID for support inquiries</p>
            </div>
          </div>
        </div>
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

export default ProfilePage;
