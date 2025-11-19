import { computed } from 'vue';
import { usePlayerStore } from '@/stores/player';
import { useAuthStore } from '@/stores/auth';
import { useMainStore } from '@/stores/mainStore';
import gameActions from '@/utils/gameActions';

/**
 * Composable để quản lý game state và actions
 */
export function useGame() {
  const playerStore = usePlayerStore();
  const authStore = useAuthStore();
  const mainStore = useMainStore();

  // Computed properties
  const player = computed(() => playerStore.playerData || mainStore.getDefaultPlayer());
  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const isLoading = computed(() => playerStore.loading);

  // Actions
  const actions = {
    // Cultivation
    async cultivate(amount) {
      return await gameActions.updateCultivation(amount);
    },

    async breakthrough() {
      return await gameActions.breakthrough();
    },

    // Combat
    async fight(monsterData) {
      return await gameActions.fightMonster(monsterData);
    },

    // Resources
    async addMoney(amount) {
      return await gameActions.updateProps({ money: amount });
    },

    async addCurrency(amount) {
      return await gameActions.updateProps({ currency: amount });
    },

    async updateResources(resources) {
      return await gameActions.updateProps(resources);
    },

    // Inventory
    async addItem(item) {
      return await gameActions.addToInventory(item);
    },

    async removeItem(itemId, quantity = 1) {
      return await gameActions.removeFromInventory(itemId, quantity);
    },

    async useItem(itemId, quantity = 1) {
      // Logic sử dụng item
      const item = player.value.inventory.find(i => i.id === itemId);
      if (!item) return false;

      // Apply item effects
      if (item.type === 'cultivation_dan') {
        await this.cultivate(item.value * quantity);
      } else if (item.type === 'health_potion') {
        playerStore.playerData.health = Math.min(
          playerStore.playerData.maxHealth,
          playerStore.playerData.health + item.value * quantity
        );
      } else if (item.type === 'currency') {
        await this.addMoney(item.value * quantity);
      }

      return await gameActions.removeFromInventory(itemId, quantity);
    },

    // Equipment
    async equip(equipment, slot) {
      return await gameActions.equipItem(equipment, slot);
    },

    async unequip(slot) {
      const equipment = player.value.equipment[slot];
      if (!equipment || Object.keys(equipment).length === 0) return false;

      // Add to inventory
      playerStore.playerData.inventory.push(equipment);
      
      // Remove stats
      if (equipment.attack) playerStore.playerData.attack -= equipment.attack;
      if (equipment.defense) playerStore.playerData.defense -= equipment.defense;
      if (equipment.health) {
        playerStore.playerData.maxHealth -= equipment.health;
        playerStore.playerData.health = Math.min(
          playerStore.playerData.health,
          playerStore.playerData.maxHealth
        );
      }
      if (equipment.dodge) playerStore.playerData.dodge -= equipment.dodge;
      if (equipment.critical) playerStore.playerData.critical -= equipment.critical;

      // Clear slot
      playerStore.playerData.equipment[slot] = {};

      return await gameActions.saveToServer();
    },

    // Level & Score
    async levelUp() {
      playerStore.playerData.level += 1;
      return await gameActions.updateLevel(playerStore.playerData.level);
    },

    async addScore(points) {
      return await gameActions.updateScore(points);
    },

    // Save
    async save() {
      return await gameActions.saveToServer();
    },

    // Reload from server
    async reload() {
      return await playerStore.fetchPlayer();
    }
  };

  return {
    player,
    isAuthenticated,
    isLoading,
    ...actions
  };
}
