class AuthService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken() {
    return this.token;
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async register(userData) {
    try {
      const response = await fetch(`${this.baseURL}/auth/register/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        // Handle field-specific validation errors from DRF
        if (typeof errorData === 'object' && !errorData.detail) {
          const errorMessages = Object.entries(errorData)
            .map(([field, messages]) => {
              const msgArray = Array.isArray(messages) ? messages : [messages];
              return `${field}: ${msgArray.join(', ')}`;
            })
            .join('; ');
          throw new Error(errorMessages || 'Registration failed');
        }
        throw new Error(errorData.detail || 'Registration failed');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Alias for register method
  async signup(userData) {
    return this.register(userData);
  }

  async login(credentials) {
    try {
      // Clear any old token before attempting login
      this.removeToken();
      
      const response = await fetch(`${this.baseURL}/auth/jwt/create/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }
      
      const data = await response.json();
      this.setToken(data.access);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    this.removeToken();
  }

  async getCurrentUser() {
    try {
      const response = await fetch(`${this.baseURL}/auth/me/`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get user profile');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await fetch(`${this.baseURL}/auth/me/`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Profile update failed');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async uploadAvatar(file) {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const headers = {};
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const response = await fetch(`${this.baseURL}/auth/me/`, {
        method: 'PATCH',
        headers: headers,
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Avatar upload failed');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getUserEnrollments() {
    try {
      const response = await fetch(`${this.baseURL}/auth/me/programs/`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get enrollments');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getUserEventRegistrations() {
    try {
      const response = await fetch(`${this.baseURL}/auth/me/events/`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get event registrations');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getUserCertificates() {
    try {
      const response = await fetch(`${this.baseURL}/certificates/me/certificates/`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get certificates');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getUserBadges() {
    try {
      const response = await fetch(`${this.baseURL}/certificates/me/badges/`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get badges');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getUserNotifications() {
    try {
      const response = await fetch(`${this.baseURL}/notifications/me/`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get notifications');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async enrollInProgram(programId) {
    try {
      const response = await fetch(`${this.baseURL}/enroll/${programId}/`, {
        method: 'POST',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Enrollment failed');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async registerForEvent(eventId) {
    try {
      const response = await fetch(`${this.baseURL}/register/${eventId}/`, {
        method: 'POST',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Event registration failed');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async requestPasswordReset(email) {
    try {
      const response = await fetch(`${this.baseURL}/auth/password/reset/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Password reset request failed');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async exportUserData() {
    try {
      const response = await fetch(`${this.baseURL}/auth/me/export/`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to export user data');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async deleteAccount(password, confirmationText) {
    try {
      const response = await fetch(`${this.baseURL}/auth/me/delete/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ password, confirmation_text: confirmationText }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Account deletion failed');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  isAuthenticated() {
    return !!this.token;
  }
}

export default new AuthService(); 