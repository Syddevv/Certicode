const API_URL = 'http://127.0.0.1:8000/api';

export const AdminDashboardAPI = {
  getDashboardData: async (page = 1) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No authentication token found.');
      }
      
      const response = await fetch(`${API_URL}/admin/dashboard?page=${page}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const responseText = await response.text();
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { message: 'Server error' };
        }
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = JSON.parse(responseText);
      return data;
      
    } catch (error) {
      console.error('AdminDashboardAPI - Error fetching dashboard data:', error);
      throw error;
    }
  },

  getSalesOverview: async (period = '6months') => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No authentication token found.');
      }
      
      const response = await fetch(`${API_URL}/admin/dashboard/sales?period=${period}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const responseText = await response.text();
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { message: 'Server error' };
        }
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = JSON.parse(responseText);
      return data;
      
    } catch (error) {
      console.error('AdminDashboardAPI - Error fetching sales overview:', error);
      throw error;
    }
  }
};