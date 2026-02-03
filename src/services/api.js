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
      if (data.user && data.user.id) {
        window.location.href = `/marketplace?id=${data.user.id}`;
      } else {
        window.location.href = '/marketplace';
      }
    }
    
    return data;
  },

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
    
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      if (data.user && data.user.id) {
        window.location.href = `/marketplace?id=${data.user.id}`;
      } else {
        window.location.href = '/marketplace';
      }
    }
    
    return data;
  },

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
    
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      if (data.user && data.user.id) {
        window.location.href = `/marketplace?id=${data.user.id}`;
      } else {
        window.location.href = '/marketplace';
      }
    }
    
    return data;
  },

  async getProducts(search = "", assetType = "", page = 1) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (assetType) params.append('asset_type', assetType);
    params.append('page', page);
    
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