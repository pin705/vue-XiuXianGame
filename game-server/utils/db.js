import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    console.log('✓ Đã kết nối MongoDB');
    return;
  }

  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/xiuxian-game';
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log('✓ Kết nối MongoDB thành công');
  } catch (error) {
    console.error('✗ Lỗi kết nối MongoDB:', error);
    throw error;
  }
}

export default connectDB;
