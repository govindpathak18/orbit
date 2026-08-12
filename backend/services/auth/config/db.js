import mongoose from 'mongoose';
const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL || process.env.MONGODB_URI;

    if (!mongoUrl) {
      throw new Error("MONGODB_URL is not configured");
    }

    await mongoose.connect(mongoUrl);
    console.log('🎉 MongoDB connected successfully');
  }catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;