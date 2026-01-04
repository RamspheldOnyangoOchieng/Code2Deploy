class ApiService {
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

  // Programs API
  async getPrograms(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = queryParams ? `${this.baseURL}/programs/?${queryParams}` : `${this.baseURL}/programs/`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch programs');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getProgram(programId) {
    try {
      const response = await fetch(`${this.baseURL}/programs/${programId}/`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch program');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async enrollInProgram(programId) {
    try {
      const response = await fetch(`${this.baseURL}/programs/enroll/${programId}/`, {
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

  async getUserEnrollments(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = queryParams ? `${this.baseURL}/programs/user-enrollments/?${queryParams}` : `${this.baseURL}/programs/user-enrollments/`;
      
      const response = await fetch(url, {
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

  async getUserProgramStats() {
    try {
      const response = await fetch(`${this.baseURL}/programs/user-program-stats/`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get program stats');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Events API
  async getEvents(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = queryParams ? `${this.baseURL}/events/?${queryParams}` : `${this.baseURL}/events/`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getEvent(eventId) {
    try {
      const response = await fetch(`${this.baseURL}/events/${eventId}/`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch event');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async registerForEvent(eventId) {
    try {
      const response = await fetch(`${this.baseURL}/events/register/${eventId}/`, {
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

  async getUserEventRegistrations(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = queryParams ? `${this.baseURL}/events/user-registrations/?${queryParams}` : `${this.baseURL}/events/user-registrations/`;
      
      const response = await fetch(url, {
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

  async getUserEventStats() {
    try {
      const response = await fetch(`${this.baseURL}/events/user-event-stats/`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get event stats');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Certificates API
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

  async getCertificate(certificateId) {
    try {
      const response = await fetch(`${this.baseURL}/certificates/certificates/${certificateId}/`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get certificate');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getBadge(badgeId) {
    try {
      const response = await fetch(`${this.baseURL}/certificates/badges/${badgeId}/`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get badge');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Notifications API
  async getUserNotifications(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = queryParams ? `${this.baseURL}/notifications/me/?${queryParams}` : `${this.baseURL}/notifications/me/`;
      
      const response = await fetch(url, {
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

  async markNotificationAsRead(notificationId) {
    try {
      const response = await fetch(`${this.baseURL}/notifications/me/${notificationId}/mark-read/`, {
        method: 'POST',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async updateNotificationPreferences(preferences) {
    try {
      const response = await fetch(`${this.baseURL}/notifications/me/preferences/`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(preferences),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update notification preferences');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Mentors API
  async getMentors(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = queryParams ? `${this.baseURL}/mentors/?${queryParams}` : `${this.baseURL}/mentors/`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch mentors');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getMentor(mentorId) {
    try {
      const response = await fetch(`${this.baseURL}/mentors/${mentorId}/`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch mentor');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Applications API
  async submitApplication(applicationData) {
    try {
      const response = await fetch(`${this.baseURL}/applications/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(applicationData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Application submission failed');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getUserApplications() {
    try {
      const response = await fetch(`${this.baseURL}/applications/my-applications/`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get applications');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getApplication(applicationId) {
    try {
      const response = await fetch(`${this.baseURL}/applications/${applicationId}/`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get application');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Utility methods
  isAuthenticated() {
    return !!this.token;
  }

  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }
}

export default new ApiService(); 