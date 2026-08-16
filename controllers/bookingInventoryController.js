const BookingItem = require('../models/BookingItem');
const BusinessProfile = require('../models/BusinessProfile');

// @desc    Create a new bookable item (Room, Table, Route, Ticket, Service, etc.)
// @route   POST /api/business/inventory
// @access  Private (Provider / Seller)
exports.createBookingItem = async (req, res) => {
  try {
    const business = await BusinessProfile.findOne({ user: req.user._id });
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business profile not found for this user.' });
    }

    if (business.verificationStatus !== 'verified') {
      return res.status(403).json({ success: false, message: 'Your business profile must be verified before adding inventory.' });
    }

    const {
      category,
      title,
      description,
      images,
      pricing,
      capacity,
      details,
      availabilityRules
    } = req.body;

    const newItem = await BookingItem.create({
      business: business._id,
      category,
      title,
      description,
      images,
      pricing,
      capacity,
      details,
      availabilityRules
    });

    res.status(201).json({
      success: true,
      message: 'Bookable item created successfully',
      item: newItem
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all bookable items for a specific business provider
// @route   GET /api/business/inventory
// @access  Private
exports.getProviderInventory = async (req, res) => {
  try {
    const business = await BusinessProfile.findOne({ user: req.user._id });
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business profile not found.' });
    }

    const items = await BookingItem.find({ business: business._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update a bookable item
// @route   PUT /api/business/inventory/:id
// @access  Private
exports.updateBookingItem = async (req, res) => {
  try {
    const business = await BusinessProfile.findOne({ user: req.user._id });
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business profile not found.' });
    }

    let item = await BookingItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Booking item not found.' });
    }

    // Ensure provider owns this item
    if (item.business.toString() !== business._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to edit this item.' });
    }

    item = await BookingItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Booking item updated successfully',
      item
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete a bookable item
// @route   DELETE /api/business/inventory/:id
// @access  Private
exports.deleteBookingItem = async (req, res) => {
  try {
    const business = await BusinessProfile.findOne({ user: req.user._id });
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business profile not found.' });
    }

    const item = await BookingItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Booking item not found.' });
    }

    if (item.business.toString() !== business._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this item.' });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Booking item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Public customer search & filter for bookable inventory (Hotels, Flights, Restaurants, etc.)
// @route   GET /api/bookings/search
// @access  Public
exports.searchBookableItems = async (req, res) => {
  try {
    const { category, city, keyword, minPrice, maxPrice } = req.query;
    
    let query = {};

    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query['pricing.basePrice'] = {};
      if (minPrice) query['pricing.basePrice'].$gte = Number(minPrice);
      if (maxPrice) query['pricing.basePrice'].$lte = Number(maxPrice);
    }
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    // Find items and populate associated business profile data (location, name, etc.)
    let items = await BookingItem.find(query).populate({
      path: 'business',
      match: city ? { 'location.city': { $regex: city, $options: 'i' }, isActive: true } : { isActive: true }
    });

    // Filter out items whose business didn't match the city query (since populate match returns null on non-matches)
    items = items.filter(item => item.business !== null);

    res.status(200).json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};