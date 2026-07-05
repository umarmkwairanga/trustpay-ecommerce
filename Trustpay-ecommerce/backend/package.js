import 'dotenv/config';
import express from 'express';
// Point to the actual location of your services
import connectDB from './src/services/api.js'; 
// Point to the actual location of your routes
import indexRoutes from './src/routes/AppRoutes.jsx'; 

connectDB(); 

const app = express();
app.use(express.json());
app.use('/', indexRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
});