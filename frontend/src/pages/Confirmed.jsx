import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import LoginModal from '../components/LoginModal';

const Confirmed = () => {
  const [searchParams] = useSearchParams();
  const [showLogin, setShowLogin] = useState(false);
  const [status, setStatus] = useState('success');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Handle query params from backend redirect
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    
    if (success === 'false') {
      setStatus('error');
      if (error === 'invalid_token') {
        setErrorMessage('The confirmation link is invalid or has expired. Please request a new confirmation email.');
      } else {
        setErrorMessage('Email confirmation failed. Please try again.');
      }
    }
  }, [searchParams]);

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#03325a] to-[#0a4a7a] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-7xl mb-6">❌</div>
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Confirmation Failed
          </h1>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#03325a] to-[#0a4a7a] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="text-7xl mb-6">✅</div>
        <h1 className="text-3xl font-bold text-[#03325a] mb-4">
          Email Confirmed!
        </h1>
        <p className="text-gray-600 mb-6">
          Your account has been successfully activated. You can now log in to access all features of Code2Deploy.
        </p>
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

export default Confirmed;
