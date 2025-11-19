import { connectDB } from '../../utils/db';
import User from '../../models/User';
import { generateToken } from '../../utils/auth';
import { defineEventHandler, createError, readBody } from 'nitro/h3'

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    
    const body = await readBody(event);
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      throw createError({
        statusCode: 400,
        message: 'Vui lòng điền đầy đủ thông tin'
      });
    }

    // Find user
    const user = await User.findOne({ username });

    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Tên đăng nhập hoặc mật khẩu không đúng'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        message: 'Tên đăng nhập hoặc mật khẩu không đúng'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id.toString());

    return {
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      }
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    
    console.error('Login error:', error);
    throw createError({
      statusCode: 500,
      message: 'Lỗi server, vui lòng thử lại sau'
    });
  }
});
