const API_URL = 'http://127.0.0.1:8000/api';

export const AdminPromoAPI = {
  getVouchers: async (page = 1, perPage = 5, search = '', status = '') => {
    try {
      const token = localStorage.getItem('auth_token');
      
      let url = `${API_URL}/admin/promos?page=${page}&per_page=${perPage}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (status) url += `&status=${status}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const responseText = await response.text();
      
      if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
        throw new Error('Server error. Please try again.');
      }

      const data = JSON.parse(responseText);
      
      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('AdminPromoAPI - Error fetching vouchers:', error);
      throw error;
    }
  },

  getVoucherStats: async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/admin/promos/stats`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const responseText = await response.text();
      
      if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
        throw new Error('Server error. Please try again.');
      }

      const data = JSON.parse(responseText);
      
      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('AdminPromoAPI - Error fetching stats:', error);
      throw error;
    }
  },

  getVoucher: async (id) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/admin/promos/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const responseText = await response.text();
      
      if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
        throw new Error('Server error. Please try again.');
      }

      const data = JSON.parse(responseText);
      
      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('AdminPromoAPI - Error fetching voucher:', error);
      throw error;
    }
  },

  createVoucher: async (voucherData) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/admin/promos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(voucherData)
      });

      const responseText = await response.text();
      
      if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
        throw new Error('Server error. Please try again.');
      }

      const data = JSON.parse(responseText);
      
      if (!response.ok) {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat();
          throw new Error(errorMessages.join(', '));
        }
        throw new Error(data.message || `Error ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('AdminPromoAPI - Error creating voucher:', error);
      throw error;
    }
  },

  updateVoucher: async (id, voucherData) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/admin/promos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(voucherData)
      });

      const responseText = await response.text();
      
      if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
        throw new Error('Server error. Please try again.');
      }

      const data = JSON.parse(responseText);
      
      if (!response.ok) {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat();
          throw new Error(errorMessages.join(', '));
        }
        throw new Error(data.message || `Error ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('AdminPromoAPI - Error updating voucher:', error);
      throw error;
    }
  },

  deleteVoucher: async (id) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/admin/promos/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const responseText = await response.text();
      
      if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
        throw new Error('Server error. Please try again.');
      }

      const data = JSON.parse(responseText);
      
      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('AdminPromoAPI - Error deleting voucher:', error);
      throw error;
    }
  },

  toggleVoucherStatus: async (id) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/admin/promos/${id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const responseText = await response.text();
      
      if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
        throw new Error('Server error. Please try again.');
      }

      const data = JSON.parse(responseText);
      
      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('AdminPromoAPI - Error toggling voucher status:', error);
      throw error;
    }
  },

  bulkAction: async (action, ids) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/admin/promos/bulk-action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action, ids })
      });

      const responseText = await response.text();
      
      if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
        throw new Error('Server error. Please try again.');
      }

      const data = JSON.parse(responseText);
      
      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('AdminPromoAPI - Error bulk action:', error);
      throw error;
    }
  }
};