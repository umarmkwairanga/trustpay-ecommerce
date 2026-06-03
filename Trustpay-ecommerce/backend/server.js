require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// THIS IS THE FIX:
// We tell the server to look in the root folder for the "frontend" folder,
// no matter how deep the server's internal system is.
const frontendPath = path.join(process.cwd(), 'frontend');

console.log("DEBUG: The server is looking for files here:", frontendPath);

app.use(express.static(frontendPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.get('/shop', (req, res) => {
    res.sendFile(path.join(frontendPath, 'shop.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));