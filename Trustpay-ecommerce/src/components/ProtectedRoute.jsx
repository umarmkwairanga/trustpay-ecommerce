import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useContext(AuthContext);

    // 1. If no user is logged in, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 2. If roles are specified, check if the user has the right one
    // We check if the user's role exists inside the allowedRoles array
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // 3. Otherwise, show the content
    return children;
};

export default ProtectedRoute;