import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userId = params.get('user_id');
    const role = params.get('role');
    const name = params.get('name');
    const error = params.get('error');

    if (error) {
      alert(decodeURIComponent(error));
      navigate('/login');
      return;
    }

    if (token) {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_id', userId || '');
      localStorage.setItem('user_role', role || 'Customer');
      localStorage.setItem('user_name', name || '');
      
      // Redirect based on role
      if (role === 'Admin') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } else {
      navigate('/login');
    }
  }, [location, navigate]);

  return (
    <div className="auth-callback">
      <h2>Logging you in...</h2>
      <p>Please wait while we complete your authentication.</p>
    </div>
  );
};

export default AuthCallback;