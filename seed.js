import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

const MONGO_URI = 'mongodb://localhost:27017/TrustPayEcommerce';

const seedAdmin = async () => {
    console.log("Starting seed script...");
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB...");
        const hashedPassword = await bcrypt.hash('Umarmk01', 10);
        await User.create({
            email: 'umarmuhammadkwairanga44@gmail.com',
            password: hashedPassword,
            role: 'admin'
        });
        console.log("Admin user created successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};
seedAdmin();
