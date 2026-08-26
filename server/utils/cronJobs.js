// utils/cronJobs.js
import cron from 'node-cron';
import TravelBooking from '../models/TravelBooking.js';
import Escrow from '../models/Escrow.js';

export const scheduleEscrowRelease = () => {
    // Runs every day at 12:00 AM
    cron.schedule('0 0 * * *', async () => {
        const now = new Date();
        
        // Find bookings that are 'confirmed' and past their check-out/flight date
        const expiredBookings = await TravelBooking.find({
            status: 'confirmed',
            $or: [
                { 'details.checkOut': { $lt: now } },
                { 'details.flightDate': { $lt: now } }
            ]
        });

        for (const booking of expiredBookings) {
            // Update Escrow status to 'ready-to-release'
            await Escrow.findOneAndUpdate(
                { order: booking._id },
                { status: 'ready-to-release' }
            );
            
            // Update booking status
            booking.status = 'completed';
            await booking.save();
        }
    });
};