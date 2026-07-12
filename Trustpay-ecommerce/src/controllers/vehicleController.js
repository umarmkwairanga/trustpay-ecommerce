const Vehicle = require('../models/Vehicle');

exports.createVehicle = async (req, res) => {
  try {
    const { title, description, price, make, model, year, mileage, fuelType, transmission } = req.body;
    
    const newVehicle = await Vehicle.create({
      title,
      description,
      price,
      sellerId: req.user.id, // Assuming auth middleware provides req.user
      make,
      model,
      year,
      mileage,
      fuelType,
      transmission,
      location: req.body.location
    });

    res.status(201).json({ success: true, data: newVehicle });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};