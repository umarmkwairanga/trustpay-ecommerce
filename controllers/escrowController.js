import mongoose from 'mongoose';
import axios from 'axios';
import Escrow from '../models/Escrow.js';
import Order from '../models/Order.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

// Helper to map Bank Names to Flutterwave Bank Codes
const getBankCode = (bankName) => {
    const bankCodes = {
        "Access Bank": "044",
        "GTBank": "058",
        "Zenith Bank": "057",
        "First Bank": "011",
        "UBA": "033",
        "EcoBank": "050"
        // Add more banks as needed
    };
    return bankCodes[bankName] || null;
};

// 1. Create Escrow
export const createEscrow = async (req, res) => {
    try {
        const { order, buyer, seller, amount, commission, sellerAmount } = req.body;
        
        const escrow = await Escrow.create({
            order,
            buyer,
            seller,
            amount,
            commission,
            sellerAmount,
            status: 'holding'
        });

        res.status(201).json({ message: "Funds secured in escrow", escrow });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Release Escrow with Automated Payout
export const releaseEscrow = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const escrow = await Escrow.findById(id).populate('seller').session(session);
        
        if (!escrow) throw new Error("Escrow not found");
        if (escrow.status !== 'holding') throw new Error("Funds already released or refunded");
        
        // Use the helper to get the code from the bankName
        const bankCode = getBankCode(escrow.seller.bankName);
        if (!bankCode || !escrow.seller.accountNumber) {
            throw new Error("Seller bank details incomplete or bank not supported");
        }

        // Trigger Flutterwave Payout
        const flwResponse = await axios.post('https://api.flutterwave.com/v3/transfers', {
            account_bank: bankCode,
            account_number: escrow.seller.accountNumber,
            amount: escrow.sellerAmount,
            currency: "NGN",
            narration: `Payout for Order ${escrow.order}`,
            reference: `TP-${escrow._id}`,
            beneficiary_name: escrow.seller.accountName
        }, {
            headers: { Authorization: `Bearer ${process.env.FLW_SECRET_KEY}` }
        });

        // Update records
        escrow.status = 'released';
        escrow.releasedAt = new Date();
        escrow.releasedBy = userId;
        await escrow.save({ session });

        await Order.findByIdAndUpdate(escrow.order, { status: 'completed' }, { session });

        await Transaction.create([{
            user: escrow.seller._id,
            order: escrow.order,
            type: 'release',
            amount: escrow.sellerAmount,
            status: 'successful',
            transferReference: flwResponse.data.data.id
        }], { session });

        await session.commitTransaction();
        res.json({ message: "Funds released and payout initiated", escrow });
        
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ error: error.message });
    } finally {
        session.endSession();
    }
};

// 3. Dispute Escrow
export const disputeEscrow = async (req, res) => {
    try {
        const { id } = req.params;
        const escrow = await Escrow.findByIdAndUpdate(id, { status: 'disputed' }, { new: true });
        
        if (escrow) {
            await Order.findByIdAndUpdate(escrow.order, { status: 'disputed' });
        }
        
        res.json({ message: "Escrow disputed. Admin notified.", escrow });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Get all Escrows
export const getAllEscrows = async (req, res) => {
    try {
        const escrows = await Escrow.find()
            .populate('order')
            .populate('buyer', 'name email')
            .populate('seller', 'name email bankName accountName accountNumber')
            .sort({ createdAt: -1 });
            
        res.json(escrows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};