import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo2-clear.png';
import authService from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import SignupModal from './SignupModal';
import LoginModal from './LoginModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import LogoutModal from './LogoutModal';

const Layout = ({ children }) => {
  const {
    user,
    logout,
    login,
    signup,
    isLoginModalOpen,
    isSignupModalOpen,
    isForgotPasswordModalOpen,
    openLoginModal,
    openSignupModal,
    openForgotPasswordModal,
    closeModals
  } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserDropdownOpen && !event.target.closest('.user-dropdown')) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  useEffect(() => {
    // Set active tab based on current location
    const path = location.pathname;
    if (path === '/') setActiveTab('home');
    else if (path === '/programs') setActiveTab('programs');
    else if (path === '/events') setActiveTab('events');
    else if (path === '/about') setActiveTab('about');
    else if (path === '/contact') setActiveTab('contact');
    else if (path === '/contact') setActiveTab('contact');

    // Check for showLogin state from navigation
    if ((location.state?.showLogin || new URLSearchParams(location.search).get('login') === 'true') && !user) {
      openLoginModal();
      // Clear the state so it doesn't reopen on refresh/navigation if possible, 
      // but modifying history state directly during render/effect needs care. 
      // For now, opening it is sufficient.
      // Better: navigate(location.pathname, { replace: true, state: {} }); 
      // but that might trigger re-render loops if not careful.
      // Let's just open it.
      // If query param, remove it?
      if (new URLSearchParams(location.search).get('login') === 'true') {
        // Maybe clean up URL?
      }
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, user, openLoginModal, navigate]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
    setIsUserDropdownOpen(false);
    setIsMenuOpen(false);
  };

  const handleLogoutConfirm = () => {
    logout();
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  const handlePartnerSponsor = () => {
    // Navigate to contact page with sponsor parameter
    navigate('/contact?type=sponsor');
  };

  const handleEducationPartner = () => {
    // Navigate to contact page with education partner parameter
    navigate('/contact?type=education-partner');
  };

  const handleSignupSuccess = (user) => {
    setUser(user);
    setIsSignupModalOpen(false);
  };

  const handleLoginSuccess = (user) => {
    setUser(user);
    setIsLoginModalOpen(false);
  };

  const getInitials = (user) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user.username ? user.username.substring(0, 2).toUpperCase() : 'U';
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] font-sans text-gray-800 bg-white flex flex-col overflow-x-hidden">
      {/* Navigation */}
      <nav className="bg-gradient-to-b from-[#0A0F2C] to-[#0A0F2C] sticky top-0 z-50 text-white w-full" aria-label="Main Navigation">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center" aria-label="Home">
                <img
                  src={logo}
                  alt="Code2Deploy Logo"
                  className="h-8 sm:h-10 lg:h-12 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation Links - Hidden below xl (1280px) */}
            <div className="hidden xl:flex items-center justify-center flex-1 px-8">
              <div className="flex items-center space-x-6 2xl:space-x-10">
                <Link
                  to="/"
                  className={`text-sm 2xl:text-base font-medium hover:text-[#30d9fe] transition-colors duration-300 whitespace-nowrap ${activeTab === 'home' ? 'text-[#30d9fe]' : 'text-white'}`}
                >
                  Home
                </Link>
                <Link
                  to="/programs"
                  className={`text-sm 2xl:text-base font-medium hover:text-[#30d9fe] transition-colors duration-300 whitespace-nowrap ${activeTab === 'programs' ? 'text-[#30d9fe]' : 'text-white'}`}
                >
                  Programs
                </Link>
                <Link
                  to="/events"
                  className={`text-sm 2xl:text-base font-medium hover:text-[#30d9fe] transition-colors duration-300 whitespace-nowrap ${activeTab === 'events' ? 'text-[#30d9fe]' : 'text-white'}`}
                >
                  Events
                </Link>
                <Link
                  to="/about"
                  className={`text-sm 2xl:text-base font-medium hover:text-[#30d9fe] transition-colors duration-300 whitespace-nowrap ${activeTab === 'about' ? 'text-[#30d9fe]' : 'text-white'}`}
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  className={`text-sm 2xl:text-base font-medium hover:text-[#30d9fe] transition-colors duration-300 whitespace-nowrap ${activeTab === 'contact' ? 'text-[#30d9fe]' : 'text-white'}`}
                >
                  Contact
                </Link>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="hidden xl:flex items-center space-x-3 flex-shrink-0">
              {/* Partner Buttons - Hidden on smaller xl screens */}
              {!user && (
                <div className="hidden 2xl:flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handlePartnerSponsor}
                    className="px-4 py-2 bg-[#30d9fe] text-[#03325a] text-sm font-medium rounded-lg hover:bg-[#eec262] transition-all duration-300 whitespace-nowrap"
                  >
                    Partner as Sponsor
                  </button>
                  <button
                    type="button"
                    onClick={handleEducationPartner}
                    className="px-4 py-2 border-2 border-[#30d9fe] text-white text-sm font-medium rounded-lg hover:bg-[#30d9fe] hover:text-[#03325a] transition-all duration-300 whitespace-nowrap"
                  >
                    Education Partner
                  </button>
                </div>
              )}

              {/* User Profile / Auth Buttons */}
              {user ? (
                <div className="relative user-dropdown">
                  <button
                    onClick={toggleUserDropdown}
                    className="flex items-center space-x-2 px-3 py-2 border-2 border-[#30d9fe] text-white font-medium rounded-lg hover:bg-[#30d9fe] hover:text-[#03325a] transition-all duration-300"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#30d9fe] to-[#eec262] flex items-center justify-center text-[#03325a] font-bold text-xs overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        getInitials(user)
                      )}
                    </div>
                    <span className="text-sm hidden 2xl:inline max-w-[120px] truncate">
                      {user.first_name || user.username}
                    </span>
                    <i className={`fas fa-chevron-down text-xs transition-transform duration-300 ${isUserDropdownOpen ? 'rotate-180' : ''}`}></i>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-800">{user.first_name} {user.last_name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        {user.role && (
                          <span className="inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full bg-[#30d9fe] text-[#03325a]">
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        )}
                      </div>

                      {/* Dashboard Link - Role Based */}
                      {user.role === 'admin' ? (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 transition-colors duration-200"
                        >
                          <i className="fas fa-crown mr-2"></i>
                          Admin Dashboard
                        </Link>
                      ) : user.role === 'mentor' ? (
                        <Link
                          to="/mentor-dashboard"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-teal-600 hover:bg-teal-50 transition-colors duration-200"
                        >
                          <i className="fas fa-chalkboard-teacher mr-2"></i>
                          Mentor Dashboard
                        </Link>
                      ) : (
                        <Link
                          to="/learner-dashboard"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-green-600 hover:bg-green-50 transition-colors duration-200"
                        >
                          <i className="fas fa-graduation-cap mr-2"></i>
                          My Dashboard
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <i className="fas fa-user mr-2"></i>
                        Profile
                      </Link>

                      <div className="border-t border-gray-200 my-1"></div>

                      <button
                        onClick={handleLogoutClick}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <i className="fas fa-sign-out-alt mr-2"></i>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openLoginModal()}
                    className="px-4 py-2 text-white text-sm font-medium rounded-lg hover:text-[#30d9fe] transition-all duration-300"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => openSignupModal()}
                    className="px-4 py-2 bg-[#30d9fe] text-[#03325a] text-sm font-medium rounded-lg hover:bg-[#eec262] transition-all duration-300"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Hamburger Menu (Mobile/Tablet) - Shown below xl */}
            <div className="xl:hidden flex-shrink-0">
              <button
                onClick={toggleMenu}
                className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Toggle menu"
              >
                <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
              </button>
            </div>
          </div>

          {/* Mobile/Tablet Menu */}
          <div className={`xl:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
            <div className="flex flex-col space-y-1 pb-4">
              {/* Navigation Links */}
              <Link
                to="/"
                onClick={() => { setActiveTab('home'); setIsMenuOpen(false); }}
                className={`block px-4 py-3 rounded-lg transition-colors ${activeTab === 'home' ? 'bg-[#30d9fe] text-[#03325a]' : 'text-white hover:bg-white/10'}`}
              >
                <i className="fas fa-home mr-3 w-5"></i>Home
              </Link>
              <Link
                to="/programs"
                onClick={() => { setActiveTab('programs'); setIsMenuOpen(false); }}
                className={`block px-4 py-3 rounded-lg transition-colors ${activeTab === 'programs' ? 'bg-[#30d9fe] text-[#03325a]' : 'text-white hover:bg-white/10'}`}
              >
                <i className="fas fa-code mr-3 w-5"></i>Programs
              </Link>
              <Link
                to="/events"
                onClick={() => { setActiveTab('events'); setIsMenuOpen(false); }}
                className={`block px-4 py-3 rounded-lg transition-colors ${activeTab === 'events' ? 'bg-[#30d9fe] text-[#03325a]' : 'text-white hover:bg-white/10'}`}
              >
                <i className="fas fa-calendar mr-3 w-5"></i>Events
              </Link>
              <Link
                to="/about"
                onClick={() => { setActiveTab('about'); setIsMenuOpen(false); }}
                className={`block px-4 py-3 rounded-lg transition-colors ${activeTab === 'about' ? 'bg-[#30d9fe] text-[#03325a]' : 'text-white hover:bg-white/10'}`}
              >
                <i className="fas fa-info-circle mr-3 w-5"></i>About Us
              </Link>
              <Link
                to="/contact"
                onClick={() => { setActiveTab('contact'); setIsMenuOpen(false); }}
                className={`block px-4 py-3 rounded-lg transition-colors ${activeTab === 'contact' ? 'bg-[#30d9fe] text-[#03325a]' : 'text-white hover:bg-white/10'}`}
              >
                <i className="fas fa-envelope mr-3 w-5"></i>Contact
              </Link>

              {/* Divider and Partner Buttons in Mobile */}
              {!user && (
                <>
                  <div className="border-t border-white/20 my-2"></div>
                  <button
                    type="button"
                    onClick={() => { handlePartnerSponsor(); setIsMenuOpen(false); }}
                    className="block px-4 py-3 text-left text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <i className="fas fa-handshake mr-3 w-5"></i>Partner as Sponsor
                  </button>
                  <button
                    type="button"
                    onClick={() => { handleEducationPartner(); setIsMenuOpen(false); }}
                    className="block px-4 py-3 text-left text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <i className="fas fa-university mr-3 w-5"></i>Education Partner
                  </button>
                </>
              )}

              {/* Divider */}
              <div className="border-t border-white/20 my-2"></div>

              {/* Auth / User Section */}
              {user ? (
                <>
                  <div className="px-4 py-3 flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#30d9fe] to-[#eec262] flex items-center justify-center text-[#03325a] font-bold text-sm overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        getInitials(user)
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.first_name || user.username}</p>
                      <p className="text-gray-400 text-xs">{user.email}</p>
                    </div>
                  </div>

                  {user.role === 'admin' ? (
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 text-purple-400 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <i className="fas fa-crown mr-3 w-5"></i>Admin Dashboard
                    </Link>
                  ) : user.role === 'mentor' ? (
                    <Link
                      to="/mentor-dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 text-teal-400 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <i className="fas fa-chalkboard-teacher mr-3 w-5"></i>Mentor Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/learner-dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 text-green-400 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <i className="fas fa-graduation-cap mr-3 w-5"></i>My Dashboard
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <i className="fas fa-user mr-3 w-5"></i>Profile
                  </Link>

                  <button
                    onClick={handleLogoutClick}
                    className="block w-full text-left px-4 py-3 text-red-400 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <i className="fas fa-sign-out-alt mr-3 w-5"></i>Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 px-4 py-2">
                  <button
                    onClick={() => { openLoginModal(); setIsMenuOpen(false); }}
                    className="w-full py-3 text-white font-medium rounded-lg border-2 border-white/30 hover:bg-white/10 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { openSignupModal(); setIsMenuOpen(false); }}
                    className="w-full py-3 bg-[#30d9fe] text-[#03325a] font-medium rounded-lg hover:bg-[#eec262] transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden">{children}</main>
      {/* Footer */}
      <footer className="bg-[#03325a] text-white py-8 xs:py-10 sm:py-12 mt-auto w-full safe-area-inset">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-6 xs:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link to="/" aria-label="Home">
                <img src={logo} alt="Code2Deploy Logo" className="h-7 xs:h-8 w-auto sm:h-10 md:h-12 max-w-[100px] xs:max-w-[120px] sm:max-w-[140px] mb-3 xs:mb-4" />
              </Link>
              <p className="mb-4 text-sm sm:text-base">Empowering African youth with the skills to build and deploy technology solutions.</p>
              <div className="flex space-x-4">
                <a href="https://twitter.com/code2deploy" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#30d9fe] focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-colors duration-300 cursor-pointer">
                  <i className="text-xl fab fa-twitter"></i>
                </a>
                <a href="https://facebook.com/code2deploy" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#30d9fe] focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-colors duration-300 cursor-pointer">
                  <i className="text-xl fab fa-facebook"></i>
                </a>
                <a href="https://instagram.com/code2deploy" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#30d9fe] focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-colors duration-300 cursor-pointer">
                  <i className="text-xl fab fa-instagram"></i>
                </a>
                <a href="https://linkedin.com/company/code2deploy" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#30d9fe] focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-colors duration-300 cursor-pointer">
                  <i className="text-xl fab fa-linkedin"></i>
                </a>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-base sm:text-lg font-bold">Programs</h3>
              <ul className="space-y-2">
                <li><Link to="/programs" className="hover:text-[#30d9fe] focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-colors duration-300 cursor-pointer">Web Development</Link></li>
                <li><Link to="/programs" className="hover:text-[#30d9fe] focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-colors duration-300 cursor-pointer">Data Science</Link></li>
                <li><Link to="/programs" className="hover:text-[#30d9fe] focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-colors duration-300 cursor-pointer">Mobile Development</Link></li>
                <li><Link to="/programs" className="hover:text-[#30d9fe] focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-colors duration-300 cursor-pointer">AI & Machine Learning</Link></li>
                <li><Link to="/programs" className="hover:text-[#30d9fe] focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-colors duration-300 cursor-pointer">Cloud Computing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-base sm:text-lg font-bold">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-[#30d9fe] focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-colors duration-300 cursor-pointer">About Us</Link></li>
                <li><Link to="/about" className="hover:text-[#30d9fe] focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-colors duration-300 cursor-pointer">Our Team</Link></li>
                <li><Link to="/contact" className="hover:text-[#30d9fe] focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-colors duration-300 cursor-pointer">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-[#30d9fe] focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-colors duration-300 cursor-pointer">Partners</Link></li>
                <li><Link to="/about" className="hover:text-[#30d9fe] focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-colors duration-300 cursor-pointer">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-base sm:text-lg font-bold">Contact</h3>
              <ul className="space-y-2 text-sm sm:text-base">
                <li className="flex items-start">
                  <i className="fas fa-map-marker-alt mt-1 mr-2 text-[#30d9fe]"></i>
                  <span>233 Tech Hub Innovation Street, Nairobi, Kenya</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-envelope mt-1 mr-2 text-[#30d9fe]"></i>
                  <span>info@code2deploy.com</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-phone mt-1 mr-2 text-[#30d9fe]"></i>
                  <span>+254 743 864 7890</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between pt-6 mt-10 border-t border-gray-700 md:flex-row">
            <p className="text-xs sm:text-sm">&copy; 2025 Code2Deploy. All rights reserved.</p>
            <div className="flex mt-4 space-x-6 md:mt-0">
              <Link to="/contact" className="hover:text-[#30d9fe] focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-colors duration-300 cursor-pointer text-xs sm:text-sm">Privacy Policy</Link>
              <Link to="/contact" className="hover:text-[#30d9fe] focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-colors duration-300 cursor-pointer text-xs sm:text-sm">Terms of Service</Link>
              <Link to="/contact" className="hover:text-[#30d9fe] focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-colors duration-300 cursor-pointer text-xs sm:text-sm">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeModals}
        onLoginSuccess={login}
        onForgotPassword={openForgotPasswordModal}
        onSignup={openSignupModal}
      />

      {/* Signup Modal */}
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={closeModals}
        onSignupSuccess={signup}
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        onClose={closeModals}
      />

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div >
  );
};

export default Layout;
