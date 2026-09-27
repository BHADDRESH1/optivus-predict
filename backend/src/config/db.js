import mongoose from 'mongoose';

export const connectDB = async (mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI) => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  if (!mongoUri) {
    console.warn('MONGO_URI / MONGODB_URI is not defined. Running in offline/demo mode without MongoDB.');
    return;
  }
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.warn('MongoDB connection warning:', err.message);
  }
};
