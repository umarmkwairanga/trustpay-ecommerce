import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import Settings from './components/Settings';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute'; // Your security guard
import RiderDashboard from './pages/RiderDashboard';
import PayoutPanel from './pages/PayoutPanel';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products/:kind" element={<CategoryPageWrapper />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Settings */}
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />

        {/* Role-Protected Logistics Routes */}
        <Route path="/rider-dashboard" element={
          <ProtectedRoute allowedRoles={['delivery']}>
            <RiderDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/payouts" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <PayoutPanel />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

const CategoryPageWrapper = () => {
    const { kind } = useParams();
    return <CategoryPage category={kind} />;
};

export default App;