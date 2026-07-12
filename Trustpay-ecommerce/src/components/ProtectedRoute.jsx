import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    // If no user is logged in, redirect them to login page
    if (!user) {
        return <Navigate to="/login" />;
    }

    // Otherwise, show the page content
    return children;
};

export default ProtectedRoute;