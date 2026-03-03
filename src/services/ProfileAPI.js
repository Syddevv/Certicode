const API_URL = `${(import.meta.env.VITE_API_URL || "").replace(/\/+$/, "")}/api`;

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

  enrollAdminMfa: async () => {
    try {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        throw {
          response: { status: 401 },
          message: 'No authentication token found. Please log in.'
        };
      }

      const response = await fetch(`${API_URL}/mfa/enroll`, {
        method: 'POST',
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
      console.error('ProfileAPI - Error enrolling admin MFA:', error);
      throw error;
    }
  },

  confirmAdminMfa: async (code) => {
    try {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        throw {
          response: { status: 401 },
          message: 'No authentication token found. Please log in.'
        };
      }

      const response = await fetch(`${API_URL}/mfa/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code })
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
      console.error('ProfileAPI - Error confirming admin MFA:', error);
      throw error;
    }
  },

  disableMfa: async (payload) => {
    try {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        throw {
          response: { status: 401 },
          message: 'No authentication token found. Please log in.'
        };
      }

      const response = await fetch(`${API_URL}/mfa/disable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
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
      console.error('ProfileAPI - Error disabling MFA:', error);
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

    downloadProductFile: async (productId) => {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('Please login to download files');
    }
    
    // Open in new window - browser will handle the auth headers automatically
    window.open(`${API_URL}/products/${productId}/download`, '_blank');
    
    return {
      success: true,
      message: 'Download opened in new tab'
    };
    
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
},

// BILLING
  getBillingDetails: async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw {
          response: { status: 401 },
          message: 'No authentication token found. Please log in.'
        };
      }
      
      const response = await fetch(`${API_URL}/billing/details`, {
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
      console.error('ProfileAPI - Error fetching billing details:', error);
      throw error;
    }
  },

  updateBillingDetails: async (billingData) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw {
          response: { status: 401 },
          message: 'No authentication token found. Please log in.'
        };
      }
      
      const response = await fetch(`${API_URL}/billing/details`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(billingData)
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
      console.error('ProfileAPI - Error updating billing details:', error);
      throw error;
    }
  },

  // Payment Methods Functions
  getPaymentMethods: async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw {
          response: { status: 401 },
          message: 'No authentication token found. Please log in.'
        };
      }
      
      const response = await fetch(`${API_URL}/billing/payment-methods`, {
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
      console.error('ProfileAPI - Error fetching payment methods:', error);
      throw error;
    }
  },

  addPaymentMethod: async (paymentData) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw {
          response: { status: 401 },
          message: 'No authentication token found. Please log in.'
        };
      }
      
      const response = await fetch(`${API_URL}/billing/payment-methods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
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
      console.error('ProfileAPI - Error adding payment method:', error);
      throw error;
    }
  },

  updatePaymentMethod: async (paymentMethodId, paymentData) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw {
          response: { status: 401 },
          message: 'No authentication token found. Please log in.'
        };
      }
      
      const response = await fetch(`${API_URL}/billing/payment-methods/${paymentMethodId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
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
      console.error('ProfileAPI - Error updating payment method:', error);
      throw error;
    }
  },

  deletePaymentMethod: async (paymentMethodId) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw {
          response: { status: 401 },
          message: 'No authentication token found. Please log in.'
        };
      }
      
      const response = await fetch(`${API_URL}/billing/payment-methods/${paymentMethodId}`, {
        method: 'DELETE',
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
      console.error('ProfileAPI - Error deleting payment method:', error);
      throw error;
    }
  },

  setDefaultPaymentMethod: async (paymentMethodId) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw {
          response: { status: 401 },
          message: 'No authentication token found. Please log in.'
        };
      }
      
      const response = await fetch(`${API_URL}/billing/payment-methods/${paymentMethodId}/default`, {
        method: 'PATCH',
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
      console.error('ProfileAPI - Error setting default payment method:', error);
      throw error;
    }
  },

};
