import Joi from 'joi';

export const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const message = error.details.map(i => i.message).join(',');
            return res.status(400).json({ error: message });
        }
        next();
    };
};