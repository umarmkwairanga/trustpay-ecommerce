import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home'; // You'll create this
import Login from '../features/auth/Login';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
  </Routes>
);

export default AppRoutes;