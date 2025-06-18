import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    mongoose.connection.on('error', (err: Error) => {
        console.error(`MongoDB connection error: ${err.message}`);
    });
    mongoose.connection.on('connected', () => {
        console.log('MongoDB connected successfully');
    });
    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
    });

    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error("MONGODB_URI environment variable is not set");
    }

    await mongoose.connect(uri);
};

export { connectDB };