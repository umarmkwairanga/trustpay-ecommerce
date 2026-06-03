require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const connectDB = require('./db');
const Product = require('./models/Product'); 

const app = express();
app.use(cors());
app.use(express.json());

// --- SERVE FRONTEND ---
const frontendPath = path.resolve(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// --- DEBUG: Check if Environment Variables loaded ---
console.log("DEBUG: Cloudinary Configured:", !!process.env.CLOUD_NAME);
console.log("DEBUG: MONGO_URI starts with:", process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 20) : "MISSING");

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const upload = multer({ storage: multer.memoryStorage() });

// Connect to DB
connectDB();

// --- ROUTES ---
// Serve the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Serve the shop page
app.get('/shop', (req, res) => {
    res.sendFile(path.join(frontendPath, 'shop.html'));
});

// ... (keep your other API routes here)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));