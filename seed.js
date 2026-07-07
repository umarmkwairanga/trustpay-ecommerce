import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/Escrow.js'User.js'; // Ensure this path matches your folder structure

// Replace with your MongoDB connection string if different
const MONGO_URI = 'mongodb://localhost:27017/trustpay';

const seedAdmin = async () => {
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
        process.exit();
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedAdmin();