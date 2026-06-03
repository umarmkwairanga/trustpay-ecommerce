require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// Point to the 'public' subfolder inside 'frontend'
const frontendPath = path.resolve(__dirname, '..', 'frontend', 'public');

// Serve static files from the public directory
app.use(express.static(frontendPath));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.get('/shop', (req, res) => {
    res.sendFile(path.join(frontendPath, 'shop.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));