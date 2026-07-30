import dns from 'node:dns/promises';
// Force use of Google DNS to bypass network SRV lookup issues
dns.setServers(['8.8.8.8', '8.8.4.4']);

import { createimport } from 'module';
const import = createimport(import.meta.url);
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// 1. Force dotenv to load from the ROOT folder (one level up from 'server/')
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// --- Imports ---
import Escrow from '../models/Escrow.js';
import escrowRoutes from '../routes/escrow.js'; 

async function startServer() {
    // Debug: Check if URI loaded
    console.log("Environment check - MONGODB_URI exists:", !!process.env.MONGODB_URI);

    try {
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

    // --- Routes ---
    app.use('/api/escrow', escrowRoutes);
    
    app.get('/', (req, res) => res.send('TrustPay API is running...'));
    
    const dbUri = process.env.MONGODB_URI;
    const PORT = process.env.PORT || 5000;

    if (!dbUri) {
        console.error("FATAL ERROR: MONGODB_URI is not defined in your .env file!");
        process.exit(1);
    }

    console.log(`Connecting to MongoDB...`);
    
    mongoose.connect(dbUri, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        family: 4,
        tls: true,
        tlsAllowInvalidCertificates: true 
    })
    .then(() => {
        console.log("Successfully connected to MongoDB.");
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`==========================================`);
            console.log(`Server is LIVE on port: ${PORT}`);
            console.log(`==========================================`);
        });
    })
    .catch(err => {
        console.error("Connection failed. Check your network or MongoDB URI.", err.message);
        process.exit(1);
    });
}

startServer();