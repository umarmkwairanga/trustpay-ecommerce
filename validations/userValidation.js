import Joi from 'joi';

export const registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(), // Add .pattern() for extra complexity if needed
    role: Joi.string().valid('user', 'admin').default('user')
});