const API_URL = 'http://127.0.0.1:8000/api';

export const SupportTicketAPI = {
  createTicket: async (ticketData) => {
    try {
      const token = localStorage.getItem('auth_token');
      const formData = new FormData();
      
      formData.append('first_name', ticketData.first_name);
      formData.append('last_name', ticketData.last_name);
      formData.append('email', ticketData.email);
      formData.append('phone', ticketData.phone || '');
      formData.append('company', ticketData.company || '');
      formData.append('subject', ticketData.subject);
      formData.append('message', ticketData.message);
      formData.append('category', ticketData.category || 'Technical');
      formData.append('priority', ticketData.priority || 'low');
      
      if (ticketData.attachment) {
        formData.append('attachment', ticketData.attachment);
      }

      const response = await fetch(`${API_URL}/support/tickets`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
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
      console.error('SupportTicketAPI - Error creating ticket:', error);
      throw error;
    }
  },

  getTickets: async (filter = "all") => {
    try {
        console.log('📡 [SupportTicketAPI] Fetching tickets, filter:', filter);
        
        const token = localStorage.getItem('auth_token');
        console.log('🔑 Token exists:', !!token);
        
        if (!token) {
        throw {
            response: { status: 401 },
            message: 'No authentication token found. Please log in.'
        };
        }
        
        let url = `${API_URL}/support/tickets`;
        console.log('🌐 API URL:', url);
        
        const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
        });

        console.log('📊 Response Status:', response.status, response.statusText);
        
        const responseText = await response.text();
        console.log('📄 Raw Response:', responseText.substring(0, 500)); // First 500 chars
        
        // Try to parse JSON
        let data;
        try {
        data = JSON.parse(responseText);
        console.log('✅ Parsed JSON Data:', data);
        console.log('📦 Data type:', typeof data);
        console.log('🔢 Is array?', Array.isArray(data));
        console.log('📊 Data keys:', Object.keys(data));
        
        if (data.data) {
            console.log('📋 data.data exists, type:', typeof data.data);
            console.log('🔢 data.data is array?', Array.isArray(data.data));
            console.log('📊 data.data length:', data.data?.length);
        }
        
        } catch (parseError) {
        console.error('❌ Failed to parse JSON:', parseError);
        console.log('📄 Full response:', responseText);
        throw new Error('Invalid JSON response from server');
        }
        
        if (!response.ok) {
        console.error('❌ Response not OK:', data);
        throw {
            response: {
            status: response.status,
            data: data
            },
            message: data.message || data.error || `Error ${response.status}`
        };
        }

        return data;
    } catch (error) {
        console.error('🔥 SupportTicketAPI - Error fetching tickets:', error);
        throw error;
    }
    },

  getTicketStats: async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw {
          response: { status: 401 },
          message: 'No authentication token found. Please log in.'
        };
      }
      
      const response = await fetch(`${API_URL}/support/tickets/stats`, {
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
      console.error('SupportTicketAPI - Error fetching stats:', error);
      throw error;
    }
  },

  updateTicket: async (ticketId, updateData) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw {
          response: { status: 401 },
          message: 'No authentication token found. Please log in.'
        };
      }
      
      const response = await fetch(`${API_URL}/support/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
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
      console.error('SupportTicketAPI - Error updating ticket:', error);
      throw error;
    }
  },

  deleteTicket: async (ticketId) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw {
          response: { status: 401 },
          message: 'No authentication token found. Please log in.'
        };
      }
      
      const response = await fetch(`${API_URL}/support/tickets/${ticketId}`, {
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
      console.error('SupportTicketAPI - Error deleting ticket:', error);
      throw error;
    }
  },

  bulkCloseTickets: async (ticketIds) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw {
          response: { status: 401 },
          message: 'No authentication token found. Please log in.'
        };
      }
      
      const response = await fetch(`${API_URL}/support/tickets/bulk-close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ticket_ids: ticketIds })
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
      console.error('SupportTicketAPI - Error bulk closing tickets:', error);
      throw error;
    }
  },

  assignTicket: async (ticketId, assigneeId) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw {
          response: { status: 401 },
          message: 'No authentication token found. Please log in.'
        };
      }
      
      const response = await fetch(`${API_URL}/support/tickets/${ticketId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ assigned_to: assigneeId })
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
      console.error('SupportTicketAPI - Error assigning ticket:', error);
      throw error;
    }
  },

  getTicket: async (ticketId) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw {
          response: { status: 401 },
          message: 'No authentication token found. Please log in.'
        };
      }
      
      const response = await fetch(`${API_URL}/support/tickets/${ticketId}`, {
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
      console.error('SupportTicketAPI - Error fetching ticket:', error);
      throw error;
    }
  },

  getMyTickets: async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw {
          response: { status: 401 },
          message: 'No authentication token found. Please log in.'
        };
      }
      
      const response = await fetch(`${API_URL}/support/my-tickets`, {
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
      console.error('SupportTicketAPI - Error fetching my tickets:', error);
      throw error;
    }
  }
};