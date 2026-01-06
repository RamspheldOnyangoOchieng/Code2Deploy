import React, { useState, useEffect } from 'react';
import authService from '../../services/authService';
import { 
import { API_BASE_URL } from '../../config/api';
  ShieldCheckIcon, 
  ClipboardDocumentListIcon, 
  ExclamationTriangleIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  LockClosedIcon,
  NoSymbolIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const AdminSecurity = () => {
  const [securityStats, setSecurityStats] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [securityEvents, setSecurityEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchSecurityStats();
    } else if (activeTab === 'audit-logs') {
      fetchAuditLogs();
    } else if (activeTab === 'security-events') {
      fetchSecurityEvents();
    }
  }, [activeTab, currentPage]);

  const fetchSecurityStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/security/dashboard/', {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSecurityStats(data);
      } else {
        setError('Failed to fetch security stats');
      }
    } catch (err) {
      setError('Error fetching security stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        page_size: 20
      });

      const response = await fetch(`${API_BASE_URL}/security/audit-logs/?${params}`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAuditLogs(data.results || []);
        setTotalPages(Math.ceil((data.count || 0) / 20));
      } else {
        setError('Failed to fetch audit logs');
      }
    } catch (err) {
      setError('Error fetching audit logs');
    } finally {
      setLoading(false);
    }
  };

  const fetchSecurityEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        page_size: 20
      });

      const response = await fetch(`${API_BASE_URL}/security/security-events/?${params}`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSecurityEvents(data.results || []);
        setTotalPages(Math.ceil((data.count || 0) / 20));
      } else {
        setError('Failed to fetch security events');
      }
    } catch (err) {
      setError('Error fetching security events');
    } finally {
      setLoading(false);
    }
  };

  const getEventSeverityBadge = (severity) => {
    const severityConfig = {
      low: { bg: 'bg-gradient-to-r from-green-100 to-emerald-200', text: 'text-green-800', icon: '✓' },
      medium: { bg: 'bg-gradient-to-r from-yellow-100 to-amber-200', text: 'text-yellow-800', icon: '⚠' },
      high: { bg: 'bg-gradient-to-r from-red-100 to-rose-200', text: 'text-red-800', icon: '⚠️' },
      critical: { bg: 'bg-gradient-to-r from-purple-100 to-pink-200', text: 'text-purple-800', icon: '🚨' }
    };
    
    const config = severityConfig[severity] || { bg: 'bg-gray-100', text: 'text-gray-800', icon: '•' };
    
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-bold rounded-full ${config.bg} ${config.text} shadow-sm`}>
        <span>{config.icon}</span>
        <span className="uppercase">{severity}</span>
      </span>
    );
  };

  const getActionTypeBadge = (actionType) => {
    const actionConfig = {
      login: { bg: 'bg-gradient-to-r from-blue-100 to-cyan-200', text: 'text-blue-800', icon: '🔐' },
      logout: { bg: 'bg-gradient-to-r from-gray-100 to-slate-200', text: 'text-gray-800', icon: '👋' },
      create: { bg: 'bg-gradient-to-r from-green-100 to-emerald-200', text: 'text-green-800', icon: '➕' },
      update: { bg: 'bg-gradient-to-r from-yellow-100 to-amber-200', text: 'text-yellow-800', icon: '✏️' },
      delete: { bg: 'bg-gradient-to-r from-red-100 to-rose-200', text: 'text-red-800', icon: '🗑️' },
      view: { bg: 'bg-gradient-to-r from-purple-100 to-indigo-200', text: 'text-purple-800', icon: '👁️' }
    };
    
    const config = actionConfig[actionType] || { bg: 'bg-gray-100', text: 'text-gray-800', icon: '•' };
    
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-bold rounded-full ${config.bg} ${config.text} shadow-sm`}>
        <span>{config.icon}</span>
        <span className="uppercase">{actionType}</span>
      </span>
    );
  };

  const renderSecurityDashboard = () => (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#30d9fe] border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        </div>
      ) : securityStats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Audit Logs Stats */}
          <div className="group relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 text-white overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                  <ClipboardDocumentListIcon className="h-8 w-8" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-blue-100">Audit Logs</p>
                  <p className="text-3xl font-bold mt-1">{securityStats.audit_logs?.total || 0}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-white border-opacity-20">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-100">Today:</span>
                  <span className="font-semibold">{securityStats.audit_logs?.today || 0}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-blue-100">This Week:</span>
                  <span className="font-semibold">{securityStats.audit_logs?.this_week || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Events Stats */}
          <div className="group relative bg-gradient-to-br from-[#eec262] to-[#d4a952] rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 text-white overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                  <LockClosedIcon className="h-8 w-8" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-orange-100">Security Events</p>
                  <p className="text-3xl font-bold mt-1">{securityStats.security_events?.total || 0}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-white border-opacity-20">
                <div className="flex justify-between text-sm">
                  <span className="text-orange-100">High:</span>
                  <span className="font-semibold">{securityStats.security_events?.high || 0}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-orange-100">Critical:</span>
                  <span className="font-semibold">{securityStats.security_events?.critical || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rate Limiting Stats */}
          <div className="group relative bg-gradient-to-br from-[#03325a] to-[#0A0F2C] rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 text-white overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                  <NoSymbolIcon className="h-8 w-8" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-300">Rate Limits</p>
                  <p className="text-3xl font-bold mt-1">{securityStats.rate_limiting?.total || 0}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-white border-opacity-20">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Blocked:</span>
                  <span className="font-semibold">{securityStats.rate_limiting?.blocked || 0}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-300">Today:</span>
                  <span className="font-semibold">{securityStats.rate_limiting?.today || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* System Health Stats */}
          <div className="group relative bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 text-white overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                  <HeartIcon className="h-8 w-8" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-purple-100">System Health</p>
                  <p className="text-3xl font-bold mt-1">Good</p>
                </div>
              </div>
              <div className="pt-4 border-t border-white border-opacity-20">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-100">Uptime:</span>
                  <span className="font-semibold">{securityStats.system_health?.uptime || '99.9%'}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-purple-100">Last Check:</span>
                  <span className="font-semibold">{securityStats.system_health?.last_check || 'Now'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Recent Security Activity */}
      {securityStats?.recent_activity && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center mb-6">
            <ShieldCheckIcon className="h-6 w-6 text-[#30d9fe] mr-3" />
            <h3 className="text-xl font-bold text-gray-900">Recent Security Activity</h3>
          </div>
          <div className="space-y-3">
            {securityStats.recent_activity.map((activity, index) => (
              <div key={index} className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 rounded-xl transition-all duration-300 border border-transparent hover:border-blue-200">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.severity === 'high' ? 'bg-red-100' : 
                    activity.severity === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                  }`}>
                    <div className={`w-4 h-4 rounded-full ${
                      activity.severity === 'high' ? 'bg-red-500' : 
                      activity.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-[#03325a] transition-colors">{activity.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                  </div>
                </div>
                <div className="text-xs font-medium text-gray-500 bg-white px-3 py-1 rounded-full">
                  {new Date(activity.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderAuditLogs = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#30d9fe] border-t-transparent mb-4"></div>
            <p className="text-gray-600 font-medium">Loading audit logs...</p>
          </div>
        ) : error ? (
          <div className="m-4 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        ) : auditLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <ClipboardDocumentListIcon className="h-16 w-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium">No audit logs found</p>
            <p className="text-sm">Audit logs will appear here once actions are performed</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Resource
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {auditLogs.map((log, index) => (
                  <tr key={log.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-[#30d9fe] to-blue-500 rounded-full flex items-center justify-center text-[#03325a] font-bold">
                          {log.user_username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{log.user_username}</div>
                          <div className="text-xs text-gray-500">{log.user_unique_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getActionTypeBadge(log.action_type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{log.resource_type}</div>
                      <div className="text-xs text-gray-500">{log.resource_id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs font-mono font-medium text-gray-700 bg-gray-100 rounded-full">
                        {log.ip_address}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderSecurityEvents = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#30d9fe] border-t-transparent mb-4"></div>
            <p className="text-gray-600 font-medium">Loading security events...</p>
          </div>
        ) : error ? (
          <div className="m-4 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        ) : securityEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <ShieldCheckIcon className="h-16 w-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium">No security events found</p>
            <p className="text-sm">Your system is secure - no threats detected</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {securityEvents.map((event, index) => (
                  <tr key={event.id} className="hover:bg-gradient-to-r hover:from-yellow-50 hover:to-yellow-100 transition-all duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className={`mt-1 p-2 rounded-lg ${
                          event.severity === 'critical' ? 'bg-purple-100' :
                          event.severity === 'high' ? 'bg-red-100' :
                          event.severity === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                        }`}>
                          <ExclamationTriangleIcon className={`h-5 w-5 ${
                            event.severity === 'critical' ? 'text-purple-600' :
                            event.severity === 'high' ? 'text-red-600' :
                            event.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'
                          }`} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{event.title}</div>
                          <div className="text-xs text-gray-600 mt-1">{event.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getEventSeverityBadge(event.severity)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full">
                        {event.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs font-mono font-medium text-gray-700 bg-blue-50 rounded-full">
                        {event.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(event.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Security Dashboard', icon: ShieldCheckIcon },
    { id: 'audit-logs', label: 'Audit Logs', icon: ClipboardDocumentListIcon },
    { id: 'security-events', label: 'Security Events', icon: ExclamationTriangleIcon }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Security Dashboard
          </h2>
          <p className="text-sm text-gray-600 mt-1">Monitor and manage your system security</p>
        </div>
        <div className="flex space-x-6">
          <button 
            onClick={fetchSecurityStats}
            className="flex items-center space-x-2 bg-[#30d9fe] text-[#03325a] px-6 py-3 rounded-xl hover:bg-[#eec262] font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <ArrowPathIcon className="h-5 w-5" />
            <span className="font-semibold">Refresh</span>
          </button>
          <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            <DocumentArrowDownIcon className="h-5 w-5" />
            <span className="font-semibold">Export Report</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 px-8 py-4 text-sm font-semibold whitespace-nowrap border-b-3 transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'border-b-4 border-[#30d9fe] text-[#03325a] bg-gradient-to-t from-blue-50 to-transparent'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {activeTab === 'dashboard' && renderSecurityDashboard()}
        {activeTab === 'audit-logs' && renderAuditLogs()}
        {activeTab === 'security-events' && renderSecurityEvents()}
      </div>

      {/* Pagination for logs and events */}
      {(activeTab === 'audit-logs' || activeTab === 'security-events') && totalPages > 1 && (
        <div className="flex justify-center">
          <nav className="flex items-center space-x-2 bg-white rounded-xl shadow-lg p-2 border border-gray-100">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                    currentPage === page
                      ? 'bg-[#30d9fe] text-[#03325a] shadow-lg transform scale-110'
                      : 'text-gray-700 bg-white border border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:border-blue-300'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default AdminSecurity; 