import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../services/authService';
import { useToast } from '../contexts/ToastContext';

const LoginModal = ({ isOpen, onClose, onLoginSuccess, onForgotPassword, onSignup }) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Login and get tokens
      await AuthService.login({ username: formData.username, password: formData.password });

      // Get user profile to check role
      const user = await AuthService.getCurrentUser();

      // Call the success callback if provided
      if (onLoginSuccess) onLoginSuccess(user);

      // Close the modal
      onClose();

      toast.success(`Welcome back, ${user.first_name || user.username}!`);

      // Redirect
      const redirectPath = new URLSearchParams(location.search).get('redirect');
      if (redirectPath) {
        navigate(redirectPath);
      } else {
        // Redirect based on user role
        if (user.role === 'admin') {
          navigate('/admin');
        } else if (user.role === 'mentor') {
          navigate('/mentor-dashboard');
        } else {
          navigate('/learner-dashboard');
        }
      }
    } catch (err) {
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const [mode, setMode] = useState('login'); // 'login' or 'resend'

  const handleResendSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await AuthService.resendConfirmation(formData.username); // Assuming username input holds email or we ask for email
      toast.success('Confirmation email sent! Please check your inbox.');
      setMode('login');
    } catch (err) {
      toast.error(err.message || 'Failed to send confirmation email');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === 'login' ? 'Login' : 'Resend Confirmation'}
          </h2>
          <button
            onClick={() => { onClose(); setMode('login'); }}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
                {error.includes('confirm your email') && (
                  <button
                    type="button"
                    onClick={() => setMode('resend')}
                    className="block mt-2 text-sm font-bold underline hover:text-red-900"
                  >
                    Resend Confirmation Email
                  </button>
                )}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username or User ID
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
                placeholder="Enter your username or user ID"
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
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setMode('resend')}
                className="text-sm text-gray-500 hover:text-[#30d9fe]"
              >
                Resend Confirmation?
              </button>
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-[#30d9fe] hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#30d9fe] text-[#03325a] font-bold py-2 px-4 rounded-md hover:bg-opacity-90 transition-all duration-300 disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="mt-4 text-center">
              <span className="text-gray-600 text-sm">Don't have an account? </span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onSignup) onSignup();
                }}
                className="text-[#30d9fe] hover:underline font-medium text-sm"
              >
                Sign Up
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResendSubmit} className="space-y-4">
            <p className="text-gray-600 text-sm mb-4">
              Enter your email address to receive a new confirmation link.
            </p>
            <div>
              <label htmlFor="resend-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="resend-email"
                name="username" // Reusing username field for email
                value={formData.username}
                onChange={handleChange}
                required
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent"
                placeholder="Enter your email address"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#30d9fe] text-[#03325a] font-bold py-2 px-4 rounded-md hover:bg-opacity-90 transition-all duration-300 disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Send Confirmation Link'}
            </button>

            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginModal; 