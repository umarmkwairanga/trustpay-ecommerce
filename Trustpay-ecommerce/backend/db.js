const mongoose = require('mongoose');

const connectDB = async () => {
    console.log("DEBUG: Attempting connection to MongoDB...");
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000 // Wait 10 seconds before failing
        });
        console.log("--- SUCCESS: MongoDB Connected! ---");
    } catch (err) {
        console.error("--- FATAL ERROR: MongoDB Connection Failed ---");
        console.error("Error Name:", err.name);
        console.error("Error Message:", err.message);
    }
};

module.exports = connectDB;