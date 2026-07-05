const express = import('express');
const router = express.Router();
const { atlasRequest } = import('../dbHelper');

router.post('/create', async (req, res) => {
    try {
        const result = await atlasRequest('insertOne', 'escrows', req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: "Escrow creation failed" });
    }
});

module.exports = router;