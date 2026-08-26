import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import escrowRoutes from './routes/escrowRoutes.js';
import advertisementRoutes from './routes/advertisementRoutes.js';

import bookingInventoryRoutes from './routes/bookingInventoryRoutes.js';
import customerBookingRoutes from './routes/customerBookingRoutes.js';
import providerBookingRoutes from './routes/providerBookingRoutes.js';
import adminCeoBookingRoutes from './routes/adminCeoBookingRoutes.js';

// New Ecosystem & CEO Control Center Routes
import learnerRoutes from './routes/learnerRoutes.js';
import employerRoutes from './routes/employerRoutes.js';
import jobSeekerRoutes from './routes/jobSeekerRoutes.js';
import opportunityRoutes from './routes/opportunityRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import ceoRoutes from './routes/ceoRoutes.js';
import ecosystemRoutes from './routes/ecosystemRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
    origin: [
        process.env.CLIENT_URL,
        'https://TrustPayEcommerce-ecommerce.vercel.app',
        'http://localhost:5173'
    ].filter(Boolean),
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
connectDB();

// Register application routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/advertisements', advertisementRoutes);

// Booking, Inventory, Provider, Admin & CEO Routes
app.use('/api/business/inventory', bookingInventoryRoutes);
app.use('/api/bookings', bookingInventoryRoutes);          // Public search & inventory lookups
app.use('/api/bookings', customerBookingRoutes);            // Customer booking initiation, history & fulfillment
app.use('/api/provider/bookings', providerBookingRoutes);   // Provider booking management
app.use('/api/admin', adminCeoBookingRoutes);               // Admin provider verification
app.use('/api/ceo', adminCeoBookingRoutes);                 // CEO platform KPIs

// New Ecosystem Roles & Master CEO Operations Routes
app.use('/api/learners', learnerRoutes);
app.use('/api/employers', employerRoutes);
app.use('/api/job-seekers', jobSeekerRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/ceo', ceoRoutes);                             // Master AI-powered CEO control endpoints
app.use('/api/ecosystem', ecosystemRoutes);                 // Full-platform cross-vertical ecosystem data

// Platform Settings Endpoint (Fixes Footer 404)
app.get('/api/settings', (req, res) => {
    res.json({
        supportEmail: 'support@trustpayecommerce.com',
        supportPhone: '+234 800 TRUSTPAY',
        disputeEmail: 'disputes@trustpayecommerce.com'
    });
});

app.get('/', (req, res) => res.send('TrustPayEcommerce API is running...'));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`TrustPayEcommerce server running on port ${PORT}`);
});