import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      try {
        // Try to validate token on app load
        const isValid = await api.validateToken();
        if (!isValid) {
          api.clearAuthData();
          navigate('/login?error=Session expired');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [navigate]);
};