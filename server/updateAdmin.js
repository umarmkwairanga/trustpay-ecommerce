import mongoose from 'mongoose';
import User from './models/User.js';
import 'dotenv/config';

async function setAdmin() {
    await mongoose.connect(process.env.MONGODB_URI);
    const email = "umarmuhammadkwairanga44@gmail.com"; // Replace with your email
    await User.findOneAndUpdate({ email }, { role: 'admin' });
    console.log(`User ${email} is now an admin!`);
    process.exit();
}

setAdmin();