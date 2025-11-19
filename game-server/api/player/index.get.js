import { connectDB } from '../../utils/db';
import Player from '../../models/Player';
import { requireAuth } from '../../utils/auth';
import { defineEventHandler, readBody, createError } from "nitro/h3";

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    
    const userId = await requireAuth(event);
    
    const player = await Player.findOne({ userId });
    
    if (!player) {
      throw createError({
        statusCode: 404,
        message: 'Không tìm thấy dữ liệu người chơi'
      });
    }

    return {
      success: true,
      data: player
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    
    console.error('Get player error:', error);
    throw createError({
      statusCode: 500,
      message: 'Lỗi server'
    });
  }
});
