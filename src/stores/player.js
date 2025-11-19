import { defineStore } from 'pinia';
import { useAuthStore } from './auth';

const API_BASE = '/api';

export const usePlayerStore = defineStore('player', {
  state: () => ({
    playerData: null,
    loading: false,
  }),

  actions: {
    async fetchPlayer() {
      const authStore = useAuthStore();
      
      try {
        this.loading = true;
        const response = await fetch(`${API_BASE}/player`, {
          headers: authStore.getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error('Không thể tải dữ liệu người chơi');
        }

        const data = await response.json();
        this.playerData = data.data;
        return data.data;
      } catch (error) {
        console.error('Fetch player error:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updatePlayer(updates) {
      const authStore = useAuthStore();
      
      try {
        const response = await fetch(`${API_BASE}/player`, {
          method: 'PUT',
          headers: authStore.getAuthHeaders(),
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          throw new Error('Không thể cập nhật dữ liệu');
        }

        const data = await response.json();
        this.playerData = data.data;
        return data.data;
      } catch (error) {
        console.error('Update player error:', error);
        throw error;
      }
    },

    async breakthrough(amount) {
      const authStore = useAuthStore();
      
      try {
        const response = await fetch(`${API_BASE}/player/cultivation/breakthrough`, {
          method: 'POST',
          headers: authStore.getAuthHeaders(),
          body: JSON.stringify({ amount }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Đột phá thất bại');
        }

        this.playerData = data.data;
        return data;
      } catch (error) {
        throw error;
      }
    },

    async fight(monsterData) {
      const authStore = useAuthStore();
      
      try {
        const response = await fetch(`${API_BASE}/player/combat/fight`, {
          method: 'POST',
          headers: authStore.getAuthHeaders(),
          body: JSON.stringify({ monsterData }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Chiến đấu thất bại');
        }

        this.playerData = data.data.player;
        return data.data;
      } catch (error) {
        throw error;
      }
    },

    // Sync local methods
    updateLocalProperty(key, value) {
      if (this.playerData) {
        this.playerData[key] = value;
      }
    },

    updateLocalProps(updates) {
      if (this.playerData) {
        Object.assign(this.playerData, updates);
      }
    },
  },

  persist: {
    key: 'player_cache',
    paths: ['playerData'],
    storage: localStorage,
  },
});
