import mongoose from "mongoose";

const connectDB = async () => {
try {
    
    const mongo = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB connected: ${mongo.connection.host}, ${mongo.connection.name}`);
} catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
}
};
export default connectDB;