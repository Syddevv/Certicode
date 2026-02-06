const API_URL = 'http://127.0.0.1:8000/api';

export const AdminCustomersAPI = {
  getCustomers: async (page = 1, search = '', status = '', perPage = 10) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw {
          response: { status: 401 },
          message: 'No authentication token found.'
        };
      }
      
      let url = `${API_URL}/customers?page=${page}&per_page=${perPage}`;
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
        throw {
          response: { status: response.status },
          message: 'Server error.'
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
      console.error('AdminCustomersAPI - Error fetching customers:', error);
      throw error;
    }
  },

  getCustomerDetails: async (customerId) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw {
          response: { status: 401 },
          message: 'No authentication token found.'
        };
      }
      
      const response = await fetch(`${API_URL}/customers/${customerId}`, {
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
          message: 'Server error.'
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
      console.error('AdminCustomersAPI - Error fetching customer details:', error);
      throw error;
    }
  },

  getCustomerStats: async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw {
          response: { status: 401 },
          message: 'No authentication token found.'
        };
      }
      
      const response = await fetch(`${API_URL}/customer-stats`, {
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
          message: 'Server error.'
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

      const calculatePercentageChange = (current, previous) => {
        if (!previous || previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
      };

      const statsWithPercentages = {
        ...data,
        total_customers_change: calculatePercentageChange(data.total_customers, data.previous_total_customers || 0),
        active_customers_change: calculatePercentageChange(data.active_customers, data.previous_active_customers || 0),
        total_revenue_change: calculatePercentageChange(data.total_revenue, data.previous_total_revenue || 0),
        avg_order_value_change: calculatePercentageChange(data.avg_order_value, data.previous_avg_order_value || 0)
      };

      return statsWithPercentages;
    } catch (error) {
      console.error('AdminCustomersAPI - Error fetching customer stats:', error);
      throw error;
    }
  },

  getDashboardStats: async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw {
          response: { status: 401 },
          message: 'No authentication token found.'
        };
      }
      
      const response = await fetch(`${API_URL}/dashboard-stats`, {
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
          message: 'Server error.'
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
      console.error('AdminCustomersAPI - Error fetching dashboard stats:', error);
      throw error;
    }
  },

  updateCustomerStatus: async (customerId, status) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw {
          response: { status: 401 },
          message: 'No authentication token found.'
        };
      }
      
      const response = await fetch(`${API_URL}/customers/${customerId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      const responseText = await response.text();
      
      if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
        throw {
          response: { status: response.status },
          message: 'Server error.'
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
      console.error('AdminCustomersAPI - Error updating customer status:', error);
      throw error;
    }
  },

  getCustomerOrders: async (customerId, page = 1) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw {
          response: { status: 401 },
          message: 'No authentication token found.'
        };
      }
      
      const response = await fetch(`${API_URL}/customers/${customerId}/orders?page=${page}`, {
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
          message: 'Server error.'
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
      console.error('AdminCustomersAPI - Error fetching customer orders:', error);
      throw error;
    }
  },

  exportCustomers: async () => {
    try {
      console.log('Testing export route...');
      
      const testResponse = await fetch(`${API_URL}/customers/export-test`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/csv, */*'
        }
      });
      
      console.log('Test route status:', testResponse.status);
      
      if (testResponse.ok) {
        console.log('Test route works! Now trying with auth...');
      } else {
        console.log('Test route failed:', testResponse.status);
        const testText = await testResponse.text();
        console.log('Test route error:', testText);
      }
      
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No authentication token found.');
      }
      
      console.log('Trying export with token...');
      
      const response = await fetch(`${API_URL}/customers/export`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json, text/csv, */*',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      console.log('Export response status:', response.status);
      console.log('Export response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Export error response:', errorText);
        
        if (response.status === 404) {
          throw new Error('Export endpoint not found. Route may be blocked by middleware.');
        } else if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        throw new Error(`Export failed: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      console.log('Export blob size:', blob.size);
      
      const contentDisposition = response.headers.get('content-disposition');
      let filename = `customers_${new Date().toISOString().split('T')[0]}.csv`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('AdminCustomersAPI - Error exporting customers:', error);
      throw error;
    }
  }
};