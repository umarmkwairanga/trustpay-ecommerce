// backend/routes/partnerRoutes.js
const express = import('express');
const router = express.Router();
const { 
    registerPartner, 
    getPartners, 
    getPartnerProfile, 
    updateSettings 
} = import('../controllers/partnerController');

// POST: Register a new partner
router.post('/register', registerPartner);

// GET: Fetch partners (supports filtering by ?serviceType=...)
router.get('/', getPartners);

// GET: Fetch a single partner's profile for their Dashboard
router.get('/:id', getPartnerProfile);

// PUT: Update a partner's settings/profile
router.put('/:id/settings', updateSettings);

module.exports = router;