import Livestock from '../models/Livestock.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// @desc    Create a new livestock listing
// @route   POST /api/livestock
// @access  Private (Seller/Farmer)
export const createLivestock = async (req, res) => {
  try {
    // Attach logged-in seller ID from auth middleware
    req.body.seller = req.user._id;

    const livestock = await Livestock.create(req.body);

    res.status(201).json({
      success: true,
      data: livestock,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all livestock with multi-attribute filtering, search, and pagination
// @route   GET /api/livestock
// @access  Public
export const getLivestock = async (req, res) => {
  try {
    const {
      search,
      subcategory,
      breed,
      state,
      minPrice,
      maxPrice,
      minWeight,
      maxWeight,
      gender,
      page = 1,
      limit = 12,
      sort = '-createdAt',
    } = req.query;

    let query = { status: 'available' };

    // Text search (Title, Description, Breed)
    if (search) {
      query.$text = { $search: search };
    }

    // Category & Breed filters
    if (subcategory) query.subcategory = subcategory.toLowerCase();
    if (breed) query.breed = new RegExp(breed, 'i');
    if (gender) query.gender = gender;
    if (state) query['location.state'] = new RegExp(state, 'i');

    // Price range filter
    if (minPrice || maxPrice) {
      query.pricePerUnit = {};
      if (minPrice) query.pricePerUnit.$gte = Number(minPrice);
      if (maxPrice) query.pricePerUnit.$lte = Number(maxPrice);
    }

    // Weight range filter
    if (minWeight || maxWeight) {
      query['weight.value'] = {};
      if (minWeight) query['weight.value'].$gte = Number(minWeight);
      if (maxWeight) query['weight.value'].$lte = Number(maxWeight);
    }

    // Pagination calculations
    const skip = (Number(page) - 1) * Number(limit);

    const livestockList = await Livestock.find(query)
      .populate('seller', 'name email phone avatar')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Livestock.countDocuments(query);

    res.status(200).json({
      success: true,
      count: livestockList.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: livestockList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single livestock item by ID
// @route   GET /api/livestock/:id
// @access  Public
export const getLivestockById = async (req, res) => {
  try {
    const item = await Livestock.findById(req.params.id).populate(
      'seller',
      'name email phone avatar'
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Livestock listing not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid ID format or server error.',
    });
  }
};

// @desc    Update livestock listing
// @route   PUT /api/livestock/:id
// @access  Private (Owner/Seller only)
export const updateLivestock = async (req, res) => {
  try {
    let item = await Livestock.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Listing not found.' });
    }

    // Verify ownership
    if (item.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this listing.',
      });
    }

    item = await Livestock.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete livestock listing
// @route   DELETE /api/livestock/:id
// @access  Private (Owner/Seller or Admin)
export const deleteLivestock = async (req, res) => {
  try {
    const item = await Livestock.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Listing not found.' });
    }

    if (item.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this listing.',
      });
    }

    await item.deleteOne();

    res.status(200).json({ success: true, message: 'Listing deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate AI description for livestock
// @route   POST /api/livestock/generate-description
// @access  Private (Seller)
export const generateLivestockDescription = async (req, res) => {
  try {
    const { subcategory, breed, age, weight, gender, healthNotes } = req.body;

    if (!subcategory || !breed) {
      return res.status(400).json({ 
        success: false, 
        message: 'Subcategory and breed are required to generate a description.' 
      });
    }

    // Initialize the AI model
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Construct the prompt using the seller's inputs
    const prompt = `Write a professional, compelling, and honest e-commerce product description for a livestock listing. 
    Here are the details:
    - Type: ${subcategory}
    - Breed: ${breed}
    - Age: ${age?.value ? `${age.value} ${age.unit}` : 'Unspecified'}
    - Weight: ${weight?.value ? `${weight.value} ${weight.unit}` : 'Unspecified'}
    - Gender: ${gender || 'Unspecified'}
    - Health/Vaccination Notes: ${healthNotes || 'No specific health notes provided'}

    Write exactly 2 short, persuasive paragraphs highlighting its quality and value for a potential buyer. Make it sound professional for an agricultural marketplace. Do not use asterisks or markdown formatting.`;

    const result = await model.generateContent(prompt);
    const generatedText = result.response.text();

    res.status(200).json({
      success: true,
      data: generatedText.trim(),
    });
  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate description. Please try writing one manually.' 
    });
  }
};