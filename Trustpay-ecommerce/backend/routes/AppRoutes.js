// src/routes/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import Login from '../features/auth/Login';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Add more routes here later */}
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;