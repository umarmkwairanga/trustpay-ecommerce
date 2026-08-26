const ProtectedRoute = ({ component: Component, requiredRole }) => {
    const { user } = useAuth(); // Your custom auth hook
    
    if (!user) return <Navigate to="/login" />;
    if (requiredRole && user.role !== requiredRole && user.role !== 'Super Admin') {
        return <Navigate to="/unauthorized" />;
    }
    
    return <Component />;
};