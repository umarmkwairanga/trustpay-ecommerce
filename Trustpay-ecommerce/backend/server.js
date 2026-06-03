require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());

// SEARCH for the 'public' folder starting from the root
function findPublicFolder(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
            if (item === 'public') return fullPath;
            // Recursively search deeper
            const found = findPublicFolder(fullPath);
            if (found) return found;
        }
    }
    return null;
}

const rootDir = path.resolve(__dirname, '..');
const publicPath = findPublicFolder(rootDir);

console.log("DEBUG: Found public folder at:", publicPath);

if (publicPath) {
    app.use(express.static(publicPath));
    app.get('/', (req, res) => res.sendFile(path.join(publicPath, 'index.html')));
    app.get('/shop', (req, res) => res.sendFile(path.join(publicPath, 'shop.html')));
} else {
    app.get('/', (req, res) => res.send("ERROR: Could not find 'public' folder in " + rootDir));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));