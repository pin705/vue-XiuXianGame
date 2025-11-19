import { connectDB } from '../../../utils/db';
import Player from '../../../models/Player';
import { requireAuth } from '../../../utils/auth';
import { defineEventHandler, readBody, createError } from "nitro/h3";

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    
    const userId = await requireAuth(event);
    const body = await readBody(event);
    const { amount } = body;

    if (!amount || amount <= 0) {
      throw createError({
        statusCode: 400,
        message: 'Số lượng không hợp lệ'
      });
    }

    const player = await Player.findOne({ userId });

    if (!player) {
      throw createError({
        statusCode: 404,
        message: 'Không tìm thấy dữ liệu người chơi'
      });
    }

    // Kiểm tra đủ tu vi
    if (player.cultivation < amount) {
      throw createError({
        statusCode: 400,
        message: 'Tu vi không đủ để đột phá'
      });
    }

    // Logic đột phá
    const requiredCultivation = player.maxCultivation;
    
    if (player.cultivation >= requiredCultivation) {
      player.level += 1;
      player.cultivation -= requiredCultivation;
      player.maxCultivation = Math.floor(requiredCultivation * 1.5);
      
      // Tăng thuộc tính
      player.attack += Math.floor(player.attack * 0.1);
      player.defense += Math.floor(player.defense * 0.1);
      player.maxHealth += Math.floor(player.maxHealth * 0.15);
      player.health = player.maxHealth;
      
      await player.save();

      return {
        success: true,
        message: `Chúc mừng! Đã đột phá lên cảnh giới ${player.level}`,
        data: player
      };
    } else {
      throw createError({
        statusCode: 400,
        message: 'Tu vi chưa đủ để đột phá'
      });
    }
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    
    console.error('Cultivation breakthrough error:', error);
    throw createError({
      statusCode: 500,
      message: 'Lỗi server'
    });
  }
});
