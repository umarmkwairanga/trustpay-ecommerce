const Flight = require('../models/listings/Flight');
const HotelProperty = require('../models/listings/HotelProperty');
const FoodItem = require('../models/listings/FoodItem');
const Vehicle = require('../models/listings/Vehicle');
const RealEstate = require('../models/listings/RealEstate');
const Service = require('../models/listings/Service');
const User = require('../models/User');

exports.getCEOMarketplaceAnalytics = async (req, res) => {
  try {
    const totalProviders = await User.countDocuments({ role: { $regex: /provider/ } });
    const pendingApprovals = await User.countDocuments({ status: 'pending' });

    const counts = {
      flights: await Flight.countDocuments(),
      hotels: await HotelProperty.countDocuments(),
      restaurants: await FoodItem.countDocuments(),
      vehicles: await Vehicle.countDocuments(),
      realEstate: await RealEstate.countDocuments(),
      services: await Service.countDocuments()
    };

    res.json({
      totalProviders,
      pendingApprovals,
      listingsCountByVertical: counts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};