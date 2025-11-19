import { connectDB } from '../../utils/db';
import Player from '../../models/Player';
import { requireAuth } from '../../utils/auth';
import { defineEventHandler, readBody, createError } from "nitro/h3";

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    
    const userId = await requireAuth(event);
    const body = await readBody(event);

    const player = await Player.findOneAndUpdate(
      { userId },
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!player) {
      throw createError({
        statusCode: 404,
        message: 'Không tìm thấy dữ liệu người chơi'
      });
    }

    return {
      success: true,
      message: 'Cập nhật thành công',
      data: player
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    
    console.error('Update player error:', error);
    throw createError({
      statusCode: 500,
      message: 'Lỗi server'
    });
  }
});
