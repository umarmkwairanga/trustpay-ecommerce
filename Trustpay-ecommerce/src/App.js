import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* The :kind parameter makes the category dynamic */}
        <Route path="/products/:kind" element={<CategoryPageWrapper />} />
      </Routes>
    </Router>
  );
}

// A helper to pull the category from the URL
const CategoryPageWrapper = () => {
    const { kind } = useParams();
    return <CategoryPage category={kind} />;
};