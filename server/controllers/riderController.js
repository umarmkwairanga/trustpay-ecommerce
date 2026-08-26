import Rider from '../models/Rider.js';

export const updateRiderLocation = async (req, res) => {
    const { riderId, lat, lng } = req.body;

    try {
        const rider = await Rider.findOneAndUpdate(
            { _id: riderId },
            { 
                currentLocation: { 
                    type: 'Point', 
                    coordinates: [lng, lat] 
                } 
            },
            { new: true }
        );

        res.status(200).json({ message: "Location updated", location: rider.currentLocation });
    } catch (error) {
        res.status(500).json({ message: "Update failed", error: error.message });
    }
};