import { usePlayerStore } from '@/stores/player';
import { useAuthStore } from '@/stores/auth';

/**
 * Helper functions để đồng bộ game actions với server
 */

// Cập nhật cultivation
export async function updateCultivation(amount) {
  const playerStore = usePlayerStore();
  
  if (!playerStore.playerData) return false;
  
  playerStore.playerData.cultivation += amount;
  
  // Check breakthrough
  if (playerStore.playerData.cultivation >= playerStore.playerData.maxCultivation) {
    return await breakthrough();
  }
  
  return await saveToServer();
}

// Đột phá cảnh giới
export async function breakthrough() {
  const playerStore = usePlayerStore();
  
  try {
    const result = await playerStore.breakthrough(playerStore.playerData.cultivation);
    return result;
  } catch (error) {
    console.error('Breakthrough error:', error);
    return null;
  }
}

// Chiến đấu với quái vật
export async function fightMonster(monsterData) {
  const playerStore = usePlayerStore();
  
  try {
    const result = await playerStore.fight(monsterData);
    return result;
  } catch (error) {
    console.error('Fight error:', error);
    return null;
  }
}

// Cập nhật props (tiền, tài nguyên)
export async function updateProps(updates) {
  const playerStore = usePlayerStore();
  
  if (!playerStore.playerData) return false;
  
  Object.keys(updates).forEach(key => {
    if (playerStore.playerData.props[key] !== undefined) {
      playerStore.playerData.props[key] += updates[key];
    }
  });
  
  return await saveToServer();
}

// Thêm item vào inventory
export async function addToInventory(item) {
  const playerStore = usePlayerStore();
  
  if (!playerStore.playerData) return false;
  
  const existingItem = playerStore.playerData.inventory.find(i => i.id === item.id);
  
  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + (item.quantity || 1);
  } else {
    playerStore.playerData.inventory.push(item);
  }
  
  return await saveToServer();
}

// Xóa item khỏi inventory
export async function removeFromInventory(itemId, quantity = 1) {
  const playerStore = usePlayerStore();
  
  if (!playerStore.playerData) return false;
  
  const itemIndex = playerStore.playerData.inventory.findIndex(i => i.id === itemId);
  
  if (itemIndex === -1) return false;
  
  const item = playerStore.playerData.inventory[itemIndex];
  
  if (item.quantity <= quantity) {
    playerStore.playerData.inventory.splice(itemIndex, 1);
  } else {
    item.quantity -= quantity;
  }
  
  return await saveToServer();
}

// Trang bị equipment
export async function equipItem(equipment, slot) {
  const playerStore = usePlayerStore();
  
  if (!playerStore.playerData) return false;
  
  // Unequip current
  const currentEquip = playerStore.playerData.equipment[slot];
  if (currentEquip && Object.keys(currentEquip).length > 0) {
    // Remove stats
    applyEquipmentStats(currentEquip, false);
    // Add back to inventory
    playerStore.playerData.inventory.push(currentEquip);
  }
  
  // Equip new
  const itemIndex = playerStore.playerData.inventory.findIndex(i => i.id === equipment.id);
  if (itemIndex !== -1) {
    playerStore.playerData.inventory.splice(itemIndex, 1);
    playerStore.playerData.equipment[slot] = equipment;
    applyEquipmentStats(equipment, true);
  }
  
  return await saveToServer();
}

// Apply/remove equipment stats
function applyEquipmentStats(equipment, isAdd) {
  const playerStore = usePlayerStore();
  const multiplier = isAdd ? 1 : -1;
  
  if (equipment.attack) playerStore.playerData.attack += equipment.attack * multiplier;
  if (equipment.defense) playerStore.playerData.defense += equipment.defense * multiplier;
  if (equipment.health) {
    playerStore.playerData.maxHealth += equipment.health * multiplier;
    if (isAdd) playerStore.playerData.health += equipment.health;
    else playerStore.playerData.health = Math.min(playerStore.playerData.health, playerStore.playerData.maxHealth);
  }
  if (equipment.dodge) playerStore.playerData.dodge += equipment.dodge * multiplier;
  if (equipment.critical) playerStore.playerData.critical += equipment.critical * multiplier;
}

// Cập nhật level
export async function updateLevel(newLevel) {
  const playerStore = usePlayerStore();
  
  if (!playerStore.playerData) return false;
  
  playerStore.playerData.level = newLevel;
  
  return await saveToServer();
}

// Cập nhật score
export async function updateScore(points) {
  const playerStore = usePlayerStore();
  
  if (!playerStore.playerData) return false;
  
  playerStore.playerData.score += points;
  
  return await saveToServer();
}

// Helper để lưu lên server
async function saveToServer() {
  const playerStore = usePlayerStore();
  const authStore = useAuthStore();
  
  if (!authStore.isAuthenticated) return false;
  
  try {
    await playerStore.updatePlayer(playerStore.playerData);
    return true;
  } catch (error) {
    console.error('Save to server error:', error);
    return false;
  }
}

// Export tất cả
export default {
  updateCultivation,
  breakthrough,
  fightMonster,
  updateProps,
  addToInventory,
  removeFromInventory,
  equipItem,
  updateLevel,
  updateScore,
  saveToServer
};
