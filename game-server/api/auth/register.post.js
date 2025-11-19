import { connectDB } from '../../utils/db';
import User from '../../models/User';
import Player from '../../models/Player';
import { generateToken } from '../../utils/auth';
import { defineEventHandler, createError, readBody } from 'nitro/h3'

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    
    const body = await readBody(event);
    const { username, email, password } = body;

    // Validate input
    if (!username || !email || !password) {
      throw createError({
        statusCode: 400,
        message: 'Vui lòng điền đầy đủ thông tin'
      });
    }

    if (username.length < 3 || username.length > 20) {
      throw createError({
        statusCode: 400,
        message: 'Tên người chơi phải từ 3-20 ký tự'
      });
    }

    if (password.length < 6) {
      throw createError({
        statusCode: 400,
        message: 'Mật khẩu phải có ít nhất 6 ký tự'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: existingUser.username === username 
          ? 'Tên người chơi đã tồn tại' 
          : 'Email đã được sử dụng'
      });
    }

    // Create user
    const user = new User({
      username,
      email,
      password
    });

    await user.save();

    // Create player data
    const player = new Player({
      userId: user._id,
      name: username
    });

    await player.save();

    // Generate token
    const token = generateToken(user._id.toString());

    return {
      success: true,
      message: 'Đăng ký thành công',
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
    
    console.error('Register error:', error);
    throw createError({
      statusCode: 500,
      message: 'Lỗi server, vui lòng thử lại sau'
    });
  }
});
