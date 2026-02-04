const API_URL = 'http://127.0.0.1:8000/api';

export const CartAPI = {
    // Get cart items
    getCart: async () => {
        try {
            const token = localStorage.getItem('auth_token');
            
            if (!token) {
                throw {
                    response: { status: 401 },
                    message: 'No authentication token found. Please log in.'
                };
            }
            
            const response = await fetch(`${API_URL}/carts`, {
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
            console.error('CartAPI - Error fetching cart:', error);
            throw error;
        }
    },

    // Remove from cart
    removeFromCart: async (cartItemId) => {
        try {
            const token = localStorage.getItem('auth_token');
            
            if (!token) {
                throw {
                    response: { status: 401 },
                    message: 'No authentication token found. Please log in.'
                };
            }
            
            const response = await fetch(`${API_URL}/carts/${cartItemId}`, {
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
            console.error('CartAPI - Error removing from cart:', error);
            throw error;
        }
    },

    // Clear entire cart
    clearCart: async () => {
        try {
            const token = localStorage.getItem('auth_token');
            
            if (!token) {
                throw {
                    response: { status: 401 },
                    message: 'No authentication token found. Please log in.'
                };
            }
            
            // First get all cart items
            const cartItems = await CartAPI.getCart();
            
            // Remove each item
            const deletePromises = cartItems.map(item => 
                CartAPI.removeFromCart(item.id)
            );
            
            await Promise.all(deletePromises);
            
            return { message: 'Cart cleared successfully' };
        } catch (error) {
            console.error('CartAPI - Error clearing cart:', error);
            throw error;
        }
    },

    // Add to cart (existing method - keep this)
    addToCart: async (productId) => {
        try {
            const token = localStorage.getItem('auth_token');
            
            if (!token) {
                throw {
                    response: { status: 401 },
                    message: 'No authentication token found. Please log in.'
                };
            }
            
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
            console.error('CartAPI - Error adding to cart:', error);
            throw error;
        }
    },
};
