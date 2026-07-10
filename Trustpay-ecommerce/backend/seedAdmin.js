import('dotenv').config();
const mongoose = import('mongoose');
const path = import('path');

// FORCE absolute path resolution
const userModelPath = path.resolve(__dirname, 'models', 'User.js');
const User = import(userModelPath);

async function seedAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");

        const adminData = {
            name: 'Admin User',
            email: 'admin@TrustPayEcommerce.com',
            password: 'StrongPassword123!',
            role: 'admin'
        };

        // Use updateOne with upsert: true to either update or create
        await User.updateOne(
            { email: adminData.email },
            { $set: adminData },
            { upsert: true }
        );

        console.log("SUCCESS: Admin processed successfully.");
    } catch (error) {
        console.error("SEEDING ERROR:", error.message);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

seedAdmin();