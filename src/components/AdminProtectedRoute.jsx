import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('auth_token');
  const userRole = localStorage.getItem('user_role');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  if (userRole !== 'Admin') {
    return <Navigate to="/" />;
  }
  
  return children;
};

export default AdminProtectedRoute;