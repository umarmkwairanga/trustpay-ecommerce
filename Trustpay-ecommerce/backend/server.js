require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // Added to list files
const app = express();

app.use(cors());
app.use(express.json());

const frontendPath = path.resolve(__dirname, '..', 'frontend');

app.get('/', (req, res) => {
    // List what is in the folder so we can debug
    let files = [];
    try {
        files = fs.readdirSync(frontendPath);
    } catch (e) {
        return res.send("DEBUG: Folder not found at " + frontendPath);
    }
    
    const p = path.join(frontendPath, 'index.html');
    if (fs.existsSync(p)) {
        res.sendFile(p);
    } else {
        res.send("DEBUG: index.html not found. Folder contains: " + JSON.stringify(files));
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));