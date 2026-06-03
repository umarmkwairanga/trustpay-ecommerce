const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // This connects directly to your local database
    const conn = await mongoose.connect("mongodb://127.0.0.1:27017/trustpay");
    
    console.log(`📡 MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database Link Failure: ${error.message}`);
    process.exit(1); // This stops the app if the database fails to connect
  }
};

module.exports = connectDB;