const API_URL = 'http://127.0.0.1:8000/api';

export const api = {

  // Registration
  async register(userData) {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    return data;
  },

  // Login
  async login(credentials) {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    return data;
  },

  // Google OAuth methods
  async googleRedirect() {
    window.location.href = `${API_URL}/auth/google`;
  },

  async handleGoogleCallback(code) {
    const response = await fetch(`${API_URL}/auth/google/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ code })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Google login failed');
    }
    
    return data;
  },

  // Facebook OAuth methods
  async facebookRedirect() {
    window.location.href = `${API_URL}/auth/facebook`;
  },

  async handleFacebookCallback(code) {
    const response = await fetch(`${API_URL}/auth/facebook/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ code })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Facebook login failed');
    }
    
    return data;
  },

  async getProducts() {
    const response = await fetch(`${API_URL}/products`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch products');
    }
    
    return data;
  },

};