import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dns from 'node:dns/promises';

// Attempt to resolve the Atlas host immediately
async function startServer() {
    try {
        // Force lookup to ensure the hostname resolves before Mongoose tries
        console.log("Resolving MongoDB hostname...");
        const host = "cluster0.qcsvwc2.mongodb.net";
        const addresses = await dns.lookup(host);
        console.log("Resolved IP:", addresses.address);
    } catch (err) {
        console.warn("DNS lookup failed, proceeding with standard driver resolution...");
    }

    const app = express();
    app.use(cors());
    app.use(express.json());

    // ... (Your existing routes)
    
    const dbUri = process.env.MONGODB_URI;
    const PORT = process.env.PORT || 5000;

    mongoose.connect(dbUri, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        family: 4,
        tls: true,
        tlsAllowInvalidCertificates: true 
    })
    .then(() => {
        console.log("Successfully connected to MongoDB.");
        app.listen(PORT, () => console.log(`Server is live at http://localhost:${PORT}`));
    })
    .catch(err => {
        console.error("Connection failed. Check your internet or whitelist.", err.message);
        process.exit(1);
    });
}

startServer();