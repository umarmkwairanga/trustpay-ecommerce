import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext' // 1. Import your CartProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Nest your providers: AuthProvider outside, CartProvider inside */}
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)