require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// 1. ADD SECURITY HEADERS to allow your CSS and Fonts
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https://via.placeholder.com data:;"
    );
    next();
});

// 2. SERVE FRONTEND
const frontendPath = path.join(process.cwd(), 'frontend');
console.log("DEBUG: The server is looking for files here:", frontendPath);

app.use(express.static(frontendPath));

// 3. ROUTES
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.get('/shop', (req, res) => {
    res.sendFile(path.join(frontendPath, 'shop.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));