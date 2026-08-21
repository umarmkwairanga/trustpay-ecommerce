import Flight from '../models/listings/Flight.js';
import HotelProperty from '../models/listings/HotelProperty.js';
import FoodItem from '../models/listings/FoodItem.js';
import Vehicle from '../models/listings/Vehicle.js';
import RealEstate from '../models/listings/RealEstate.js';
import Service from '../models/listings/Service.js';

// Map vertical names to their corresponding Mongoose models
const modelMap = {
  flight: Flight,
  hotel: HotelProperty,
  restaurant: FoodItem,
  vehicle: Vehicle,
  realestate: RealEstate,
  service: Service
};

// Create a new listing for any provider vertical
export const createListing = async (req, res) => {
  try {
    const { vertical } = req.params; // e.g., flight, hotel, restaurant, vehicle, realestate, service
    const Model = modelMap[vertical.toLowerCase()];

    if (!Model) {
      return res.status(400).json({ message: 'Invalid provider marketplace vertical.' });
    }

    const listingData = {
      ...req.body,
      provider: req.user._id
    };

    const newListing = await Model.create(listingData);
    res.status(201).json({ message: `${vertical} listing created successfully`, listing: newListing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all listings for the logged-in provider
export const getMyListings = async (req, res) => {
  try {
    const { vertical } = req.params;
    const Model = modelMap[vertical.toLowerCase()];

    if (!Model) {
      return res.status(400).json({ message: 'Invalid provider marketplace vertical.' });
    }

    const listings = await Model.find({ provider: req.user._id }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Public: Get all active listings across a vertical for the buyer marketplace
export const getMarketplaceListings = async (req, res) => {
  try {
    const { vertical } = req.params;
    const Model = modelMap[vertical.toLowerCase()];

    if (!Model) {
      return res.status(400).json({ message: 'Invalid marketplace vertical.' });
    }

    // Filter by active/available status depending on schema conventions
    const query = {};
    if (vertical === 'flight') query.status = 'scheduled';
    if (vertical === 'hotel') query.status = 'active';
    if (vertical === 'vehicle') query.status = 'available';
    if (vertical === 'realestate') query.status = 'available';
    if (vertical === 'service') query.status = 'active';
    if (vertical === 'restaurant') query.isAvailable = true;

    const listings = await Model.find(query).populate('provider', 'username businessName businessAddress phone');
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update listing
export const updateListing = async (req, res) => {
  try {
    const { vertical, id } = req.params;
    const Model = modelMap[vertical.toLowerCase()];

    if (!Model) return res.status(400).json({ message: 'Invalid vertical.' });

    const listing = await Model.findOne({ _id: id, provider: req.user._id });
    if (!listing) return res.status(404).json({ message: 'Listing not found or unauthorized.' });

    Object.assign(listing, req.body);
    await listing.save();

    res.json({ message: 'Listing updated successfully', listing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete listing
export const deleteListing = async (req, res) => {
  try {
    const { vertical, id } = req.params;
    const Model = modelMap[vertical.toLowerCase()];

    if (!Model) return res.status(400).json({ message: 'Invalid vertical.' });

    const listing = await Model.findOneAndDelete({ _id: id, provider: req.user._id });
    if (!listing) return res.status(404).json({ message: 'Listing not found or unauthorized.' });

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};