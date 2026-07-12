import express from 'express';
const router = express.Router();

// This handles the request sent to /api/bank/details
router.post('/details', async (req, res) => {
    try {
        const { bankName, accountNumber } = req.body;
        
        // Log to verify data arrived
        console.log('Bank Details Received:', { bankName, accountNumber });

        // Logic for DB saving would go here
        res.status(200).json({ message: 'Bank details received successfully!' });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ message: 'Server error saving details' });
    }
});

export default router;