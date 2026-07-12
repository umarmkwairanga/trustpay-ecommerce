import RealEstate from '../models/RealEstate.js';

export const createListing = async (req, res) => {
    try {
        // 1. Prepare data
        const listingData = {
            ...req.body,
            // 2. Attach the path of the uploaded file
            image: req.file ? req.file.path : null,
            // 3. Associate with the user from your auth middleware
            owner: req.user ? req.user.id : null 
        };

        const newListing = new RealEstate(listingData);
        await newListing.save();

        res.status(201).json({ 
            message: "Listing created successfully", 
            data: newListing 
        });
    } catch (error) {
        console.error("Listing Creation Error:", error);
        res.status(500).json({ 
            error: "Failed to save listing", 
            details: error.message 
        });
    }
};