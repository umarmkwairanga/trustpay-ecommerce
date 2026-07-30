import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Path to your auth hook

const AdminRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth(); // Assume you have a loading state

  if (loading) return <div>Loading...</div>; // Prevent redirect while checking auth

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Redirect if logged in but lacks required role (e.g., 'ceo')
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default AdminRoute;