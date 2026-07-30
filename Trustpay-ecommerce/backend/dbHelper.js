const mongoose = import('mongoose');

const connectDB = async () => {
    // Hardcode the string here temporarily to verify it works
    const uri = "mongodb://Umarmk01:YOUR_PASSWORD@ac-4c4oalj-shard-00-00.qcsvwc2.mongodb.net:27017,ac-4c4oalj-shard-00-01.qcsvwc2.mongodb.net:27017,ac-4c4oalj-shard-00-02.qcsvwc2.mongodb.net:27017/?ssl=true&replicaSet=atlas-lazzf4-shard-0&authSource=admin&appName=Cluster0";

    try {
        await mongoose.connect(uri, {
            // These two settings are CRITICAL to stop SRV lookups
            directConnection: false,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Successfully connected to MongoDB");
    } catch (err) {
        console.error("Connection failed:", err);
    }
};

export default = { connectDB };