require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// Point explicitly to the 'public' folder inside 'frontend'
const publicPath = path.resolve(__dirname, '..', 'frontend', 'public');

console.log("DEBUG: Serving static files from:", publicPath);

// 1. Serve static files from the public folder
app.use(express.static(publicPath));

// 2. Explicit routes
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/shop', (req, res) => {
    res.sendFile(path.join(publicPath, 'shop.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));