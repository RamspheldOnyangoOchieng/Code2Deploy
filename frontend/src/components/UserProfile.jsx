import { useState } from 'react';
import AuthService from '../services/authService';
import LogoutModal from './LogoutModal';

const UserProfile = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    AuthService.logout();
    onLogout();
    setIsLogoutModalOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 text-white hover:text-[#30d9fe] transition-colors duration-300"
      >
        <div className="w-8 h-8 bg-[#30d9fe] rounded-full flex items-center justify-center">
          <span className="text-[#03325a] font-medium text-sm">
            {user.first_name ? user.first_name[0].toUpperCase() : user.username[0].toUpperCase()}
          </span>
        </div>
        <span className="hidden md:block text-sm">
          {user.first_name || user.username}
        </span>
        <i className={`fas fa-chevron-down text-xs transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-2 text-sm text-gray-700 border-b">
            <div className="font-medium">{user.first_name} {user.last_name}</div>
            <div className="text-gray-500">{user.email}</div>
          </div>
          <button
            onClick={handleLogoutClick}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
};

export default UserProfile; 