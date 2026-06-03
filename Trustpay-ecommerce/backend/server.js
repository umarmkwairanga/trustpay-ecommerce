require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// THIS IS THE PATH-PROOF FIX:
// __dirname is the folder where 'server.js' lives (backend/).
// '..' moves up to the root folder.
// 'frontend' moves into your frontend directory.
const frontendPath = path.resolve(__dirname, '..', 'frontend');

console.log("DEBUG: Server is looking for files at:", frontendPath);

// Security Headers
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https://via.placeholder.com data:;"
    );
    next();
});

// Serve Static Files
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