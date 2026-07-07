import User from '../models/User.js';

// Controller to update seller banking info
export const updateProfile = async (req, res) => {
    try {
        const { bankName, accountName, accountNumber } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id, 
            { bankName, accountName, accountNumber }, 
            { new: true, runValidators: true }
        );
        
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.json({ message: "Profile updated successfully", updatedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// If you have a getProfile function, add it here too:
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};