
import mongoose from 'mongoose';
import config from '.';

const MONGODB_URI = config.MONGODB_URI as string;

export const connectDB = async () => {
  try {
    // await mongoose.connect(MONGODB_URI);
    await mongoose.connect(MONGODB_URI, {
      family: 4, // Force IPv4
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

