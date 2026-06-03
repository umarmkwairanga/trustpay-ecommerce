const express = require('express');
const app = express();

// Simple route to check if the server responds
app.get('/', (req, res) => {
    res.send('SERVER IS OFFICIALLY WORKING!');
});

// Setting it to port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
});