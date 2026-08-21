import User from '../models/User.js';
import Flight from '../models/listings/Flight.js';
import HotelProperty from '../models/listings/HotelProperty.js';
import FoodItem from '../models/listings/FoodItem.js';
import Vehicle from '../models/listings/Vehicle.js';
import RealEstate from '../models/listings/RealEstate.js';
import Service from '../models/listings/Service.js';

// Admin: Get all providers pending verification or across all statuses
export const getAllProviders = async (req, res) => {
  try {
    const providers = await User.find({ 
      role: { $in: [
        'flight_provider', 
        'hotel_provider', 
        'restaurant_provider', 
        'vehicle_provider', 
        'real_estate_provider', 
        'service_provider'
      ]} 
    }).select('-password').sort({ createdAt: -1 });

    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Approve, reject, or suspend a provider
export const updateProviderStatus = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { status } = req.body; // 'approved' | 'rejected' | 'suspended'

    if (!['approved', 'rejected', 'suspended', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const provider = await User.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider account not found.' });
    }

    provider.status = status;
    await provider.save();

    res.json({ message: `Provider status updated to ${status} successfully`, provider });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CEO / Super Admin: Real database-backed multi-vertical analytics
export const getCEOAnalytics = async (req, res) => {
  try {
    const totalProviders = await User.countDocuments({ 
      role: { $regex: /provider/i } 
    });
    const pendingApprovals = await User.countDocuments({ 
      role: { $regex: /provider/i }, 
      status: 'pending' 
    });
    const activeProviders = await User.countDocuments({ 
      role: { $regex: /provider/i }, 
      status: 'approved' 
    });
    const suspendedProviders = await User.countDocuments({ 
      role: { $regex: /provider/i }, 
      status: 'suspended' 
    });

    const listingsByVertical = {
      flights: await Flight.countDocuments(),
      hotels: await HotelProperty.countDocuments(),
      restaurants: await FoodItem.countDocuments(),
      vehicles: await Vehicle.countDocuments(),
      realEstate: await RealEstate.countDocuments(),
      services: await Service.countDocuments()
    };

    res.json({
      summary: {
        totalProviders,
        activeProviders,
        pendingApprovals,
        suspendedProviders
      },
      listingsByVertical
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};