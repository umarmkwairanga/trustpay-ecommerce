const Escrow = require('../models/Escrow');
const Product = require('../models/Product');
const { generateTxRef } = require('../utils/referenceGenerator');

// Create a new Escrow transaction
exports.createEscrow = async (req, res) => {
    try {
        const { orderId, productId, buyerId, sellerId, amount } = req.body;
        
        // Generate a unique transaction reference for Flutterwave
        const tx_ref = generateTxRef('TRUSTPAY');

        const newEscrow = await Escrow.create({ 
            orderId, // Added orderId link
            productId, 
            buyerId, 
            sellerId, 
            amount,
            tx_ref, 
            status: 'Pending' 
        });

        await Product.findByIdAndUpdate(productId, { status: 'escrowed' });
        
        res.status(201).json({ 
            message: "Escrow initialized", 
            tx_ref, 
            escrow: newEscrow 
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get escrow details
exports.getEscrowStatus = async (req, res) => {
    try {
        const escrow = await Escrow.findById(req.params.id)
            .populate('productId')
            .populate('orderId'); // Populated for better frontend visibility
        
        if (!escrow) return res.status(404).json({ message: 'Escrow transaction not found' });
        res.status(200).json(escrow);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all escrows (Admin Only)
exports.getAllEscrows = async (req, res) => {
    try {
        const escrows = await Escrow.find()
            .populate('productId')
            .populate('orderId');
        res.status(200).json(escrows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Release funds (Admin/System Only)
exports.releaseFunds = async (req, res) => {
    try {
        const { escrowId } = req.params;

        const escrow = await Escrow.findByIdAndUpdate(
            escrowId, 
            { status: 'Completed' }, 
            { new: true }
        );

        if (!escrow) {
            return res.status(404).json({ message: 'Escrow transaction not found' });
        }

        // Update the associated product status
        await Product.findByIdAndUpdate(escrow.productId, { status: 'sold' });

        res.status(200).json({ 
            message: 'Funds released successfully!', 
            escrow 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};