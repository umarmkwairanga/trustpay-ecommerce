import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PayoutDashboard from './components/admin/PayoutDashboard';
import ProtectedRoute from './components/ProtectedRoute'; // Import the guard

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* Main landing page */}
          <Route path="/" element={
            <div className="flex items-center justify-center min-h-screen">
              <h1 className="text-4xl font-bold text-blue-600">TrustPayEcommerce Portal</h1>
            </div>
          } />
          
          {/* Secure CEO/Admin Payout Route */}
          <Route path="/ceo/payouts" element={
            <ProtectedRoute allowedRoles={['admin', 'ceo']}>
              <PayoutDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App;