import User from '../models/User.js';

// Controller to update user settings
export const updateUserSettings = async (req, res) => {
  try {
    const { 
      fullName, 
      idNumber, 
      idType, 
      paymentDetails, 
      preferences, 
      is2FAEnabled 
    } = req.body;

    // Find the user by ID (assuming you have auth middleware providing req.user.id)
    const userId = req.user.id; 

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          fullName,
          'paymentDetails.bankName': paymentDetails?.bankName,
          'paymentDetails.accountNumber': paymentDetails?.accountNumber,
          'paymentDetails.accountHolderName': paymentDetails?.accountHolderName,
          idNumber,
          idType,
          is2FAEnabled,
          'preferences.smsAlerts': preferences?.smsAlerts,
          'preferences.emailUpdates': preferences?.emailUpdates,
          kycStatus: idNumber ? 'pending' : 'unverified' // Auto-set status
        }
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Settings updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating settings", error: error.message });
  }
};