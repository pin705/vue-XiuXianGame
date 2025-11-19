import { defineStore } from 'pinia';
import { usePlayerStore } from './player';
import { useAuthStore } from './auth';

// Wrapper store để tương thích với code cũ
export const useMainStore = defineStore('main', {
  state: () => ({
    isReady: false,
    boss: {
      name: '',
      text: '',
      time: 0,
      desc: '',
      level: 0,
      dodge: 0,
      attack: 0,
      health: 0,
      conquer: false,
      defense: 0,
      critical: 0,
      maxhealth: 0,
    },
    monster: {
      name: '',
      health: 0,
      attack: 0,
      defense: 0,
      dodge: 0,
      critical: 0,
    },
    mapData: {
      y: 0,
      x: 0,
      map: [],
    },
    mapScroll: 0,
    fishingMap: [],
  }),

  getters: {
    // Proxy player data từ playerStore
    player() {
      const playerStore = usePlayerStore();
      return playerStore.playerData || this.getDefaultPlayer();
    },
  },

  actions: {
    getDefaultPlayer() {
      return {
        id: null,
        zc: false,
        age: 1,
        pet: {},
        time: 0,
        name: 'Người chơi',
        dark: false,
        npcs: [],
        wife: {},
        pets: [],
        wifes: [],
        props: {
          money: 0,
          flying: 0,
          qingyuan: 0,
          rootBone: 0,
          currency: 0,
          cultivateDan: 0,
          strengtheningStone: 0,
        },
        score: 0,
        level: 0,
        dodge: 0,
        points: 0,
        attack: 10,
        health: 100,
        critical: 0,
        defense: 10,
        mana: 0,
        taskNum: 0,
        version: 0.97,
        currency: 0,
        maxHealth: 100,
        inventory: [],
        isNewbie: false,
        shopData: [],
        equipment: {
          sutra: {},
          armor: {},
          weapon: {},
          accessory: {},
        },
        achievement: {
          pet: [],
          monster: [],
          equipment: [],
        },
        script: '',
        cultivation: 0,
        currentTitle: null,
        reincarnation: 0,
        maxCultivation: 100,
        backpackCapacity: 50,
        sellingEquipmentData: [],
        highestTowerFloor: 1,
        rewardedTowerFloors: [],
        nextGameTimes: {
          rps: null,
          dice: null,
          fortune: null,
          secretrealm: 0,
          gamblingStone: null,
        },
        gameWins: 0,
        gameLosses: 0,
        checkinDays: 0,
        checkinStreak: 0,
        lastCheckinDate: null,
        fortuneTellingDate: null,
        statusEffects: [],
        cultivationPath: {
          path: null,
          pathLevel: 0,
          pathExp: 0,
          maxPathExp: 100,
          skills: [],
          artifacts: [],
          bonuses: {
            attackPower: 0,
            defensePower: 0,
            criticalChance: 0,
            dodgeChance: 0,
            manaGainRate: 0,
            craftingSuccessRate: 0,
          },
        },
        map: {
          currentArea: null,
          playerPosition: { x: 50, y: 50 },
          beasts: [],
          path: [],
          detectionRadius: 5,
          baseMovementSpeed: 10,
          maxMovementSpeed: 15,
          autoBattle: {
            isActive: false,
            lastMoveTime: null,
            lastPathUpdate: null,
            accumulatedRewards: {
              spiritualEnergy: 0,
              money: 0,
              items: [],
            },
          },
          visualEffects: { auraOpacity: 0, glow: false },
        },
      };
    },

    async init() {
      const authStore = useAuthStore();
      const playerStore = usePlayerStore();

      try {
        // Kiểm tra authentication
        if (authStore.isAuthenticated) {
          await authStore.fetchUser();
          await playerStore.fetchPlayer();
        }
        this.isReady = true;
      } catch (error) {
        console.error('Init error:', error);
        this.isReady = true;
      }
    },

    // Wrapper methods để tương thích với code cũ
    async savePlayerData() {
      const playerStore = usePlayerStore();
      if (playerStore.playerData) {
        await playerStore.updatePlayer(playerStore.playerData);
      }
    },

    // Import/Export vẫn dùng local (backup)
    importData(data) {
      const file = data.file;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          localStorage.setItem('vuex', e.target.result);
          location.reload(1);
        } catch (err) {
          console.error('Import error:', err);
        }
      };
      reader.readAsText(file);
    },

    exportData() {
      const playerStore = usePlayerStore();
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const hours = String(today.getHours()).padStart(2, '0');
      const minutes = String(today.getMinutes()).padStart(2, '0');
      const seconds = String(today.getSeconds()).padStart(2, '0');

      const exportData = {
        player: playerStore.playerData,
        boss: this.boss,
        version: '0.97',
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json;charset=utf-8',
      });

      const name = `Tu-Tien-${year}${month}${day}${hours}${minutes}${seconds}-v0.97.json`;
      
      // Import saveAs if needed
      import('file-saver').then(({ saveAs }) => {
        saveAs(blob, name);
      });
    },
  },

  persist: {
    key: 'main_cache',
    paths: ['boss', 'monster', 'mapData'],
    storage: localStorage,
  },
});
