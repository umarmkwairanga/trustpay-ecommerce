const ServiceCategoryRequest = require('../models/ServiceCategoryRequest');

// Service Provider submits a category request
exports.requestCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const existing = await ServiceCategoryRequest.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Category request already exists.' });
    }
    const categoryRequest = await ServiceCategoryRequest.create({
      provider: req.user._id,
      name,
      description
    });
    res.status(201).json({ message: 'Category requested successfully', categoryRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin reviews and approves/rejects category
exports.reviewCategoryRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, adminNotes } = req.body; // status: 'approved' | 'rejected'
    
    const request = await ServiceCategoryRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = status;
    request.adminNotes = adminNotes || '';
    request.reviewedBy = req.user._id;
    await request.save();

    res.json({ message: `Category request ${status}`, request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};