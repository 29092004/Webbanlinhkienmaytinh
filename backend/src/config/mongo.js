import mongoose from 'mongoose';

export const connectMongo = async () => {
    const mongoUri = process.env.MONGODB_URI?.trim();

    if (!mongoUri) {
        console.warn('MONGODB_URI is not configured. Support chat history will be unavailable.');
        return false;
    }

    try {
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('Kết nối MongoDB thành công');
        return true;
    } catch (error) {
        console.error('Lỗi MongoDB:', error.message);
        return false;
    }
};

export default mongoose;
