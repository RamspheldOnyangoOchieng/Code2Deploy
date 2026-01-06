import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AuthService from '../services/authService';
import LoginModal from '../components/LoginModal';

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error', 'already_confirmed'
  const [message, setMessage] = useState('');
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const confirmEmail = async () => {
      const uid = searchParams.get('uid');
      const token = searchParams.get('token');

      if (!uid || !token) {
        setStatus('error');
        setMessage('Invalid confirmation link. Please request a new confirmation email.');
        return;
      }

      try {
        const response = await AuthService.confirmEmail(uid, token);
        
        if (response.already_confirmed) {
          setStatus('already_confirmed');
          setMessage(response.detail || 'Your email has already been confirmed.');
        } else {
          setStatus('success');
          setMessage(response.detail || '🎉 Email confirmed successfully! You can now log in.');
        }
      } catch (error) {
        setStatus('error');
        setMessage(error.message || 'Email confirmation failed. The link may be expired or invalid.');
      }
    };

    confirmEmail();
  }, [searchParams]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            <div className="animate-spin text-7xl mb-6">⏳</div>
            <h1 className="text-3xl font-bold text-[#03325a] mb-4">
              Confirming Your Email...
            </h1>
            <p className="text-gray-600 mb-6">
              Please wait while we verify your email address.
            </p>
          </>
        );

      case 'success':
        return (
          <>
            <div className="text-7xl mb-6">✅</div>
            <h1 className="text-3xl font-bold text-[#03325a] mb-4">
              Email Confirmed!
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-4">
              <button
                onClick={() => setShowLogin(true)}
                className="w-full bg-[#30d9fe] text-[#03325a] font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-300 shadow-lg"
              >
                Log In Now
              </button>
              <Link
                to="/"
                className="block w-full bg-transparent border-2 border-[#03325a] text-[#03325a] font-bold py-3 px-6 rounded-lg hover:bg-[#03325a] hover:text-white transition-all duration-300"
              >
                Go to Home
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              Welcome to the Code2Deploy community! 🚀
            </p>
          </>
        );

      case 'already_confirmed':
        return (
          <>
            <div className="text-7xl mb-6">✓</div>
            <h1 className="text-3xl font-bold text-[#03325a] mb-4">
              Already Confirmed
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-4">
              <button
                onClick={() => setShowLogin(true)}
                className="w-full bg-[#30d9fe] text-[#03325a] font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-300 shadow-lg"
              >
                Log In
              </button>
              <Link
                to="/"
                className="block w-full bg-transparent border-2 border-[#03325a] text-[#03325a] font-bold py-3 px-6 rounded-lg hover:bg-[#03325a] hover:text-white transition-all duration-300"
              >
                Go to Home
              </Link>
            </div>
          </>
        );

      case 'error':
        return (
          <>
            <div className="text-7xl mb-6">❌</div>
            <h1 className="text-3xl font-bold text-red-600 mb-4">
              Confirmation Failed
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-4">
              <Link
                to="/"
                className="block w-full bg-[#30d9fe] text-[#03325a] font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-300 shadow-lg"
              >
                Go to Home
              </Link>
              <p className="text-sm text-gray-500">
                Need help? Contact us at{' '}
                <a href="mailto:support@code2deploy.tech" className="text-[#30d9fe] hover:underline">
                  support@code2deploy.tech
                </a>
              </p>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#03325a] to-[#0a4a7a] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        {renderContent()}
      </div>

      {/* Login Modal */}
      {showLogin && (
        <LoginModal
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onLoginSuccess={() => {
            setShowLogin(false);
            window.location.href = '/';
          }}
        />
      )}
    </div>
  );
};

export default ConfirmEmail;
