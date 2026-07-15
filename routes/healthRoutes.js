import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: dbStatus,
        uptime: process.uptime() + ' seconds'
    });
});

export default router;