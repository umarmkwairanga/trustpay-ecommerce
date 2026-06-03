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
// We go up one level from 'backend' to reach the project root, then to 'frontend'
const frontendPath = path.resolve(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// --- DEBUG: Help us see what the server sees ---
const fs = require('fs');
app.get('/check-files', (req, res) => {
    const files = fs.existsSync(frontendPath) ? fs.readdirSync(frontendPath) : "Folder not found";
    res.send("Files in frontend folder: " + JSON.stringify(files));
});

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const upload = multer({ storage: multer.memoryStorage() });

connectDB();

// --- ROUTES ---
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.get('/shop', (req, res) => {
    res.sendFile(path.join(frontendPath, 'shop.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));