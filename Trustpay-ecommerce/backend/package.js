import 'dotenv/config'; 
import express from 'express';
import cors from 'cors'; // 1. Import cors package
import connectDB from './src/services/api.js'; 
import indexRoutes from './src/routes/AppRoutes.jsx'; 

connectDB(); 

const app = express();

// 2. Add this CORS middleware BEFORE your routes
app.use(cors({
    origin: 'https://TrustPayEcommerce-ecommerce.vercel.app', // Your frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

// 3. Your routes go here
app.use('/', indexRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
});