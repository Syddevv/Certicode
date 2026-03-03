const API_URL = `${(import.meta.env.VITE_API_URL || "").replace(/\/+$/, "")}/api`;

export const CartAPI = {
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

    clearCart: async () => {
        try {
            const token = localStorage.getItem('auth_token');
            
            if (!token) {
                throw {
                    response: { status: 401 },
                    message: 'No authentication token found. Please log in.'
                };
            }
            
            const response = await fetch(`${API_URL}/carts`, {
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
            console.error('CartAPI - Error clearing cart:', error);
            throw error;
        }
    },

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

    checkout: async (checkoutData) => {
        try {
            console.log('CartAPI.checkout - Sending checkout data:', checkoutData);
            
            const token = localStorage.getItem('auth_token');
            
            if (!token) {
                throw {
                    response: { status: 401 },
                    message: 'No authentication token found. Please log in.'
                };
            }
            
            const response = await fetch(`${API_URL}/carts/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(checkoutData)
            });

            const responseText = await response.text();
            
            console.log('CartAPI.checkout - Response status:', response.status);
            console.log('CartAPI.checkout - Response text:', responseText);
            
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
                    message: data.message || `Error ${response.status}: Checkout failed`
                };
            }

            return data;
        } catch (error) {
            console.error('CartAPI - Error during checkout:', error);
            throw error;
        }
    },

    confirmPayment: async (orderId, paymentIntentId) => {
        try {
            console.log('CartAPI.confirmPayment - Order ID:', orderId, 'Payment Intent:', paymentIntentId);
            
            const token = localStorage.getItem('auth_token');
            
            if (!token) {
                throw {
                    response: { status: 401 },
                    message: 'No authentication token found. Please log in.'
                };
            }
            
            const response = await fetch(`${API_URL}/carts/${orderId}/confirm-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    payment_intent_id: paymentIntentId
                })
            });

            const responseText = await response.text();
            
            console.log('CartAPI.confirmPayment - Response:', responseText);
            
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
            console.error('CartAPI - Error confirming payment:', error);
            throw error;
        }
    },

    getLatestOrder: async () => {
        try {
            const token = localStorage.getItem('auth_token');
            
            if (!token) {
                throw {
                    response: { status: 401 },
                    message: 'No authentication token found. Please log in.'
                };
            }
            
            const response = await fetch(`${API_URL}/orders/latest`, {
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
            console.error('CartAPI - Error fetching latest order:', error);
            throw error;
        }
    },

    getOrder: async (orderId) => {
        try {
            const token = localStorage.getItem('auth_token');
            
            if (!token) {
                throw {
                    response: { status: 401 },
                    message: 'No authentication token found. Please log in.'
                };
            }
            
            const response = await fetch(`${API_URL}/orders/${orderId}`, {
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
            console.error('CartAPI - Error fetching order:', error);
            throw error;
        }
    },
};