const express = import('express');
const router = express.Router();
const { atlasRequest } = import('../dbHelper');

router.post('/update', async (req, res) => {
    const result = await atlasRequest('insertOne', 'deliveries', req.body);
    res.json(result);
});
export default router;