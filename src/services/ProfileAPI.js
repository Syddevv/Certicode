const API_URL = 'http://127.0.0.1:8000/api';

export const ProfileAPI = {
  getUserPurchases: async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw {
          response: { status: 401 },
          message: 'No authentication token found. Please log in.'
        };
      }
      
      const response = await fetch(`${API_URL}/profile/purchases`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const responseText = await response.text();
      
      if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
        throw {
          response: { status: response.status },
          message: 'Server error. Please try again.'
        };
      }

      const data = JSON.parse(responseText);
      
      if (!response.ok) {
        throw {
          response: {
            status: response.status,
            data: data
          },
          message: data.message || `Error ${response.status}`
        };
      }

      return data;
    } catch (error) {
      console.error('ProfileAPI - Error fetching purchases:', error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw {
          response: { status: 401 },
          message: 'No authentication token found. Please log in.'
        };
      }
      
      const response = await fetch(`${API_URL}/profile/current-user`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const responseText = await response.text();
      
      if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
        throw {
          response: { status: response.status },
          message: 'Server error. Please try again.'
        };
      }

      const data = JSON.parse(responseText);
      
      if (!response.ok) {
        throw {
          response: {
            status: response.status,
            data: data
          },
          message: data.message || `Error ${response.status}`
        };
      }

      return data.user || data;
    } catch (error) {
      console.error('ProfileAPI - Error fetching user:', error);
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw {
          response: { status: 401 },
          message: 'No authentication token found. Please log in.'
        };
      }
      
      const response = await fetch(`${API_URL}/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      const responseText = await response.text();
      
      if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
        throw {
          response: { status: response.status },
          message: 'Server error. Please try again.'
        };
      }

      const data = JSON.parse(responseText);
      
      if (!response.ok) {
        throw {
          response: {
            status: response.status,
            data: data
          },
          message: data.message || `Error ${response.status}`
        };
      }

      return data;
    } catch (error) {
      console.error('ProfileAPI - Error updating profile:', error);
      throw error;
    }
  },

  updatePassword: async (passwordData) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw {
          response: { status: 401 },
          message: 'No authentication token found. Please log in.'
        };
      }
      
      const response = await fetch(`${API_URL}/profile/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(passwordData)
      });

      const responseText = await response.text();
      
      if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
        throw {
          response: { status: response.status },
          message: 'Server error. Please try again.'
        };
      }

      const data = JSON.parse(responseText);
      
      if (!response.ok) {
        throw {
          response: {
            status: response.status,
            data: data
          },
          message: data.message || `Error ${response.status}`
        };
      }

      return data;
    } catch (error) {
      console.error('ProfileAPI - Error updating password:', error);
      throw error;
    }
  },

  deleteAccount: async (password) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw {
          response: { status: 401 },
          message: 'No authentication token found. Please log in.'
        };
      }
      
      const response = await fetch(`${API_URL}/profile/delete-account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password })
      });

      const responseText = await response.text();
      
      if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
        throw {
          response: { status: response.status },
          message: 'Server error. Please try again.'
        };
      }

      const data = JSON.parse(responseText);
      
      if (!response.ok) {
        throw {
          response: {
            status: response.status,
            data: data
          },
          message: data.message || `Error ${response.status}`
        };
      }

      return data;
    } catch (error) {
      console.error('ProfileAPI - Error deleting account:', error);
      throw error;
    }
  },

    uploadAvatar: async (file) => {
    try {
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
        throw {
            response: { status: 401 },
            message: 'No authentication token found. Please log in.'
        };
        }
        
        const formData = new FormData();
        formData.append('avatar', file);
        
        const response = await fetch(`${API_URL}/profile/upload-avatar`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
            // Don't set Content-Type for FormData, browser will set it with boundary
        },
        body: formData
        });

        const responseText = await response.text();
        
        if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
        throw {
            response: { status: response.status },
            message: 'Server error. Please try again.'
        };
        }

        const data = JSON.parse(responseText);
        
        if (!response.ok) {
        throw {
            response: {
            status: response.status,
            data: data
            },
            message: data.message || `Error ${response.status}`
        };
        }

        return data;
    } catch (error) {
        console.error('ProfileAPI - Error uploading avatar:', error);
        throw error;
    }
    },

    

    
};