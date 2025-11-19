import { connectDB } from '../../../utils/db';
import Player from '../../../models/Player';
import { requireAuth } from '../../../utils/auth';
import { defineEventHandler, createError, readBody } from 'nitro/h3'

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    
    const userId = await requireAuth(event);
    const body = await readBody(event);
    const { itemId, quantity = 1 } = body;

    const player = await Player.findOne({ userId });

    if (!player) {
      throw createError({
        statusCode: 404,
        message: 'Không tìm thấy dữ liệu người chơi'
      });
    }

    // Tìm item trong inventory
    const itemIndex = player.inventory.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
      throw createError({
        statusCode: 404,
        message: 'Không tìm thấy vật phẩm'
      });
    }

    const item = player.inventory[itemIndex];

    // Kiểm tra số lượng
    if (item.quantity < quantity) {
      throw createError({
        statusCode: 400,
        message: 'Số lượng không đủ'
      });
    }

    // Logic sử dụng vật phẩm
    let effects = {};
    
    if (item.type === 'cultivation_dan') {
      effects.cultivation = item.value * quantity;
      player.cultivation += effects.cultivation;
    } else if (item.type === 'health_potion') {
      effects.health = item.value * quantity;
      player.health = Math.min(player.maxHealth, player.health + effects.health);
    } else if (item.type === 'currency') {
      effects.money = item.value * quantity;
      player.props.money += effects.money;
    }

    // Giảm số lượng hoặc xóa item
    if (item.quantity === quantity) {
      player.inventory.splice(itemIndex, 1);
    } else {
      player.inventory[itemIndex].quantity -= quantity;
    }

    await player.save();

    return {
      success: true,
      message: `Đã sử dụng ${item.name} x${quantity}`,
      data: {
        player,
        effects
      }
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    
    console.error('Use item error:', error);
    throw createError({
      statusCode: 500,
      message: 'Lỗi server'
    });
  }
});
