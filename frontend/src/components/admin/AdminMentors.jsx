import React, { useState, useEffect } from 'react';
import authService from '../../services/authService';
import { API_BASE_URL } from '../../config/api';
import { useToast } from '../../contexts/ToastContext';

const AdminMentors = () => {
  const toast = useToast();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    specialty: '',
    bio: '',
    experience_years: '',
    hourly_rate: '',
    is_active: true
  });

  useEffect(() => {
    fetchMentors();
  }, [currentPage, searchTerm, statusFilter, specialtyFilter]);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        page_size: 20
      });

      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('is_active', statusFilter);
      if (specialtyFilter) params.append('expertise', specialtyFilter);

      const response = await fetch(`${API_BASE_URL}/mentors/?${params}`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMentors(data.results || []);
        setTotalPages(Math.ceil((data.count || 0) / 20));
      } else {
        setError('Failed to fetch mentors');
      }
    } catch (err) {
      setError('Error fetching mentors');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMentor = async () => {
    try {
      setError(null);

      const response = await fetch(`${API_BASE_URL}/mentors/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      const data = await response.json();

      if (response.ok) {
        setShowCreateModal(false);
        setEditForm({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          specialty: '',
          bio: '',
          experience_years: '',
          hourly_rate: '',
          is_active: true
        });
        toast.success(`Mentor "${editForm.first_name} ${editForm.last_name}" created successfully! A welcome email with login credentials has been sent.`);
        fetchMentors();
      } else {
        toast.error(data.error || 'Failed to create mentor');
      }
    } catch (err) {
      toast.error('Error creating mentor: ' + err.message);
    }
  };

  const handleEditMentor = (mentor) => {
    setSelectedMentor(mentor);
    setEditForm({
      first_name: mentor.first_name || '',
      last_name: mentor.last_name || '',
      email: mentor.email || '',
      phone: mentor.phone || '',
      specialty: mentor.specialty || '',
      bio: mentor.bio || '',
      experience_years: mentor.experience_years || '',
      hourly_rate: mentor.hourly_rate || '',
      is_active: mentor.is_active
    });
    setShowEditModal(true);
  };

  const handleUpdateMentor = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/mentors/${selectedMentor.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        setShowEditModal(false);
        toast.success('Mentor updated successfully!');
        fetchMentors();
      } else {
        toast.error('Failed to update mentor');
      }
    } catch (err) {
      toast.error('Error updating mentor');
    }
  };

  const handleDeleteMentor = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/mentors/${selectedMentor.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setShowDeleteModal(false);
        toast.success('Mentor deleted successfully!');
        fetchMentors();
      } else {
        toast.error('Failed to delete mentor');
      }
    } catch (err) {
      toast.error('Error deleting mentor');
    }
  };

  const getStatusBadge = (isActive) => (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${isActive
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800'
      }`}>
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );

  const getSpecialtyBadge = (specialty) => {
    const specialtyColors = {
      'web-development': 'bg-blue-100 text-blue-800',
      'mobile-development': 'bg-green-100 text-green-800',
      'data-science': 'bg-purple-100 text-purple-800',
      'cybersecurity': 'bg-red-100 text-red-800',
      'ui-ux': 'bg-pink-100 text-pink-800',
      'devops': 'bg-orange-100 text-orange-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${specialtyColors[specialty] || 'bg-gray-100 text-gray-800'}`}>
        {specialty}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Mentors Management</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#30d9fe] text-white px-4 py-2 rounded-lg hover:bg-[#00b8d4] transition-colors"
        >
          + Add Mentor
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search mentors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent"
            >
              <option value="">All Specialties</option>
              <option value="web-development">Web Development</option>
              <option value="mobile-development">Mobile Development</option>
              <option value="data-science">Data Science</option>
              <option value="cybersecurity">Cybersecurity</option>
              <option value="ui-ux">UI/UX Design</option>
              <option value="devops">DevOps</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchMentors}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Mentors Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#30d9fe]"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mentor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mentors.map((mentor) => (
                  <tr key={mentor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-full object-cover"
                            src={mentor.avatar || 'https://via.placeholder.com/48'}
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {mentor.first_name} {mentor.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{mentor.email}</div>
                          <div className="text-xs text-gray-400">{mentor.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getSpecialtyBadge(mentor.specialty)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {mentor.experience_years} years
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${mentor.hourly_rate}/hr
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(mentor.is_active)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditMentor(mentor)}
                          className="text-[#30d9fe] hover:text-[#00b8d4]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedMentor(mentor);
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
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {showCreateModal ? 'Create Mentor' : 'Edit Mentor'}
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      value={editForm.first_name}
                      onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      value={editForm.last_name}
                      onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Specialty</label>
                  <select
                    value={editForm.specialty}
                    onChange={(e) => setEditForm({ ...editForm, specialty: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                  >
                    <option value="">Select Specialty</option>
                    <option value="web-development">Web Development</option>
                    <option value="mobile-development">Mobile Development</option>
                    <option value="data-science">Data Science</option>
                    <option value="cybersecurity">Cybersecurity</option>
                    <option value="ui-ux">UI/UX Design</option>
                    <option value="devops">DevOps</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    rows={3}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Experience (Years)</label>
                    <input
                      type="number"
                      value={editForm.experience_years}
                      onChange={(e) => setEditForm({ ...editForm, experience_years: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hourly Rate ($)</label>
                    <input
                      type="number"
                      value={editForm.hourly_rate}
                      onChange={(e) => setEditForm({ ...editForm, hourly_rate: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                    />
                  </div>
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
                    setShowCreateModal(false);
                    setShowEditModal(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={showCreateModal ? handleCreateMentor : handleUpdateMentor}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#30d9fe] rounded-lg hover:bg-[#00b8d4]"
                >
                  {showCreateModal ? 'Create' : 'Update'}
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Mentor</h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to delete "{selectedMentor?.first_name} {selectedMentor?.last_name}"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteMentor}
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

export default AdminMentors; 