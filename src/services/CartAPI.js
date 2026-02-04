const API_URL = 'http://127.0.0.1:8000/api';

export const CartAPI = {
    addToCart: async (productId) => {
        try {
            const token = localStorage.getItem('auth_token');
            
            if (!token) {
                throw {
                    response: { status: 401 },
                    message: 'No authentication token found. Please log in.'
                };
            }
            
            console.log('CartAPI - Token found:', token.substring(0, 20) + '...');
            console.log('CartAPI - Adding product:', productId);
            
            const response = await fetch(`${API_URL}/carts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    product_id: productId
                })
            });

            const responseText = await response.text();
            console.log('CartAPI - Response status:', response.status);
            console.log('CartAPI - Response (first 300 chars):', responseText.substring(0, 300));
            
            if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
                console.error('CartAPI - HTML error page. Check Laravel logs.');
                
                if (response.status === 401 || response.status === 419) {
                    throw {
                        response: { status: response.status },
                        message: 'Authentication failed. Please log in again.'
                    };
                }
                
                throw {
                    response: { status: response.status },
                    message: `Server error ${response.status}. Check Laravel logs.`
                };
            }

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error('CartAPI - JSON parse error:', e);
                throw {
                    message: 'Invalid server response',
                    response: { status: response.status, text: responseText }
                };
            }

            if (!response.ok) {
                throw {
                    response: {
                        status: response.status,
                        data: data
                    },
                    message: data.message || data.error || `Error ${response.status}`
                };
            }

            console.log('CartAPI - Success:', data);
            return data;
            
        } catch (error) {
            console.error('CartAPI - Error:', error);
            throw error;
        }
    },
};
