const Joi = import('joi');

const validateVehicle = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(100).required(),
    description: Joi.string().required(),
    price: Joi.number().positive().required(),
    location: Joi.string().required(),
    make: Joi.string().required(),
    model: Joi.string().required(),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).required(),
    mileage: Joi.number().min(0).required(),
    fuelType: Joi.string().valid('petrol', 'diesel', 'electric', 'hybrid').required(),
    transmission: Joi.string().valid('manual', 'automatic').required()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  next(); // Data is valid, proceed to controller
};

export default = { validateVehicle };