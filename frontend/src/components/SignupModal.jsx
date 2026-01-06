import { useState } from 'react';
import AuthService from '../services/authService';

const SignupModal = ({ isOpen, onClose, onSignupSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    re_password: '',
    first_name: '',
    last_name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showResendOption, setShowResendOption] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleResendConfirmation = async () => {
    if (!registeredEmail) return;
    
    setResendLoading(true);
    setResendMessage('');
    
    try {
      const response = await AuthService.resendConfirmationEmail(registeredEmail);
      setResendMessage(response.detail || 'Confirmation email sent! Check your inbox.');
    } catch (error) {
      setResendMessage(error.message || 'Failed to resend email. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.re_password) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // Validate required fields
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      setError('First name and last name are required');
      return;
    }

    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }

    setLoading(true);

    try {
      // Register the user
      const response = await AuthService.signup(formData);
      
      // Show success message - user needs to confirm email before logging in
      setSuccess(true);
      setSuccessMessage(response.detail || '🎉 Signup successful! Please check your email and click the confirmation link to activate your account.');
      setRegisteredEmail(formData.email);
      setShowResendOption(true);
      
      // Clear form
      setFormData({
        email: '',
        username: '',
        password: '',
        re_password: '',
        first_name: '',
        last_name: ''
      });
    } catch (error) {
      // Handle different types of errors
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setError('Network error. Please check your internet connection and try again.');
      } else if (error.message.includes('NetworkError')) {
        setError('Network error. Please check your internet connection and try again.');
      } else if (error.message.includes('email')) {
        setError('This email is already in use.');
      } else if (error.message.includes('username')) {
        setError('This username is already taken.');
      } else {
        setError(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setSuccessMessage('');
    setError('');
    setShowResendOption(false);
    setRegisteredEmail('');
    setResendMessage('');
    onClose();
  };

  if (!isOpen) return null;

  // Show success message after successful signup
  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
          <div className="text-center">
            <div className="text-6xl mb-4">📧</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Check Your Email!</h2>
            <p className="text-gray-600 mb-4">{successMessage}</p>
            <p className="text-sm text-gray-500 mb-6">
              Click the confirmation link in your email to activate your account, then you can log in.
            </p>
            
            {/* Resend confirmation email option */}
            {showResendOption && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-3">Didn't receive the email?</p>
                {resendMessage && (
                  <p className={`text-sm mb-3 ${resendMessage.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
                    {resendMessage}
                  </p>
                )}
                <button
                  onClick={handleResendConfirmation}
                  disabled={resendLoading}
                  className="text-[#30d9fe] hover:text-[#03325a] font-medium text-sm disabled:opacity-50"
                >
                  {resendLoading ? 'Sending...' : 'Resend confirmation email'}
                </button>
              </div>
            )}
            
            <button
              onClick={handleClose}
              className="w-full bg-[#30d9fe] text-[#03325a] font-medium py-2 px-4 rounded-md hover:bg-opacity-90 transition-all duration-300"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Sign Up</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent"
                placeholder="First name"
              />
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent"
                placeholder="Last name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={{ color: '#111827', backgroundColor: '#ffffff' }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent"
              placeholder="Choose a username"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ color: '#111827', backgroundColor: '#ffffff' }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ color: '#111827', backgroundColor: '#ffffff' }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent"
              placeholder="Enter your password"
            />
            <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
          </div>

          <div>
            <label htmlFor="re_password" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="re_password"
              name="re_password"
              value={formData.re_password}
              onChange={handleChange}
              required
              style={{ color: '#111827', backgroundColor: '#ffffff' }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#30d9fe] text-[#03325a] font-medium py-2 px-4 rounded-md hover:bg-opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupModal; 