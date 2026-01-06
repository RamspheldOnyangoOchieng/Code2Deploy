import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout';
import authService from '../services/authService';
import { API_BASE_URL } from '../config/api';

const Programs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    duration: '',
    difficulty: '',
    technology: ''
  });
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
  const [pageSettings, setPageSettings] = useState(null);

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      duration: '',
      difficulty: '',
      technology: ''
    });
  };

  // Fetch programs and page settings from backend
  useEffect(() => {
    fetchPrograms();
    fetchPageSettings();
  }, []);

  const fetchPageSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/page-settings/programs/`);
      if (response.ok) {
        const data = await response.json();
        setPageSettings(data);
      }
    } catch (error) {
      console.error('Error fetching programs page settings:', error);
    }
  };

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/programs/`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPrograms(data.results || data);
        setError(null);
      } else {
        setError('Failed to load programs');
      }
    } catch (err) {
      console.error('Error fetching programs:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (program) => {
    setSelectedProgram(program);
    setShowModal(true);
    setEnrollmentSuccess(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProgram(null);
    setEnrollmentSuccess(false);
  };

  const handleEnroll = async () => {
    const user = authService.getCurrentUser();
    if (!user) {
      alert('Please login to enroll in this program');
      window.location.href = '/';
      return;
    }

    try {
      setEnrolling(true);
      const response = await fetch(`${API_BASE_URL}/programs/enroll/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          program_id: selectedProgram.id
        })
      });

      if (response.ok) {
        setEnrollmentSuccess(true);
        setTimeout(() => {
          closeModal();
        }, 2000);
      } else {
        const data = await response.json();
        alert(data.detail || 'Failed to enroll. You may already be enrolled.');
      }
    } catch (err) {
      console.error('Error enrolling:', err);
      alert('Failed to enroll in program');
    } finally {
      setEnrolling(false);
    }
  };

  // Filter programs based on search term and filters
  useEffect(() => {
    let results = [...programs];
    if (searchTerm) {
      results = results.filter(program =>
        program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (program.technologies && program.technologies.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (filters.duration) {
      results = results.filter(program => program.duration === filters.duration);
    }
    if (filters.difficulty) {
      results = results.filter(program => program.level === filters.difficulty);
    }
    if (filters.technology) {
      results = results.filter(program =>
        program.technologies && program.technologies.toLowerCase().includes(filters.technology.toLowerCase())
      );
    }
    setFilteredPrograms(results);
  }, [searchTerm, filters, programs]);

  // Parse technologies string to array
  const getTechnologies = (techString) => {
    if (!techString) return [];
    return techString.split(',').map(tech => tech.trim());
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-[#03325a] text-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{pageSettings?.hero_title || 'All Programs'}</h1>
              <p className="text-base sm:text-lg text-gray-300">{pageSettings?.hero_subtitle || 'Explore our comprehensive range of tech training programs'}</p>
              {pageSettings?.hero_description && (
                <p className="text-sm text-gray-400 mt-2">{pageSettings.hero_description}</p>
              )}
            </div>
            <div className="mt-8 text-center">
              <Link to="/">
                <button className="px-6 py-3 sm:px-8 sm:py-4 bg-[#30d9fe] hover:bg-[#eec262] text-[#03325a] text-base sm:text-lg font-bold rounded-lg transition-all duration-300 whitespace-nowrap w-full sm:w-auto">
                  Back to Home
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <section className="py-6 sm:py-8 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="w-full md:w-1/3 relative">
              <input
                type="text"
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 sm:py-3 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent text-sm"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap gap-2 sm:gap-4 w-full md:w-auto">
              {/* Duration Filter */}
              <select
                value={filters.duration}
                onChange={(e) => setFilters({...filters, duration: e.target.value})}
                className="appearance-none w-full sm:w-auto py-2 sm:py-3 px-4 pr-8 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#30d9fe] bg-white text-sm"
              >
                <option value="">Duration (All)</option>
                <option value="10 Weeks">10 Weeks</option>
                <option value="12 Weeks">12 Weeks</option>
                <option value="14 Weeks">14 Weeks</option>
                <option value="16 Weeks">16 Weeks</option>
                <option value="20 Weeks">20 Weeks</option>
              </select>

              {/* Difficulty Filter */}
              <select
                value={filters.difficulty}
                onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                className="appearance-none w-full sm:w-auto py-2 sm:py-3 px-4 pr-8 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#30d9fe] bg-white text-sm"
              >
                <option value="">Difficulty (All)</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>

              {/* Clear Filters Button */}
              <button
                onClick={clearFilters}
                className="px-4 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300 text-sm font-medium whitespace-nowrap"
              >
                <i className="fas fa-times mr-2"></i>
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-8 sm:py-12 min-h-[600px]">
        <div className="container mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#30d9fe] border-t-transparent mb-4"></div>
              <p className="text-gray-600 font-medium">Loading programs...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16">
              <div className="text-center mb-6">
                <i className="fas fa-exclamation-triangle text-5xl sm:text-6xl text-red-400 mb-4"></i>
                <h3 className="text-xl sm:text-2xl font-bold text-[#03325a] mb-2">Error Loading Programs</h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">{error}</p>
                <button
                  onClick={fetchPrograms}
                  className="px-6 py-2 bg-[#30d9fe] text-[#03325a] font-medium rounded-lg hover:bg-opacity-90 transition-all duration-300"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : filteredPrograms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredPrograms.map(program => (
                <div key={program.id} className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] flex flex-col">
                  <div className="h-40 sm:h-48 overflow-hidden relative bg-gradient-to-br from-blue-500 to-blue-600">
                    {program.image ? (
                      <img
                        src={program.image}
                        alt={program.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white">
                        <i className="fas fa-graduation-cap text-6xl opacity-30"></i>
                      </div>
                    )}
                    <div className="absolute top-0 left-0 m-2 sm:m-3">
                      <span className="bg-[#03325a] text-[#30d9fe] text-xs font-bold px-2 sm:px-3 py-1 rounded-full">{program.duration}</span>
                    </div>
                    <div className="absolute top-0 right-0 m-2 sm:m-3">
                      <span className="bg-[#eec262] text-[#03325a] text-xs font-bold px-2 sm:px-3 py-1 rounded-full">{program.level}</span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6 flex-1 flex flex-col">
                    <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-[#03325a]">{program.title}</h3>
                    <p className="text-gray-600 mb-2 sm:mb-4 line-clamp-2 text-xs sm:text-sm">{program.description}</p>
                    <div className="flex flex-wrap gap-2 mb-2 sm:mb-6">
                      {getTechnologies(program.technologies).slice(0, 4).map((tech, index) => (
                        <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">{tech}</span>
                      ))}
                      {getTechnologies(program.technologies).length > 4 && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">+{getTechnologies(program.technologies).length - 4}</span>
                      )}
                    </div>
                    <button 
                      onClick={() => openModal(program)}
                      className="w-full py-2 bg-[#30d9fe] text-[#03325a] font-medium rounded-lg hover:bg-[#eec262] transition-all duration-300 whitespace-nowrap mt-auto text-xs sm:text-base"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16">
              <div className="text-center mb-6">
                <i className="fas fa-search text-5xl sm:text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-xl sm:text-2xl font-bold text-[#03325a] mb-2">No Programs Found</h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">{pageSettings?.no_programs_message || "We couldn't find any programs matching your search criteria."}</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-[#30d9fe] text-[#03325a] font-medium rounded-lg hover:bg-opacity-90 transition-all duration-300"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Program Details Modal */}
      {showModal && selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header with Image */}
            <div className="relative h-64 bg-gradient-to-br from-blue-500 to-blue-600">
              {selectedProgram.image ? (
                <img src={selectedProgram.image} alt={selectedProgram.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <i className="fas fa-graduation-cap text-8xl opacity-30"></i>
                </div>
              )}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-10 h-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center text-gray-700 hover:text-gray-900 transition-all shadow-lg"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h2 className="text-3xl font-bold text-white mb-2">{selectedProgram.title}</h2>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-[#30d9fe] text-[#03325a] text-sm font-bold px-3 py-1 rounded-full">
                    <i className="fas fa-clock mr-2"></i>{selectedProgram.duration}
                  </span>
                  <span className="bg-[#eec262] text-[#03325a] text-sm font-bold px-3 py-1 rounded-full">
                    <i className="fas fa-layer-group mr-2"></i>{selectedProgram.level}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8">
              {/* Success Message */}
              {enrollmentSuccess && (
                <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                  <div className="flex items-center">
                    <i className="fas fa-check-circle text-green-500 text-2xl mr-3"></i>
                    <div>
                      <p className="font-semibold text-green-800">Successfully Enrolled!</p>
                      <p className="text-sm text-green-700">You have been enrolled in this program. Check your dashboard for more details.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-[#03325a] mb-3 flex items-center">
                  <i className="fas fa-info-circle text-[#30d9fe] mr-2"></i>
                  About This Program
                </h3>
                <p className="text-gray-700 leading-relaxed">{selectedProgram.description}</p>
              </div>

              {/* Technologies */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-[#03325a] mb-3 flex items-center">
                  <i className="fas fa-code text-[#30d9fe] mr-2"></i>
                  Technologies Covered
                </h3>
                <div className="flex flex-wrap gap-2">
                  {getTechnologies(selectedProgram.technologies).map((tech, index) => (
                    <span key={index} className="bg-blue-50 text-blue-700 text-sm px-4 py-2 rounded-lg font-medium border border-blue-200">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Program Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Duration & Mode */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
                  <h4 className="font-bold text-[#03325a] mb-3 flex items-center">
                    <i className="fas fa-calendar-alt text-blue-600 mr-2"></i>
                    Duration & Schedule
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span className="text-gray-600">Total Duration:</span>
                      <span className="font-semibold text-gray-800">{selectedProgram.duration}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Mode:</span>
                      <span className="font-semibold text-gray-800">Online / Hybrid</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Sessions:</span>
                      <span className="font-semibold text-gray-800">3x per week</span>
                    </p>
                  </div>
                </div>

                {/* Level & Prerequisites */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200">
                  <h4 className="font-bold text-[#03325a] mb-3 flex items-center">
                    <i className="fas fa-graduation-cap text-purple-600 mr-2"></i>
                    Level & Requirements
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span className="text-gray-600">Difficulty Level:</span>
                      <span className="font-semibold text-gray-800">{selectedProgram.level}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Prerequisites:</span>
                      <span className="font-semibold text-gray-800">{selectedProgram.level === 'Beginner' ? 'None' : 'Basic Coding'}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Certification:</span>
                      <span className="font-semibold text-gray-800">Yes</span>
                    </p>
                  </div>
                </div>

                {/* Scholarship */}
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 rounded-xl border border-yellow-200">
                  <h4 className="font-bold text-[#03325a] mb-3 flex items-center">
                    <i className="fas fa-hand-holding-usd text-yellow-600 mr-2"></i>
                    Scholarship & Pricing
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span className="text-gray-600">Scholarships:</span>
                      <span className="font-semibold text-green-600">Available</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Payment Plans:</span>
                      <span className="font-semibold text-gray-800">Flexible</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Financial Aid:</span>
                      <span className="font-semibold text-gray-800">Contact Us</span>
                    </p>
                  </div>
                </div>

                {/* What You'll Learn */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border border-green-200">
                  <h4 className="font-bold text-[#03325a] mb-3 flex items-center">
                    <i className="fas fa-lightbulb text-green-600 mr-2"></i>
                    What You'll Gain
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-start">
                      <i className="fas fa-check text-green-600 mr-2 mt-1"></i>
                      <span className="text-gray-700">Hands-on Projects</span>
                    </p>
                    <p className="flex items-start">
                      <i className="fas fa-check text-green-600 mr-2 mt-1"></i>
                      <span className="text-gray-700">Industry Certificate</span>
                    </p>
                    <p className="flex items-start">
                      <i className="fas fa-check text-green-600 mr-2 mt-1"></i>
                      <span className="text-gray-700">Career Support</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Enrollment Button */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleEnroll}
                  disabled={enrolling || enrollmentSuccess}
                  className="flex-1 bg-gradient-to-r from-[#30d9fe] to-blue-500 text-white py-4 rounded-xl font-bold text-lg hover:from-[#eec262] hover:to-[#d4a952] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {enrolling ? (
                    <span><i className="fas fa-spinner fa-spin mr-2"></i>Enrolling...</span>
                  ) : enrollmentSuccess ? (
                    <span><i className="fas fa-check mr-2"></i>Enrolled Successfully!</span>
                  ) : (
                    <span><i className="fas fa-user-plus mr-2"></i>Enroll Now</span>
                  )}
                </button>
                <button
                  onClick={closeModal}
                  className="sm:w-32 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Programs;
