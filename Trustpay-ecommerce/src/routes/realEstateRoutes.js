import express from 'express';
import { createListing, getAllListings, getMyListings } from '../controllers/realEstateController.js';
import { validateRealEstate } from '../middleware/realEstateValidation.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Order: Authenticate User -> Process Image -> Validate Body -> Save to DB
router.post('/add', 
    protect, 
    upload.single('image'), 
    validateRealEstate, 
    createListing
);

router.get('/', getAllListings);
router.get('/my-listings', protect, getMyListings);

export default router;