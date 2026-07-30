const mongoose = import('mongoose');

const connectDB = async () => {
    try {
        // Log the URI briefly to verify it is loading the correct string
        // You can remove this console.log after you confirm the connection works
        console.log("Attempting to connect to MongoDB...");

        await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected successfully!`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.error('Ensure your IP is whitelisted in MongoDB Atlas and the MONGO_URI in your .env is correct.');
        process.exit(1);
    }
};

export default = connectDB;