const Flight = require('../models/Flight');
const FlightBooking = require('../models/FlightBooking');

// 1. Search for available flights
exports.searchFlights = async (req, res) => {
  try {
    const { departureAirport, arrivalAirport, date, classType } = req.query;
    
    let query = {};
    if (departureAirport) query.departureAirport = departureAirport.toUpperCase();
    if (arrivalAirport) query.arrivalAirport = arrivalAirport.toUpperCase();
    if (classType) query.classType = classType;

    // Filter by date if provided (matching the departure day)
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      query.departureTime = { $gte: startOfDay, $lte: endOfDay };
    }

    const flights = await Flight.find(query);
    res.status(200).json({ success: true, count: flights.length, data: flights });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Book a flight and secure funds in Escrow
exports.bookFlight = async (req, res) => {
  try {
    const { flightId, passengers } = req.body;
    const buyerId = req.user._id; // Assumes auth middleware populates req.user

    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ success: false, message: 'Flight not found' });
    }

    if (flight.availableSeats < passengers.length) {
      return res.status(400).json({ success: false, message: 'Not enough seats available' });
    }

    const totalAmount = flight.price * passengers.length;

    // Create the flight booking with funds held in escrow
    const booking = await FlightBooking.create({
      flight: flightId,
      buyer: buyerId,
      passengers,
      totalAmount,
      escrowStatus: 'Held in Escrow',
      bookingStatus: 'Confirmed'
    });

    // Reduce available seats
    flight.availableSeats -= passengers.length;
    await flight.save();

    res.status(201).json({
      success: true,
      message: 'Flight booked successfully and funds secured in escrow.',
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Get user's flight bookings
exports.getUserFlightBookings = async (req, res) => {
  try {
    const bookings = await FlightBooking.find({ buyer: req.user._id })
      .populate('flight')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};