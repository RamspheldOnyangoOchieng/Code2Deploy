// API Configuration
// This file provides the base API URL from environment variables

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// Log the API URL being used (helps debug deployment issues)
if (typeof window !== 'undefined') {
  console.log('API Base URL:', API_BASE_URL);
}

export default API_BASE_URL;
