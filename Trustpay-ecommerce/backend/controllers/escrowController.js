import Escrow from '../models/Escrow.js';
import Product from '../models/Product.js';
import User from '../models/User.js'; // Imported to look up buyer/seller numbers
import { generateTxRef } from '../utils/referenceGenerator.js';
import { sendSMS } from '../services/twilioService.js'; // Imported your Twilio service

// Helper to format local numbers (e.g., 0903... -> +234903...)
const formatPhoneNumber = (phone) => {
    if (phone && phone.startsWith('0')) {
        return '+234' + phone.substring(1);
    }
    return phone;
};

// Create a new Escrow transaction
export const createEscrow = async (req, res) => {
    try {
        const { orderId, productId, buyerId, sellerId, amount } = req.body;
        
        // Generate a unique transaction reference for Flutterwave
        const tx_ref = generateTxRef('TRUSTPAY');

        const newEscrow = await Escrow.create({ 
            orderId, 
            productId, 
            buyerId, 
            sellerId, 
            amount,
            tx_ref, 
            status: 'Pending' 
        });

        await Product.findByIdAndUpdate(productId, { status: 'escrowed' });
        
        // 💬 SMS Notification: Alert the Buyer that escrow is waiting for payment
        const buyer = await User.findById(buyerId);
        if (buyer && buyer.phoneNumber) {
            const formattedPhone = formatPhoneNumber(buyer.phoneNumber);
            await sendSMS(
                formattedPhone, 
                `Trustpay: Your escrow order for ₦${amount} has been initialized. Please complete your payment. Reference: ${tx_ref}`
            );
        }

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
export const getEscrowStatus = async (req, res) => {
    try {
        const escrow = await Escrow.findById(req.params.id)
            .populate('productId')
            .populate('orderId'); 
        
        if (!escrow) return res.status(404).json({ message: 'Escrow transaction not found' });
        res.status(200).json(escrow);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all escrows (Admin Only)
export const getAllEscrows = async (req, res) => {
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
export const releaseFunds = async (req, res) => {
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

        // 💬 SMS Notification: Alert the Seller that their money has been released!
        const seller = await User.findById(escrow.sellerId);
        if (seller && seller.phoneNumber) {
            const formattedPhone = formatPhoneNumber(seller.phoneNumber);
            await sendSMS(
                formattedPhone, 
                `Trustpay Escrow Alert: Your escrow funds of ₦${escrow.amount} have been successfully released to your wallet! 🚀`
            );
        }

        res.status(200).json({ 
            message: 'Funds released successfully!', 
            escrow 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};