import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; 
import { LanguageProvider } from './context/LanguageContext';

// Components & Pages
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import LoginForm from './components/LoginForm';
import ProductList from './pages/ProductList';
import Register from './pages/Register';
import OrderHistory from './pages/OrderHistory';
import OrderDetails from './pages/OrderDetails';
import ProfilePage from './pages/ProfilePage';
import AdminProductManager from './pages/AdminProductManager';
import AdminDisputeDashboard from './pages/AdminDisputeDashboard';
import RiderDashboard from './pages/RiderDashboard';
import EditProduct from './pages/EditProduct';
import AddProductPage from './pages/AddProductPage'; 
import CartView from './pages/CartView';
import SellerDashboard from './pages/SellerDashboard';
import StaffDashboard from './pages/StaffDashboard';
import About from './pages/About';
import FAQ from './pages/FAQ';

// NEW: AI Translation Dashboard Import
import TranslationDashboard from './pages/TranslationDashboard'; 

// Admin Dashboards
import AdminDashboard from './pages/AdminDashboard'; 
import CEODashboard from './pages/CEODashboard';   
import TransactionLogs from './pages/TransactionLogs';
import UserManagement from './pages/UserManagement';
import SellerManagement from './pages/SellerManagement';
import CMSManager from './pages/CMSManager';

// Legal Pages
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import EscrowPolicy from './pages/legal/EscrowPolicy';
import BuyerProtection from './pages/legal/BuyerProtection';
import SellerProtection from './pages/legal/SellerProtection';

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    return isLoggedIn ? children : <Navigate to="/login" />;
};

const RoleRoute = ({ children, allowedRoles }) => {
    const { isLoggedIn, user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    return (isLoggedIn && allowedRoles.includes(user?.role)) ? children : <Navigate to="/" />;
};

function App() {
    return (
        <LanguageProvider> 
            <Router>
                <Navbar />
                <ErrorBoundary>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<ProductList />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/cart" element={<CartView />} />
                        
                        {/* AI Translation Dashboard - Split Screen */}
                        <Route path="/translate" element={<TranslationDashboard />} />

                        {/* Legal Policy Routes */}
                        <Route path="/legal/privacy" element={<PrivacyPolicy />} />
                        <Route path="/legal/escrow" element={<EscrowPolicy />} />
                        <Route path="/legal/buyer-protection" element={<BuyerProtection />} />
                        <Route path="/legal/seller-protection" element={<SellerProtection />} />

                        {/* Protected User Routes */}
                        <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
                        <Route path="/orders/:orderId" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                        
                        {/* Admin & CEO Dashboards */}
                        <Route path="/admin/dashboard" element={
                            <RoleRoute allowedRoles={['admin', 'ceo']}><AdminDashboard /></RoleRoute>
                        } />
                        <Route path="/admin/ceo-view" element={
                            <RoleRoute allowedRoles={['ceo']}><CEODashboard /></RoleRoute>
                        } />

                        {/* Admin Operational Management */}
                        <Route path="/admin/transactions" element={
                            <RoleRoute allowedRoles={['admin']}><TransactionLogs /></RoleRoute>
                        } />
                        <Route path="/admin/users" element={
                            <RoleRoute allowedRoles={['admin']}><UserManagement /></RoleRoute>
                        } />
                        <Route path="/admin/sellers" element={
                            <RoleRoute allowedRoles={['admin']}><SellerManagement /></RoleRoute>
                        } />
                        <Route path="/admin/cms/terms" element={
                            <RoleRoute allowedRoles={['admin']}><CMSManager page="terms" /></RoleRoute>
                        } />
                        <Route path="/admin/cms/privacy" element={
                            <RoleRoute allowedRoles={['admin']}><CMSManager page="privacy" /></RoleRoute>
                        } />
                        
                        {/* Seller & Admin Product Routes */}
                        <Route path="/seller/dashboard" element={
                            <RoleRoute allowedRoles={['seller', 'admin']}><SellerDashboard /></RoleRoute>
                        } />
                        <Route path="/admin/products" element={
                            <RoleRoute allowedRoles={['admin', 'seller']}><AdminProductManager /></RoleRoute>
                        } />
                        <Route path="/admin/add-product" element={
                            <RoleRoute allowedRoles={['admin', 'seller']}><AddProductPage /></RoleRoute>
                        } />
                        <Route path="/admin/edit/:id" element={
                            <RoleRoute allowedRoles={['admin', 'seller']}><EditProduct /></RoleRoute>
                        } />
                        <Route path="/admin/disputes" element={
                            <RoleRoute allowedRoles={['admin']}><AdminDisputeDashboard /></RoleRoute>
                        } />

                        {/* Delivery & Staff Routes */}
                        <Route path="/rider/dashboard" element={
                            <RoleRoute allowedRoles={['delivery']}><RiderDashboard /></RoleRoute>
                        } />
                        <Route path="/staff/dashboard" element={
                            <RoleRoute allowedRoles={['staff', 'admin']}><StaffDashboard /></RoleRoute>
                        } />

                        {/* 404 Catch-all */}
                        <Route path="*" element={
                            <div className="p-20 text-center">
                                <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
                                <a href="/" className="text-blue-600 underline">Return to Home</a>
                            </div>
                        } />
                    </Routes>
                </ErrorBoundary>
                <Footer />
            </Router>
        </LanguageProvider>
    );
}

export default App;