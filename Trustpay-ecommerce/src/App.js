import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import Settings from './components/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:kind" element={<CategoryPageWrapper />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

const CategoryPageWrapper = () => {
    const { kind } = useParams();
    return <CategoryPage category={kind} />;
};

export default App;