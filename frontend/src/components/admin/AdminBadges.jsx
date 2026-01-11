import React, { useState, useEffect } from 'react';
import authService from '../../services/authService';
import { API_BASE_URL } from '../../config/api';
import { useToast } from '../../contexts/ToastContext';

const AdminBadges = () => {
  const toast = useToast();
  const [badges, setBadges] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    badge_type: '',
    points: '',
    color: '#30d9fe',
    criteria: '',
    is_active: true
  });
  const [awardForm, setAwardForm] = useState({
    user_id: '',
    title: '',
    description: '',
    badge_type: '',
    points: '',
    color: '#30d9fe',
    criteria: ''
  });

  useEffect(() => {
    fetchBadges();
    fetchUsers();
  }, [currentPage, searchTerm, typeFilter]);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        page_size: 20
      });

      if (searchTerm) params.append('search', searchTerm);
      if (typeFilter) params.append('badge_type', typeFilter);

      const response = await fetch(`${API_BASE_URL}/certificates/admin/badges/?${params}`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBadges(data.results || []);
        setTotalPages(Math.ceil((data.count || 0) / 20));
      } else {
        setError('Failed to fetch badges');
      }
    } catch (err) {
      setError('Error fetching badges');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleCreateBadge = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/certificates/admin/badges/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        setShowEditModal(false);
        setEditForm({
          title: '',
          description: '',
          badge_type: '',
          points: '',
          color: '#30d9fe',
          criteria: '',
          is_active: true
        });
        toast.success('Badge created successfully!');
        fetchBadges();
      } else {
        toast.error('Failed to create badge');
      }
    } catch (err) {
      toast.error('Error creating badge');
    }
  };

  const handleEditBadge = (badge) => {
    setSelectedBadge(badge);
    setEditForm({
      title: badge.title || '',
      description: badge.description || '',
      badge_type: badge.badge_type || '',
      points: badge.points || '',
      color: badge.color || '#30d9fe',
      criteria: badge.criteria || '',
      is_active: badge.is_active
    });
    setShowEditModal(true);
  };

  const handleUpdateBadge = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/certificates/admin/badges/${selectedBadge.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        setShowEditModal(false);
        toast.success('Badge updated successfully!');
        fetchBadges();
      } else {
        toast.error('Failed to update badge');
      }
    } catch (err) {
      toast.error('Error updating badge');
    }
  };

  const handleDeleteBadge = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/certificates/admin/badges/${selectedBadge.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setShowDeleteModal(false);
        toast.success('Badge deleted successfully!');
        fetchBadges();
      } else {
        toast.error('Failed to delete badge');
      }
    } catch (err) {
      toast.error('Error deleting badge');
    }
  };

  const handleAwardBadge = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/certificates/admin/badges/award/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(awardForm)
      });

      if (response.ok) {
        setShowAwardModal(false);
        setAwardForm({
          user_id: '',
          title: '',
          description: '',
          badge_type: '',
          points: '',
          color: '#30d9fe',
          criteria: ''
        });
        toast.success('Badge awarded successfully!');
        fetchBadges();
      } else {
        toast.error('Failed to award badge');
      }
    } catch (err) {
      toast.error('Error awarding badge');
    }
  };

  const getTypeBadge = (type) => {
    const typeColors = {
      achievement: 'bg-purple-100 text-purple-800',
      skill: 'bg-blue-100 text-blue-800',
      milestone: 'bg-green-100 text-green-800',
      special: 'bg-orange-100 text-orange-800',
      community: 'bg-pink-100 text-pink-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeColors[type] || 'bg-gray-100 text-gray-800'}`}>
        {type}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Badges Management</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAwardModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            🎖️ Award Badge
          </button>
          <button
            onClick={() => setShowEditModal(true)}
            className="bg-[#30d9fe] text-white px-4 py-2 rounded-lg hover:bg-[#00b8d4] transition-colors"
          >
            + Add Badge
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search badges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="achievement">Achievement</option>
              <option value="skill">Skill</option>
              <option value="milestone">Milestone</option>
              <option value="special">Special</option>
              <option value="community">Community</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchBadges}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Badges Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#30d9fe]"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Badge
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Awarded Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {badges.map((badge) => (
                  <tr key={badge.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div
                            className="h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: badge.color || '#30d9fe' }}
                          >
                            {badge.title?.charAt(0) || 'B'}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {badge.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {badge.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {badge.user_username}
                      </div>
                      <div className="text-sm text-gray-500">
                        {badge.user_unique_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(badge.badge_type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {badge.points} pts
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {badge.awarded_date ? new Date(badge.awarded_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditBadge(badge)}
                          className="text-[#30d9fe] hover:text-[#00b8d4]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBadge(badge);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <nav className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${currentPage === page
                    ? 'bg-[#30d9fe] text-white'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {selectedBadge ? 'Edit Badge' : 'Create Badge'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                      value={editForm.badge_type}
                      onChange={(e) => setEditForm({ ...editForm, badge_type: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                    >
                      <option value="">Select Type</option>
                      <option value="achievement">Achievement</option>
                      <option value="skill">Skill</option>
                      <option value="milestone">Milestone</option>
                      <option value="special">Special</option>
                      <option value="community">Community</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Points</label>
                    <input
                      type="number"
                      value={editForm.points}
                      onChange={(e) => setEditForm({ ...editForm, points: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Color</label>
                  <input
                    type="color"
                    value={editForm.color}
                    onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                    className="mt-1 w-full h-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Criteria</label>
                  <textarea
                    value={editForm.criteria}
                    onChange={(e) => setEditForm({ ...editForm, criteria: e.target.value })}
                    rows={2}
                    placeholder="e.g., Complete 5 courses, Score 90%+ on final exam"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editForm.is_active}
                    onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                    className="h-4 w-4 text-[#30d9fe] focus:ring-[#30d9fe] border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Active</label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedBadge(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={selectedBadge ? handleUpdateBadge : handleCreateBadge}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#30d9fe] rounded-lg hover:bg-[#00b8d4]"
                >
                  {selectedBadge ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Award Badge Modal */}
      {showAwardModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Award Badge</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">User</label>
                  <select
                    value={awardForm.user_id}
                    onChange={(e) => setAwardForm({ ...awardForm, user_id: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                  >
                    <option value="">Select User</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.first_name} {user.last_name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={awardForm.title}
                    onChange={(e) => setAwardForm({ ...awardForm, title: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={awardForm.description}
                    onChange={(e) => setAwardForm({ ...awardForm, description: e.target.value })}
                    rows={3}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                      value={awardForm.badge_type}
                      onChange={(e) => setAwardForm({ ...awardForm, badge_type: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                    >
                      <option value="">Select Type</option>
                      <option value="achievement">Achievement</option>
                      <option value="skill">Skill</option>
                      <option value="milestone">Milestone</option>
                      <option value="special">Special</option>
                      <option value="community">Community</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Points</label>
                    <input
                      type="number"
                      value={awardForm.points}
                      onChange={(e) => setAwardForm({ ...awardForm, points: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Color</label>
                  <input
                    type="color"
                    value={awardForm.color}
                    onChange={(e) => setAwardForm({ ...awardForm, color: e.target.value })}
                    className="mt-1 w-full h-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Criteria</label>
                  <textarea
                    value={awardForm.criteria}
                    onChange={(e) => setAwardForm({ ...awardForm, criteria: e.target.value })}
                    rows={2}
                    placeholder="e.g., Complete 5 courses, Score 90%+ on final exam"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAwardModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAwardBadge}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                >
                  Award Badge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Badge</h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to delete "{selectedBadge?.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteBadge}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBadges; 