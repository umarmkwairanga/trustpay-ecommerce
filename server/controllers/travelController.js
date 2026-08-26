import TravelBooking from '../models/TravelBooking.js';
import Escrow from '../models/Escrow.js';

export const createTravelBooking = async (req, res) => {
    const { type, provider, details, totalAmount } = req.body;
    
    try {
        // 1. Create the booking entry
        const newBooking = await TravelBooking.create({
            user: req.user.id,
            type,
            provider,
            details,
            totalAmount
        });

        // 2. Create the corresponding Escrow record
        // We link this to the booking so we can release funds after check-out/arrival
        const newEscrow = await Escrow.create({
            order: newBooking._id, // References the booking ID
            orderModel: 'TravelBooking', // Polymorphic reference
            seller: provider, // In travel, the 'provider' is the seller
            sellerAmount: totalAmount * 0.95, // Example: 5% platform commission
            status: 'holding'
        });

        // 3. Update the booking with the escrow reference
        newBooking.escrow = newEscrow._id;
        await newBooking.save();

        res.status(201).json({
            message: "Booking successful, funds held in escrow",
            booking: newBooking
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to create travel booking", error: error.message });
    }
};