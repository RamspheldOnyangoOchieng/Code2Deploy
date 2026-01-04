import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo2-clear.png';
import authService from '../services/authService';
import SignupModal from './SignupModal';
import LoginModal from './LoginModal';
import ForgotPasswordModal from './ForgotPasswordModal';

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      authService.getCurrentUser().then(setUser).catch(console.error);
    }
  }, []);

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
  }, [location]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/');
  };

  const handlePartnerSponsor = () => {
    // Navigate to contact page with sponsor parameter
    navigate('/contact?type=sponsor');
  };

  const handleEducationPartner = () => {
    // Navigate to contact page with education partner parameter
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
    <div className="min-h-screen font-sans text-gray-800 bg-white flex flex-col">
      {/* Navigation */}
      <nav className="bg-gradient-to-b from-[#0A0F2C] to-[#0A0F2C] sticky top-0 z-50 text-white w-full" aria-label="Main Navigation">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between w-full">
            {/* Logo - Far Left */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="flex items-center" aria-label="Home">
                <img src={logo} alt="Code2Deploy Logo" className="h-10 sm:h-12 w-auto" />
              </Link>
            </div>
            
            {/* Navigation Links - Centered with better spacing */}
            <div className="hidden lg:flex items-center justify-center flex-1 space-x-8 xl:space-x-12 mx-8">
              <Link to="/" className={`text-base font-medium hover:text-[#30d9fe] focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-colors duration-300 ${activeTab === 'home' ? 'text-[#30d9fe]' : 'text-white'} cursor-pointer whitespace-nowrap`}>Home</Link>
              <Link to="/programs" className={`text-base font-medium hover:text-[#30d9fe] focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-colors duration-300 ${activeTab === 'programs' ? 'text-[#30d9fe]' : 'text-white'} cursor-pointer whitespace-nowrap`}>Programs</Link>
              <Link to="/events" className={`text-base font-medium hover:text-[#30d9fe] focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-colors duration-300 ${activeTab === 'events' ? 'text-[#30d9fe]' : 'text-white'} cursor-pointer whitespace-nowrap`}>Events</Link>
              <Link to="/about" className={`text-base font-medium hover:text-[#30d9fe] focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-colors duration-300 ${activeTab === 'about' ? 'text-[#30d9fe]' : 'text-white'} cursor-pointer whitespace-nowrap`}>About Us</Link>
              <Link to="/contact" className={`text-base font-medium hover:text-[#30d9fe] focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-colors duration-300 ${activeTab === 'contact' ? 'text-[#30d9fe]' : 'text-white'} cursor-pointer whitespace-nowrap`}>Contact</Link>
            </div>
            
            {/* Right Side - Partner Buttons & User Profile - Far Right */}
            <div className="items-center hidden lg:flex space-x-3 flex-shrink-0">
              <button 
                onClick={handlePartnerSponsor}
                className="px-4 py-2 bg-[#30d9fe] text-[#03325a] font-medium rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-all duration-300 cursor-pointer whitespace-nowrap text-sm"
              >
                Partner as Sponsor
              </button>
              <button 
                onClick={handleEducationPartner}
                className="px-4 py-2 border-2 border-[#30d9fe] text-white font-medium rounded-lg hover:bg-[#30d9fe] hover:text-[#03325a] focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-all duration-300 cursor-pointer whitespace-nowrap text-sm"
              >
                Education & Training Partner
              </button>
              
              {/* User Profile Dropdown */}
              {user ? (
                <div className="relative user-dropdown">
                  <button
                    onClick={toggleUserDropdown}
                    className="flex items-center space-x-2 px-4 py-2 border-2 border-[#30d9fe] text-white font-medium rounded-lg hover:bg-[#30d9fe] hover:text-[#03325a] focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-all duration-300 cursor-pointer whitespace-nowrap text-sm"
                  >
                    <span className="text-sm">Welcome, {user.first_name || user.username}!</span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#30d9fe] to-[#eec262] flex items-center justify-center text-[#03325a] font-bold text-xs">
                      {getInitials(user)}
                    </div>
                    <i className={`fas fa-chevron-down text-xs transition-transform duration-300 ${isUserDropdownOpen ? 'rotate-180' : ''}`}></i>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-800">{user.first_name} {user.last_name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        {user.role && (
                          <span className="inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full bg-[#30d9fe] text-[#03325a]">
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        )}
                      </div>
                      
                      <Link
                        to="/profile"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <i className="fas fa-user mr-2"></i>
                        Profile
                      </Link>
                      
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 transition-colors duration-200"
                        >
                          <i className="fas fa-crown mr-2"></i>
                          Admin Dashboard
                        </Link>
                      )}
                      
                      <div className="border-t border-gray-200 my-1"></div>
                      
                      <button
                        onClick={() => { handleLogout(); setIsUserDropdownOpen(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <i className="fas fa-sign-out-alt mr-2"></i>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2 ml-2">
                  <button 
                    onClick={() => setIsLoginModalOpen(true)}
                    className="px-4 py-2 text-white font-medium rounded-lg hover:text-[#30d9fe] focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-all duration-300 cursor-pointer whitespace-nowrap"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => setIsSignupModalOpen(true)}
                    className="px-4 py-2 bg-[#30d9fe] text-[#03325a] font-medium rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-all duration-300 cursor-pointer whitespace-nowrap"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
            
            {/* Hamburger (mobile) */}
            <div className="lg:hidden">
              <button onClick={toggleMenu} className="text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#30d9fe]">
                <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
              </button>
            </div>
          </div>
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="pb-4 mt-4 lg:hidden">
              <div className="flex flex-col space-y-4">
                <Link to="/" onClick={() => { setActiveTab('home'); setIsMenuOpen(false); }} className={`hover:text-[#30d9fe] focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-colors duration-300 ${activeTab === 'home' ? 'text-[#30d9fe]' : ''} cursor-pointer`}>Home</Link>
                <Link to="/programs" onClick={() => { setActiveTab('programs'); setIsMenuOpen(false); }} className={`hover:text-[#30d9fe] focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-colors duration-300 ${activeTab === 'programs' ? 'text-[#30d9fe]' : ''} cursor-pointer`}>Programs</Link>
                <Link to="/events" onClick={() => { setActiveTab('events'); setIsMenuOpen(false); }} className={`hover:text-[#30d9fe] focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-colors duration-300 ${activeTab === 'events' ? 'text-[#30d9fe]' : ''} cursor-pointer`}>Events</Link>
                <Link to="/about" onClick={() => { setActiveTab('about'); setIsMenuOpen(false); }} className={`hover:text-[#30d9fe] focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-colors duration-300 ${activeTab === 'about' ? 'text-[#30d9fe]' : ''} cursor-pointer`}>About Us</Link>
                <Link to="/contact" onClick={() => { setActiveTab('contact'); setIsMenuOpen(false); }} className={`hover:text-[#30d9fe] focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-colors duration-300 ${activeTab === 'contact' ? 'text-[#30d9fe]' : ''} cursor-pointer`}>Contact</Link>
                {/* Mobile Auth Buttons */}
                <div className="flex flex-col pt-2 space-y-2">
                  {user ? (
                    <>
                      <span className="text-sm text-gray-300">Welcome, {user.first_name || user.username}!</span>
                      {user.role === 'admin' && (
                        <Link 
                          to="/admin"
                          onClick={() => setIsMenuOpen(false)}
                          className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-all duration-300 cursor-pointer"
                        >
                          Admin
                        </Link>
                      )}
                      <Link 
                        to="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="px-4 py-2 text-white font-medium rounded-lg hover:text-[#30d9fe] focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-all duration-300 cursor-pointer"
                      >
                        Profile
                      </Link>
                      <button 
                        onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                        className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-all duration-300 cursor-pointer"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => { setIsLoginModalOpen(true); setIsMenuOpen(false); }}
                        className="px-4 py-2 text-white font-medium rounded-lg hover:text-[#30d9fe] focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-all duration-300 cursor-pointer"
                      >
                        Login
                      </button>
                      <button 
                        onClick={() => { setIsSignupModalOpen(true); setIsMenuOpen(false); }}
                        className="px-4 py-2 bg-[#30d9fe] text-[#03325a] font-medium rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-all duration-300 cursor-pointer"
                      >
                        Sign Up
                      </button>
                    </>
                  )}
                </div>
                <div className="flex flex-col pt-2 space-y-2">
                  <button 
                    onClick={() => { handlePartnerSponsor(); setIsMenuOpen(false); }}
                    className="px-4 py-2 bg-[#30d9fe] text-[#03325a] font-medium rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-all duration-300 !rounded-button cursor-pointer whitespace-nowrap text-sm"
                  >
                    Partner as Sponsor
                  </button>
                  <button 
                    onClick={() => { handleEducationPartner(); setIsMenuOpen(false); }}
                    className="px-4 py-2 border-2 border-[#30d9fe] text-white font-medium rounded-lg hover:bg-[#30d9fe] hover:text-[#03325a] focus:outline-none focus:ring-2 focus:ring-[#30d9fe] transition-all duration-300 !rounded-button cursor-pointer whitespace-nowrap text-sm"
                  >
                    Education & Training Partner
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      <main className="flex-1 w-full">{children}</main>
      {/* Footer */}
      <footer className="bg-[#03325a] text-white py-10 sm:py-12 mt-auto w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link to="/" aria-label="Home">
                <img src={logo} alt="Code2Deploy Logo" className="h-8 w-auto sm:h-10 md:h-12 max-w-[120px] sm:max-w-[140px] mb-4" />
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
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onForgotPassword={() => {
          setIsLoginModalOpen(false);
          setIsForgotPasswordModalOpen(true);
        }}
      />

      {/* Signup Modal */}
      <SignupModal 
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onSignupSuccess={handleSignupSuccess}
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal 
        isOpen={isForgotPasswordModalOpen}
        onClose={() => setIsForgotPasswordModalOpen(false)}
      />
    </div>
  );
};

export default Layout;
