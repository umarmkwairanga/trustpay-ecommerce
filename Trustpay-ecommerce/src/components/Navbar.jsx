import { Link } from 'react-router-dom';
// ... inside your Navbar component
{user ? (
  <button onClick={logout} className="bg-red-600 px-5 py-3 rounded-lg">Logout</button>
) : (
  <Link to="/login" className="bg-green-600 px-5 py-3 rounded-lg">
    Login
  </Link>
)}