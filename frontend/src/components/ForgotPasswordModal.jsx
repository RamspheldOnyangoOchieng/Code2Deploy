import { useState } from 'react';
import AuthService from '../services/authService';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetUrl, setResetUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setResetUrl('');
    setLoading(true);

    try {
      const response = await AuthService.requestPasswordReset(email);
      setMessage(response.detail || 'Password reset link sent! Please check your email.');
      
      // If in development mode, show the reset URL
      if (response.reset_url) {
        setResetUrl(response.reset_url);
      }
      
      setEmail('');
      
      // Only auto close if no reset URL to show
      if (!response.reset_url) {
        setTimeout(() => {
          onClose();
          setMessage('');
        }, 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <p className="text-gray-600 mb-4">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {message}
              {resetUrl && (
                <div className="mt-3">
                  <p className="font-bold text-sm mb-2">Development Mode - Click link below:</p>
                  <a 
                    href={resetUrl} 
                    className="text-blue-600 hover:underline break-all text-xs"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {resetUrl}
                  </a>
                </div>
              )}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ color: '#111827', backgroundColor: '#ffffff' }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#30d9fe] text-[#03325a] font-bold py-2 px-4 rounded-md hover:bg-opacity-90 transition-all duration-300 disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm"
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
