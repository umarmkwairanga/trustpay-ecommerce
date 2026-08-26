import { z } from 'zod';

const realEstateSchema = z.object({
    title: z.string().min(5),
    price: z.number().positive(),
    bedrooms: z.number().int().positive(),
    propertyType: z.enum(['Apartment', 'House', 'Land', 'Commercial']),
    location: z.string().min(3),
});

export const validateRealEstate = (req, res, next) => {
    try {
        realEstateSchema.parse(req.body);
        next();
    } catch (error) {
        res.status(400).json({ errors: error.errors });
    }
};