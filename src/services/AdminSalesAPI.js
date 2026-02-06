const API_URL = 'http://127.0.0.1:8000/api';

export const AdminSalesAPI = {
  getOrders: async (page = 1, filters = {}) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No authentication token found.');
      }
      
      let url = `${API_URL}/sales/orders?page=${page}&per_page=10`;
      
      if (filters.date_range && filters.date_range !== 'all') {
        url += `&date_range=${filters.date_range}`;
      }
      if (filters.category && filters.category !== 'all') {
        url += `&category=${encodeURIComponent(filters.category)}`;
      }
      if (filters.status && filters.status !== 'all') {
        url += `&status=${encodeURIComponent(filters.status)}`;
      }
      if (filters.search) {
        url += `&search=${encodeURIComponent(filters.search)}`;
      }
      
      const response = await fetch(url, {
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
      console.error('AdminSalesAPI - Error fetching orders:', error);
      throw error;
    }
  },

  getSalesStats: async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No authentication token found.');
      }
      
      const response = await fetch(`${API_URL}/sales/stats`, {
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
      console.error('AdminSalesAPI - Error fetching sales stats:', error);
      throw error;
    }
  },

  exportOrders: async (filters = {}) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No authentication token found.');
      }
      
      let url = `${API_URL}/sales/export`;
      
      const params = new URLSearchParams();
      if (filters.date_range && filters.date_range !== 'all') {
        params.append('date_range', filters.date_range);
      }
      if (filters.category && filters.category !== 'all') {
        params.append('category', filters.category);
      }
      if (filters.status && filters.status !== 'all') {
        params.append('status', filters.status);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json, text/csv, */*',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Export failed: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get('content-disposition');
      let filename = `sales_${new Date().toISOString().split('T')[0]}.csv`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      const urlObject = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = urlObject;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(urlObject);
      document.body.removeChild(a);
    } catch (error) {
      console.error('AdminSalesAPI - Error exporting orders:', error);
      throw error;
    }
  }
};