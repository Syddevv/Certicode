const API_URL = 'http://127.0.0.1:8000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {

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

  async sendRegistrationOtp(email) {
    const response = await fetch(`${API_URL}/register/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send OTP');
    }

    return data;
  },

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
    
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_id', data.user.id);
      localStorage.setItem('user_role', data.user.role);
      localStorage.setItem('user_name', data.user.name || '');
      
      return data;
    }
    
    return data;
  },

  async verifyAdminMfaLogin(payload) {
    const response = await fetch(`${API_URL}/mfa/verify-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'MFA verification failed');
    }

    if (data.token && data.user) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_id', data.user.id);
      localStorage.setItem('user_role', data.user.role);
      localStorage.setItem('user_name', data.user.name || '');
    }

    return data;
  },

  async verifyMfaLogin(payload) {
    return this.verifyAdminMfaLogin(payload);
  },

  async googleRedirect() {
    window.location.href = `${API_URL}/auth/google`;
  },

  async facebookRedirect() {
    window.location.href = `${API_URL}/auth/facebook`;
  },

  async logout() {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      try {
        await fetch(`${API_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    
    window.location.href = '/login';
  },

  async request(url, options = {}) {
    const headers = getAuthHeaders();
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });
    
    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_name');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
    
    return response;
  },

  async validateToken() {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;
    
    try {
      const response = await fetch(`${API_URL}/validate-token`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      if (response.status === 401) {
        this.clearAuthData();
        return false;
      }
      
      return response.ok;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  },

  // Clear all auth data
  clearAuthData() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
  },

  // Enhanced request method with token expiration handling
  async request(url, options = {}) {
    const headers = getAuthHeaders();
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });
    
    // Handle token expiration (401 Unauthorized)
    if (response.status === 401) {
      this.clearAuthData();
      window.location.href = '/login?error=Session expired. Please login again.';
      throw new Error('Session expired');
    }
    
    return response;
  },

  // Logout function
  async logout() {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      try {
        await fetch(`${API_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    this.clearAuthData();
  },

  async getProducts(search = "", assetType = "", page = 1, sortOrder = "newest") {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (assetType) params.append('asset_type', assetType);
    params.append('page', page);
    params.append('sort', sortOrder);
    
    const url = `${API_URL}/products?${params.toString()}`;
      
    const response = await fetch(url, {
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

  async getProductById(id) {
    console.log(`Fetching product with ID: ${id}`);
    
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Raw response data:', data);
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch product');
    }
    
    if (data.success && data.data) {
      console.log('Returning data.data:', data.data);
      return data.data;
    }
    
    console.log('Returning raw data:', data);
    return data;
  },
};
