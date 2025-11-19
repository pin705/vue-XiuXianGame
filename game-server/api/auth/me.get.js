import { connectDB } from '../../utils/db';
import User from '../../models/User';
import { requireAuth } from '../../utils/auth';
import { defineEventHandler, createError, readBody } from 'nitro/h3'

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    
    const userId = await requireAuth(event);
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'Không tìm thấy người dùng'
      });
    }

    return {
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          lastLogin: user.lastLogin
        }
      }
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    
    console.error('Me error:', error);
    throw createError({
      statusCode: 500,
      message: 'Lỗi server'
    });
  }
});
