import Restaurant from '../models/Restaurant.js';

// 1. Get all restaurants (for the Food Marketplace page)
export const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({});
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ message: "Error fetching restaurants" });
    }
};

// 2. Get a specific restaurant menu
export const getMenu = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
        res.status(200).json(restaurant.menu);
    } catch (error) {
        res.status(500).json({ message: "Error fetching menu" });
    }
};

// 3. Add/Update a dish (for Restaurant owners)
export const updateMenu = async (req, res) => {
    try {
        const { menu } = req.body;
        const restaurant = await Restaurant.findOneAndUpdate(
            { ownerId: req.user.id },
            { menu },
            { new: true }
        );
        res.status(200).json({ message: "Menu updated", restaurant });
    } catch (error) {
        res.status(500).json({ message: "Error updating menu" });
    }
};