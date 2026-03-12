import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileAPI } from '../services/ProfileAPI';

export const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let isActive = true;

    const syncAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      try {
        const currentUser = await ProfileAPI.getCurrentUser();

        if (!isActive) return;

        if (currentUser?.id !== undefined) {
          localStorage.setItem('user_id', String(currentUser.id));
        }
        localStorage.setItem('user_name', currentUser?.name || '');
        localStorage.setItem('user_role', currentUser?.role || '');
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_name');

        if (!isActive) return;

        navigate('/login?error=Session expired', { replace: true });
      }
    };

    syncAuth();
    const interval = setInterval(syncAuth, 5 * 60 * 1000);
    
    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, [navigate]);
};
