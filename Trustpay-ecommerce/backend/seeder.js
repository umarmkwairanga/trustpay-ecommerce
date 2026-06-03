const mongoose = require("mongoose");
const Product = require("./models/productModel");

const seedData = async () => {
  try {
    // Explicitly using the connection string to bypass .env issues
    await mongoose.connect("mongodb://127.0.0.1:27017/trustpay");
    
    await Product.deleteMany(); 
    await Product.insertMany([
      { name: "Smartphone", price: 500, description: "A high-end phone", countInStock: 10 },
      { name: "Laptop", price: 1200, description: "A powerful laptop", countInStock: 5 }
    ]);
    
    console.log("✅ Data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedData();