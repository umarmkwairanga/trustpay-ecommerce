import User from '../models/User.js';

// Controller to add points to a user's account
export const addLoyaltyPoints = async (userId, orderTotal) => {
    try {
        // Calculate 10% of order total as points
        const pointsEarned = Math.floor(orderTotal * 0.1);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $inc: { 'loyalty.points': pointsEarned },
                $push: { 
                    'loyalty.history': { 
                        pointsEarned, 
                        date: new Date() 
                    } 
                }
            },
            { new: true }
        );

        // Check if user should level up
        await checkAndUpgradeTier(userId, updatedUser.loyalty.points);

        return pointsEarned;
    } catch (error) {
        console.error('Error adding loyalty points:', error);
        throw error;
    }
};

// Helper function to handle tier logic
const checkAndUpgradeTier = async (userId, totalPoints) => {
    let newTier = 'BRONZE';
    if (totalPoints > 1000) newTier = 'GOLD';
    else if (totalPoints > 500) newTier = 'SILVER';

    await User.findByIdAndUpdate(userId, { 'loyalty.tier': newTier });
};