import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import ViewSettings from "./components/ViewSettings"; // 1. Import it

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        {/* 2. Add it here, perhaps below the navbar */}
        <div className="container mx-auto px-4 py-2">
          <ViewSettings /> 
        </div>

        <main className="container mx-auto p-4">
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;