const express = import('express');
const router = express.Router();
const transactionController = import('../controllers/transactionController');

// This matches the /api/transactions path in server.js
// So the full URL will be: /api/transactions/create
router.post('/create', transactionController.createTransaction);

export default router;