// components/ProtectedAdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Your existing Auth context

const ProtectedAdminRoute = ({ children }) => {
  const { isLoggedIn, role, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Only allow if role is 'admin'
  if (role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;