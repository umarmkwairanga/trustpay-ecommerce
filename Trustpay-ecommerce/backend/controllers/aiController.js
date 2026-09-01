const { generateAIResponse } = require('../services/aiService');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Dispute = require('../models/Dispute');
const AuditLog = require('../models/AuditLog');

// 1. Buyer AI Shopping Assistant
exports.buyerAssistant = async (req, res) => {
  try {
    const { query } = req.body;
    const products = await Product.find({ status: 'ACTIVE' }).limit(20).lean();

    const systemPrompt = `You are TrustPay AI Shopping Assistant for TrustPayEcommerce. Help the buyer find products, compare items, explain used-product disclosures, and answer order questions. Never invent products or make up fake information.`;
    
    const aiRes = await generateAIResponse(systemPrompt, query, { availableProducts: products });
    res.status(200).json(aiRes);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. Seller AI Listing & Used-Product Assistant
exports.sellerAssistant = async (req, res) => {
  try {
    const { query, productData } = req.body;
    const systemPrompt = `You are TrustPay AI Seller Assistant. Help sellers write descriptions, optimize titles, and ensure used-product disclosures (condition, age, defects, functional status, actual photos) are complete before publishing.`;
    
    const aiRes = await generateAIResponse(systemPrompt, query, { productDraft: productData });
    res.status(200).json(aiRes);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. AI Delivery Matching Assistant
exports.riderMatchAssistant = async (req, res) => {
  try {
    const { orderId, availableRiders } = req.body;
    const systemPrompt = `You are TrustPay AI Delivery Matching Assistant. Rank and recommend the most suitable available rider based on distance, vehicle type, rating, and workload. Provide a clear recommendation while preserving the mandatory rule that the rider MUST accept the request.`;
    
    const aiRes = await generateAIResponse(systemPrompt, 'Recommend the best rider for this delivery order.', { orderId, availableRiders });
    res.status(200).json(aiRes);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 4. CEO & Admin Executive Business Analyst
exports.executiveAssistant = async (req, res) => {
  try {
    const { query } = req.body;
    
    // Aggregate real platform data securely
    const totalOrders = await Order.countDocuments();
    const pendingDisputes = await Dispute.countDocuments({ status: 'PENDING' });
    
    const systemPrompt = `You are TrustPay AI Executive Business Assistant for CEO and Admin oversight. Analyze real platform data to answer revenue, order, marketplace, and operational questions. Never invent figures.`;
    
    const aiRes = await generateAIResponse(systemPrompt, query, { platformMetrics: { totalOrders, pendingDisputes } });
    res.status(200).json(aiRes);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};