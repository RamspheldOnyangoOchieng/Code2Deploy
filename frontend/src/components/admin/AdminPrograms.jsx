import React, { useState, useEffect } from 'react';
import authService from '../../services/authService';
import { API_BASE_URL } from '../../config/api';
import { useToast } from '../../contexts/ToastContext';

const AdminPrograms = () => {
  const toast = useToast();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    duration: '',
    level: 'Beginner',
    technologies: '',
    image: '',
    mode: 'Online',
    sessions_per_week: 3,
    has_certification: true,
    scholarship_available: true,
    is_paid: false,
    price: 0,
    coupon: '%coupon',
    prerequisites: '',
    modules: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchPrograms();
  }, [currentPage, searchTerm, levelFilter]);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: currentPage,
        page_size: 20
      });

      if (searchTerm) params.append('search', searchTerm);
      if (levelFilter) params.append('level', levelFilter);

      const token = authService.getToken();
      if (!token) {
        setError('You must be logged in to view programs');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/programs/?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Handle both paginated and non-paginated responses
        const programsList = Array.isArray(data) ? data : (data.results || data.programs || []);
        setPrograms(programsList);
        setTotalPages(data.total_pages || Math.ceil((data.count || programsList.length) / 20));
        setError(null);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.detail || `Failed to fetch programs (Status: ${response.status})`);
      }
    } catch (err) {
      console.error('Fetch programs error:', err);
      setError(`Error fetching programs: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProgram = async () => {
    try {
      const formData = new FormData();

      // Add all fields to FormData
      formData.append('title', editForm.title);
      formData.append('description', editForm.description);
      formData.append('duration', editForm.duration);
      formData.append('level', editForm.level);
      formData.append('technologies', editForm.technologies);
      formData.append('mode', editForm.mode);
      formData.append('sessions_per_week', editForm.sessions_per_week);
      formData.append('has_certification', editForm.has_certification);
      formData.append('scholarship_available', editForm.scholarship_available);
      formData.append('is_paid', editForm.is_paid);
      formData.append('price', editForm.price);
      formData.append('coupon', editForm.coupon || '%coupon');
      formData.append('prerequisites', editForm.prerequisites || '');
      formData.append('modules', editForm.modules || '');

      // Add image file if selected, otherwise add URL if provided
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (editForm.image) {
        formData.append('image', editForm.image);
      }

      const response = await fetch(`${API_BASE_URL}/programs/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          // Don't set Content-Type - browser will set it with boundary
        },
        body: formData
      });

      if (response.ok) {
        setShowCreateModal(false);
        setEditForm({
          title: '',
          description: '',
          duration: '',
          level: 'Beginner',
          technologies: '',
          image: '',
          mode: 'Online',
          sessions_per_week: 3,
          has_certification: true,
          scholarship_available: true,
          is_paid: false,
          price: 0,
          coupon: '%coupon',
          prerequisites: '',
          modules: ''
        });
        setImageFile(null);
        setImagePreview('');
        toast.success('Program created successfully!');
        fetchPrograms();
      } else {
        toast.error('Failed to create program');
      }
    } catch (err) {
      toast.error('Error creating program');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditProgram = (program) => {
    setSelectedProgram(program);
    setEditForm({
      title: program.title || '',
      description: program.description || '',
      duration: program.duration || '',
      level: program.level || 'Beginner',
      technologies: program.technologies || '',
      image: program.image || '',
      mode: program.mode || 'Online',
      sessions_per_week: program.sessions_per_week || 3,
      has_certification: program.has_certification !== undefined ? program.has_certification : true,
      scholarship_available: program.scholarship_available !== undefined ? program.scholarship_available : true,
      is_paid: program.is_paid !== undefined ? program.is_paid : false,
      price: program.price || 0,
      coupon: program.coupon || '%coupon',
      prerequisites: program.prerequisites || '',
      modules: program.modules || ''
    });
    setImagePreview(program.image || '');
    setImageFile(null);
    setShowEditModal(true);
  };

  const handleUpdateProgram = async () => {
    try {
      const formData = new FormData();

      // Add all fields to FormData
      formData.append('title', editForm.title);
      formData.append('description', editForm.description);
      formData.append('duration', editForm.duration);
      formData.append('level', editForm.level);
      formData.append('technologies', editForm.technologies);
      formData.append('mode', editForm.mode);
      formData.append('sessions_per_week', editForm.sessions_per_week);
      formData.append('has_certification', editForm.has_certification);
      formData.append('scholarship_available', editForm.scholarship_available);
      formData.append('is_paid', editForm.is_paid);
      formData.append('price', editForm.price);
      formData.append('coupon', editForm.coupon || '%coupon');
      formData.append('prerequisites', editForm.prerequisites || '');
      formData.append('modules', editForm.modules || '');

      // Add image file if new file selected, otherwise keep existing
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (editForm.image && typeof editForm.image === 'string') {
        // If it's a URL string, send it as is
        formData.append('image', editForm.image);
      }

      const response = await fetch(`${API_BASE_URL}/programs/${selectedProgram.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          // Don't set Content-Type - browser will set it with boundary
        },
        body: formData
      });

      if (response.ok) {
        setShowEditModal(false);
        setImageFile(null);
        setImagePreview('');
        toast.success('Program updated successfully!');
        fetchPrograms();
      } else {
        toast.error('Failed to update program');
      }
    } catch (err) {
      toast.error('Error updating program');
    }
  };

  const handleDeleteProgram = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/programs/${selectedProgram.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setShowDeleteModal(false);
        toast.success('Program deleted successfully!');
        fetchPrograms();
      } else {
        toast.error('Failed to delete program');
      }
    } catch (err) {
      toast.error('Error deleting program');
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

  const getLevelBadge = (level) => {
    const levelColors = {
      'Beginner': 'bg-green-100 text-green-800',
      'Intermediate': 'bg-yellow-100 text-yellow-800',
      'Advanced': 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${levelColors[level] || 'bg-gray-100 text-gray-800'}`}>
        {level}
      </span>
    );
  };

  const getModeBadge = (mode) => {
    const modeColors = {
      'Online': 'bg-blue-100 text-blue-800',
      'Hybrid': 'bg-purple-100 text-purple-800',
      'On-site': 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${modeColors[mode] || 'bg-gray-100 text-gray-800'}`}>
        {mode}
      </span>
    );
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Programs Management</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full sm:w-auto bg-[#30d9fe] text-white px-4 py-2 rounded-lg hover:bg-[#00b8d4] transition-colors text-sm md:text-base"
        >
          <i className="fas fa-plus mr-2"></i>Add Program
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
              <i className="fas fa-search text-[#30d9fe] mr-2"></i>Search
            </label>
            <input
              type="text"
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
              <i className="fas fa-layer-group text-[#30d9fe] mr-2"></i>Level
            </label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent"
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchPrograms}
              className="w-full bg-gradient-to-r from-[#30d9fe] to-blue-500 text-white px-4 py-2 rounded-lg hover:from-[#eec262] hover:to-[#d4a952] transition-all shadow-md text-sm"
            >
              <i className="fas fa-sync-alt mr-2"></i>
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Programs Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#30d9fe]"></div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Program
                    </th>
                    <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="hidden lg:table-cell px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="hidden lg:table-cell px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mode
                    </th>
                    <th className="hidden xl:table-cell px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Technologies
                    </th>
                    <th className="hidden xl:table-cell px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Features
                    </th>
                    <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enrollments
                    </th>
                    <th className="px-3 md:px-6 py-2 md:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {programs.map((program) => (
                    <tr key={program.id} className="hover:bg-gray-50">
                      <td className="px-3 md:px-6 py-3 md:py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={program.image || 'https://via.placeholder.com/48'}
                              alt=""
                            />
                          </div>
                          <div className="ml-4 min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {program.title}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {program.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                        {getLevelBadge(program.level)}
                      </td>
                      <td className="hidden lg:table-cell px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-500">
                        {program.duration}
                      </td>
                      <td className="hidden lg:table-cell px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                        {getModeBadge(program.mode)}
                      </td>
                      <td className="hidden xl:table-cell px-3 md:px-6 py-3 md:py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {program.technologies}
                        </div>
                      </td>
                      <td className="hidden xl:table-cell px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                        <div className="flex space-x-1">
                          {program.has_certification && (
                            <span className="text-yellow-500" title="Certification">
                              <i className="fas fa-certificate"></i>
                            </span>
                          )}
                          {program.scholarship_available && (
                            <span className="text-green-500" title="Scholarship">
                              <i className="fas fa-hand-holding-usd"></i>
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-500">
                        {program.enrollment_count || 0}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditProgram(program)}
                            className="text-[#30d9fe] hover:text-[#00b8d4]"
                            title="Edit"
                          >
                            <i className="fas fa-edit mr-1"></i>Edit
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProgram(program);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <i className="fas fa-trash mr-1"></i>Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200">
              {programs.map((program) => (
                <div key={program.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <img
                      src={program.image || 'https://via.placeholder.com/48'}
                      alt={program.title}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        {program.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                        {program.description}
                      </p>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {getLevelBadge(program.level)}
                        {getModeBadge(program.mode)}
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                          {program.duration}
                        </span>
                      </div>

                      {/* Technologies */}
                      <div className="mb-3">
                        <div className="text-xs text-gray-600 line-clamp-1">
                          <i className="fas fa-code text-[#30d9fe] mr-1"></i>
                          {program.technologies}
                        </div>
                      </div>

                      {/* Features & Stats */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex space-x-2">
                          {program.has_certification && (
                            <span className="text-yellow-500" title="Certification">
                              <i className="fas fa-certificate text-sm"></i>
                            </span>
                          )}
                          {program.scholarship_available && (
                            <span className="text-green-500" title="Scholarship">
                              <i className="fas fa-hand-holding-usd text-sm"></i>
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          <i className="fas fa-users mr-1"></i>
                          {program.enrollment_count || 0} enrolled
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditProgram(program)}
                          className="flex-1 px-3 py-2 bg-[#30d9fe] text-white text-xs font-medium rounded-lg hover:bg-[#00b8d4] transition-colors"
                        >
                          <i className="fas fa-edit mr-1"></i>Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProgram(program);
                            setShowDeleteModal(true);
                          }}
                          className="px-3 py-2 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty state */}
            {programs.length === 0 && !loading && !error && (
              <div className="text-center py-8 md:py-12 px-4">
                <i className="fas fa-inbox text-4xl md:text-5xl text-gray-300 mb-3"></i>
                <p className="text-sm md:text-base text-gray-500 mb-3">No programs found</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="text-sm text-[#30d9fe] hover:text-[#00b8d4] font-medium"
                >
                  <i className="fas fa-plus mr-2"></i>Create your first program
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center px-4">
          <nav className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-xs md:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              <i className="fas fa-chevron-left md:hidden"></i>
              <span className="hidden md:inline">Previous</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 text-xs md:text-sm font-medium rounded-md ${currentPage === page
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
              className="px-3 py-2 text-xs md:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              <i className="fas fa-chevron-right md:hidden"></i>
              <span className="hidden md:inline">Next</span>
            </button>
          </nav>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-start md:items-center justify-center p-2 md:p-4">
          <div className="relative mx-auto p-4 md:p-6 border w-full max-w-4xl shadow-lg rounded-xl bg-white max-h-[95vh] md:max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center sticky top-0 bg-white z-10 pb-3 border-b">
                <i className={`fas fa-${showCreateModal ? 'plus' : 'edit'} text-[#30d9fe] mr-2 md:mr-3 text-base md:text-xl`}></i>
                <span className="flex-1">{showCreateModal ? 'Create New Program' : 'Edit Program'}</span>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    setImageFile(null);
                    setImagePreview('');
                  }}
                  className="md:hidden text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4">
                {/* Left Column */}
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                      <i className="fas fa-heading text-[#30d9fe] mr-2"></i>Program Title *
                    </label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      placeholder="e.g., Full-Stack Web Development"
                      className="w-full px-3 md:px-4 py-2 text-sm md:text-base bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe] placeholder-gray-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                      <i className="fas fa-align-left text-[#30d9fe] mr-2"></i>Description *
                    </label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={3}
                      placeholder="Describe what students will learn..."
                      className="w-full px-3 md:px-4 py-2 text-sm md:text-base bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe] placeholder-gray-400"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <i className="fas fa-clock text-[#30d9fe] mr-2"></i>Duration *
                      </label>
                      <input
                        type="text"
                        value={editForm.duration}
                        onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                        placeholder="e.g., 12 Weeks"
                        className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe] placeholder-gray-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <i className="fas fa-layer-group text-[#30d9fe] mr-2"></i>Level *
                      </label>
                      <select
                        value={editForm.level}
                        onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}
                        className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                        required
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <i className="fas fa-code text-[#30d9fe] mr-2"></i>Technologies (comma-separated) *
                    </label>
                    <input
                      type="text"
                      value={editForm.technologies}
                      onChange={(e) => setEditForm({ ...editForm, technologies: e.target.value })}
                      placeholder="e.g., HTML, CSS, JavaScript, React"
                      className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe] placeholder-gray-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <i className="fas fa-laptop text-[#30d9fe] mr-2"></i>Mode *
                    </label>
                    <select
                      value={editForm.mode}
                      onChange={(e) => setEditForm({ ...editForm, mode: e.target.value })}
                      className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                    >
                      <option value="Online">Online</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="On-site">On-site</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <i className="fas fa-calendar-week text-[#30d9fe] mr-2"></i>Sessions Per Week
                    </label>
                    <input
                      type="number"
                      value={editForm.sessions_per_week}
                      onChange={(e) => setEditForm({ ...editForm, sessions_per_week: parseInt(e.target.value) || 0 })}
                      min="1"
                      max="7"
                      className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <i className="fas fa-image text-[#30d9fe] mr-2"></i>Program Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                    />
                    <p className="text-xs text-gray-500 mt-1">Or enter image URL below</p>
                    <input
                      type="url"
                      value={editForm.image}
                      onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="mt-2 w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe] placeholder-gray-400"
                    />
                    {(imagePreview || editForm.image) && (
                      <div className="mt-3">
                        <img
                          src={imagePreview || editForm.image}
                          alt="Preview"
                          className="w-full h-40 object-cover rounded-lg border-2 border-gray-200"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <i className="fas fa-book text-[#30d9fe] mr-2"></i>Modules (comma-separated)
                    </label>
                    <textarea
                      value={editForm.modules}
                      onChange={(e) => setEditForm({ ...editForm, modules: e.target.value })}
                      rows={3}
                      placeholder="e.g., Introduction, HTML Basics, CSS Fundamentals"
                      className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe] placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <i className="fas fa-check-circle text-[#30d9fe] mr-2"></i>Prerequisites
                    </label>
                    <textarea
                      value={editForm.prerequisites}
                      onChange={(e) => setEditForm({ ...editForm, prerequisites: e.target.value })}
                      rows={3}
                      placeholder="e.g., Basic computer knowledge"
                      className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe] placeholder-gray-400"
                    />
                  </div>

                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editForm.has_certification}
                        onChange={(e) => setEditForm({ ...editForm, has_certification: e.target.checked })}
                        className="h-5 w-5 text-[#30d9fe] focus:ring-[#30d9fe] border-gray-300 rounded"
                        id="has_certification"
                      />
                      <label htmlFor="has_certification" className="ml-3 block text-sm font-medium text-gray-900">
                        <i className="fas fa-certificate text-yellow-500 mr-2"></i>
                        Offers Certification
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editForm.scholarship_available}
                        onChange={(e) => setEditForm({ ...editForm, scholarship_available: e.target.checked })}
                        className="h-5 w-5 text-[#30d9fe] focus:ring-[#30d9fe] border-gray-300 rounded"
                        id="scholarship_available"
                      />
                      <label htmlFor="scholarship_available" className="ml-3 block text-sm font-medium text-gray-900">
                        <i className="fas fa-hand-holding-usd text-green-500 mr-2"></i>
                        Scholarship Available
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editForm.is_paid}
                        onChange={(e) => setEditForm({ ...editForm, is_paid: e.target.checked })}
                        className="h-5 w-5 text-[#30d9fe] focus:ring-[#30d9fe] border-gray-300 rounded"
                        id="is_paid"
                      />
                      <label htmlFor="is_paid" className="ml-3 block text-sm font-medium text-gray-900">
                        <i className="fas fa-dollar-sign text-blue-500 mr-2"></i>
                        Paid Program
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing and Coupon Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <i className="fas fa-tag mr-2"></i>Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <i className="fas fa-ticket-alt mr-2"></i>Coupon Code
                  </label>
                  <input
                    type="text"
                    value={editForm.coupon}
                    onChange={(e) => setEditForm({ ...editForm, coupon: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                    placeholder="%coupon"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:space-x-4 mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200 sticky bottom-0 bg-white z-10">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    setImageFile(null);
                    setImagePreview('');
                  }}
                  className="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <i className="fas fa-times mr-2"></i>Cancel
                </button>
                <button
                  onClick={showCreateModal ? handleCreateProgram : handleUpdateProgram}
                  className="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-semibold text-white bg-gradient-to-r from-[#30d9fe] to-blue-500 rounded-lg hover:from-[#eec262] hover:to-[#d4a952] transition-all shadow-lg"
                >
                  <i className={`fas fa-${showCreateModal ? 'plus' : 'save'} mr-2`}></i>
                  {showCreateModal ? 'Create Program' : 'Update Program'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative mx-auto p-4 md:p-5 border w-full max-w-md shadow-lg rounded-xl bg-white">
            <div>
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-100 flex items-center justify-center mr-3">
                  <i className="fas fa-exclamation-triangle text-red-600 text-lg md:text-xl"></i>
                </div>
                <h3 className="text-base md:text-lg font-semibold text-gray-900">Delete Program</h3>
              </div>
              <p className="text-sm md:text-base text-gray-600 mb-5 md:mb-6 pl-13 md:pl-15">
                Are you sure you want to delete <span className="font-semibold">"{selectedProgram?.title}"</span>? This action cannot be undone.
              </p>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <i className="fas fa-times mr-2"></i>Cancel
                </button>
                <button
                  onClick={handleDeleteProgram}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <i className="fas fa-trash mr-2"></i>Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPrograms; 