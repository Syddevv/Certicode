const API_URL = 'http://127.0.0.1:8000/api';

export const PromoAPI = {
  validatePromo: async (code, subtotal, productIds = []) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/promo/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: code,
          subtotal: subtotal,
          product_ids: Array.isArray(productIds) ? productIds : []
        })
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
      console.error('PromoAPI - Error:', error);
      throw error;
    }
  },

  getActivePromos: async () => {
    try {
      const response = await fetch(`${API_URL}/promo/active`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
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
      console.error('PromoAPI - Error:', error);
      throw error;
    }
  },

  getUserPromoCodes: async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('Please log in to view your vouchers');
      }
      
      const response = await fetch(`${API_URL}/user/promo-codes`, {
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
      console.error('PromoAPI - Error fetching user promos:', error);
      throw error;
    }
  },

  getUserPromoHistory: async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('Please log in to view promo history');
      }
      
      const response = await fetch(`${API_URL}/user/promo-history`, {
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
      console.error('PromoAPI - Error fetching promo history:', error);
      throw error;
    }
  }
};
