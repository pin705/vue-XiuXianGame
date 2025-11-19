// Auto-save plugin cho player store
import { watch } from 'vue';
import { usePlayerStore } from '@/stores/player';
import { useAuthStore } from '@/stores/auth';

let saveTimeout = null;
const SAVE_DELAY = 2000; // 2 giây debounce

export function setupAutoSave() {
  const playerStore = usePlayerStore();
  const authStore = useAuthStore();

  // Watch player data changes
  watch(
    () => playerStore.playerData,
    (newData) => {
      if (!authStore.isAuthenticated || !newData) return;

      // Debounce save
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }

      saveTimeout = setTimeout(async () => {
        try {
          await playerStore.updatePlayer(newData);
          console.log('✓ Auto-saved player data');
        } catch (error) {
          console.error('✗ Auto-save failed:', error);
        }
      }, SAVE_DELAY);
    },
    { deep: true }
  );
}

// Manual save function
export async function savePlayerData() {
  const playerStore = usePlayerStore();
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated || !playerStore.playerData) {
    return;
  }

  try {
    await playerStore.updatePlayer(playerStore.playerData);
    return true;
  } catch (error) {
    console.error('Save error:', error);
    return false;
  }
}
