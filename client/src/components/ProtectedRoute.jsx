import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    // 1. Get user data from localStorage (where you saved it after login)
    const user = JSON.parse(localStorage.getItem('user'));

    // 2. Check if logged in
    if (!user) {
        return <Navigate to="/login" />;
    }

    // 3. Check if user has the correct role
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" />; // Redirect unauthorized users home
    }

    return children;
};

export default ProtectedRoute;