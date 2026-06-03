require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// 1. Define the frontend path clearly
const frontendPath = path.resolve(__dirname, '..', 'frontend');
console.log("DEBUG: frontendPath is:", frontendPath);

// 2. Add a middleware to log EVERY request
app.use((req, res, next) => {
    console.log(`DEBUG: Incoming request for: ${req.url}`);
    next();
});

// 3. Serve static files
app.use(express.static(frontendPath));

// 4. Routes - explicitly use the path
app.get('/', (req, res) => {
    const p = path.join(frontendPath, 'index.html');
    console.log("DEBUG: Sending file:", p);
    res.sendFile(p);
});

app.get('/shop', (req, res) => {
    const p = path.join(frontendPath, 'shop.html');
    console.log("DEBUG: Sending file:", p);
    res.sendFile(p);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));