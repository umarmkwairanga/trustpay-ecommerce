require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

// Import Models
const Transaction = require('./models/Escrow.js');

// Import Routes
const productRoutes = require('./routes/productRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const ceoRoutes = require('./routes/ceoRoutes.js');
const translationRoutes = require('./routes/translationRoutes.js');
const livestockRoutes = require('./routes/livestockRoutes.js'); 
const advertisementRoutes = require('./routes/advertisementRoutes.js');

// Import Middleware
const { protect, authorizeCEO } = require('./middleware/auth.js');

// Import Background Workers
const checkAndExpireAds = require('./services/adExpirationCron.js');

const app = express();

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
      console.log("Connected to MongoDB successfully");
      setInterval(checkAndExpireAds, 60 * 60 * 1000);
  })
  .catch((err) => console.error("MongoDB connection error:", err.message));

// Middleware Setup
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: "Too many requests, please try again later."
});

const allowedOrigins = [
    process.env.CLIENT_URL,
    'https://trustpay-ecommerce.vercel.app',
    'http://localhost:5173'
].filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- FLUTTERWAVE WEBHOOK ---
app.post('/api/flutterwave/webhook', async (req, res) => {
    try {
        const signature = req.headers['verif-hash'];
        if (!signature || signature !== process.env.FLW_SECRET_HASH) return res.status(401).send('Unauthorized');
        
        const payload = req.body;
        if (payload.event === 'charge.completed' && payload.data.status === 'successful') {
            await Transaction.findOneAndUpdate({ reference: payload.data.tx_ref }, { status: 'HELD' });
        }
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
});

// --- API ROUTES ---
app.use('/api', apiLimiter);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ceo', protect, authorizeCEO, ceoRoutes);
app.use('/api/translation', protect, authorizeCEO, translationRoutes);
app.use('/api/livestock', livestockRoutes); 
app.use('/api/advertisements', advertisementRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;