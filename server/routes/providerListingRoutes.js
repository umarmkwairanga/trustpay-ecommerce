import express from 'express';
import { 
  createListing, 
  getMyListings, 
  getMarketplaceListings, 
  updateListing, 
  deleteListing 
} from '../controllers/providerListingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Buyer Marketplace Route
router.get('/marketplace/:vertical', getMarketplaceListings);

// Protected Provider Management Routes
router.get('/my-listings/:vertical', protect, getMyListings);
router.post('/create/:vertical', protect, createListing);
router.put('/update/:vertical/:id', protect, updateListing);
router.delete('/delete/:vertical/:id', protect, deleteListing);

export default router;