const Booking = require('../models/Booking');
const mongoose = require('mongoose');

class BookingService {
  async checkAvailability(resourceId, bookingType, startDate, endDate, startTime, endTime) {
    const query = {
      resource: resourceId,
      bookingType,
      bookingStatus: { $nin: ['cancelled', 'refunded', 'completed'] }
    };

    if (startDate && endDate) {
      query.$or = [
        { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }
      ];
    } else if (startDate && startTime && endTime) {
      query.date = new Date(startDate);
      query.$or = [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ];
    }

    const existingBookings = await Booking.find(query);
    return existingBookings.length === 0;
  }

  async createBooking(data, session = null) {
    const isAvailable = await this.checkAvailability(
      data.resource,
      data.bookingType,
      data.startDate,
      data.endDate,
      data.startTime,
      data.endTime
    );

    if (!isAvailable) {
      throw new Error('Resource is already booked for the selected timeframe.');
    }

    const booking = new Booking(data);
    await booking.save({ session });
    return booking;
  }
}

module.exports = new BookingService();