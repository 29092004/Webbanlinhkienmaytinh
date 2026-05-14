import mongoose from 'mongoose';
import dotenv from 'dotenv'

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Kết nối MongoDB thành công');
    } catch (error) {
        console.log('Lỗi MongoDB:', error.message);
    }
};

export default connectMongoDB;
