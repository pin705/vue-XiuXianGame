import { connectDB } from '../../../utils/db';
import Player from '../../../models/Player';
import { requireAuth } from '../../../utils/auth';
import { defineEventHandler, createError, readBody } from 'nitro/h3'

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    
    const userId = await requireAuth(event);
    const body = await readBody(event);
    const { equipment, slot } = body; // slot: 'weapon', 'armor', 'accessory', 'sutra'

    const player = await Player.findOne({ userId });

    if (!player) {
      throw createError({
        statusCode: 404,
        message: 'Không tìm thấy dữ liệu người chơi'
      });
    }

    // Tìm equipment trong inventory
    const equipIndex = player.inventory.findIndex(item => item.id === equipment.id);

    if (equipIndex === -1) {
      throw createError({
        statusCode: 404,
        message: 'Không tìm thấy trang bị'
      });
    }

    // Unequip current item nếu có
    if (player.equipment[slot] && Object.keys(player.equipment[slot]).length > 0) {
      const currentEquip = player.equipment[slot];
      
      // Remove stats
      if (currentEquip.attack) player.attack -= currentEquip.attack;
      if (currentEquip.defense) player.defense -= currentEquip.defense;
      if (currentEquip.health) {
        player.maxHealth -= currentEquip.health;
        player.health = Math.min(player.health, player.maxHealth);
      }
      if (currentEquip.dodge) player.dodge -= currentEquip.dodge;
      if (currentEquip.critical) player.critical -= currentEquip.critical;
      
      // Add back to inventory
      player.inventory.push(currentEquip);
    }

    // Equip new item
    const newEquip = player.inventory[equipIndex];
    
    // Apply stats
    if (newEquip.attack) player.attack += newEquip.attack;
    if (newEquip.defense) player.defense += newEquip.defense;
    if (newEquip.health) {
      player.maxHealth += newEquip.health;
      player.health += newEquip.health;
    }
    if (newEquip.dodge) player.dodge += newEquip.dodge;
    if (newEquip.critical) player.critical += newEquip.critical;

    // Set equipment
    player.equipment[slot] = newEquip;
    
    // Remove from inventory
    player.inventory.splice(equipIndex, 1);

    await player.save();

    return {
      success: true,
      message: `Đã trang bị ${newEquip.name}`,
      data: player
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    
    console.error('Equip error:', error);
    throw createError({
      statusCode: 500,
      message: 'Lỗi server'
    });
  }
});
