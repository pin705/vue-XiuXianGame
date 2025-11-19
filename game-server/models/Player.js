import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Thuộc tính cơ bản
  name: { type: String, default: 'Người chơi' },
  age: { type: Number, default: 1 },
  level: { type: Number, default: 0 },
  reincarnation: { type: Number, default: 0 },
  
  // Điểm thuộc tính
  score: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  
  // Thuộc tính chiến đấu
  attack: { type: Number, default: 10 },
  defense: { type: Number, default: 10 },
  health: { type: Number, default: 100 },
  maxHealth: { type: Number, default: 100 },
  dodge: { type: Number, default: 0 },
  critical: { type: Number, default: 0 },
  mana: { type: Number, default: 0 },
  
  // Tu luyện
  cultivation: { type: Number, default: 0 },
  maxCultivation: { type: Number, default: 100 },
  
  // Tài nguyên
  props: {
    money: { type: Number, default: 0 },
    currency: { type: Number, default: 0 },
    flying: { type: Number, default: 0 },
    qingyuan: { type: Number, default: 0 },
    rootBone: { type: Number, default: 0 },
    cultivateDan: { type: Number, default: 0 },
    strengtheningStone: { type: Number, default: 0 }
  },
  
  // Túi đồ
  inventory: { type: Array, default: [] },
  backpackCapacity: { type: Number, default: 50 },
  
  // Trang bị
  equipment: {
    weapon: { type: Object, default: {} },
    armor: { type: Object, default: {} },
    accessory: { type: Object, default: {} },
    sutra: { type: Object, default: {} }
  },
  
  // Thành tựu
  achievement: {
    pet: { type: Array, default: [] },
    monster: { type: Array, default: [] },
    equipment: { type: Array, default: [] }
  },
  
  // Con đường tu luyện
  cultivationPath: {
    path: { type: String, default: null },
    pathLevel: { type: Number, default: 0 },
    pathExp: { type: Number, default: 0 },
    maxPathExp: { type: Number, default: 100 },
    skills: { type: Array, default: [] },
    artifacts: { type: Array, default: [] },
    bonuses: {
      attackPower: { type: Number, default: 0 },
      defensePower: { type: Number, default: 0 },
      criticalChance: { type: Number, default: 0 },
      dodgeChance: { type: Number, default: 0 },
      manaGainRate: { type: Number, default: 0 },
      craftingSuccessRate: { type: Number, default: 0 }
    }
  },
  
  // Thú cưng và NPC
  pet: { type: Object, default: {} },
  pets: { type: Array, default: [] },
  wife: { type: Object, default: {} },
  wifes: { type: Array, default: [] },
  npcs: { type: Array, default: [] },
  
  // Game progress
  taskNum: { type: Number, default: 0 },
  currentTitle: { type: String, default: null },
  isNewbie: { type: Boolean, default: false },
  
  // Bản đồ
  map: {
    currentArea: { type: String, default: null },
    playerPosition: {
      x: { type: Number, default: 50 },
      y: { type: Number, default: 50 }
    },
    beasts: { type: Array, default: [] },
    path: { type: Array, default: [] },
    detectionRadius: { type: Number, default: 5 },
    baseMovementSpeed: { type: Number, default: 10 },
    maxMovementSpeed: { type: Number, default: 15 },
    autoBattle: {
      isActive: { type: Boolean, default: false },
      lastMoveTime: { type: Date, default: null },
      lastPathUpdate: { type: Date, default: null },
      accumulatedRewards: {
        spiritualEnergy: { type: Number, default: 0 },
        money: { type: Number, default: 0 },
        items: { type: Array, default: [] }
      }
    },
    visualEffects: {
      auraOpacity: { type: Number, default: 0 },
      glow: { type: Boolean, default: false }
    }
  },
  
  // Tower
  highestTowerFloor: { type: Number, default: 1 },
  rewardedTowerFloors: { type: Array, default: [] },
  
  // Mini games
  nextGameTimes: {
    rps: { type: Date, default: null },
    dice: { type: Date, default: null },
    fortune: { type: Date, default: null },
    secretrealm: { type: Number, default: 0 },
    gamblingStone: { type: Date, default: null }
  },
  gameWins: { type: Number, default: 0 },
  gameLosses: { type: Number, default: 0 },
  
  // Check-in
  checkinDays: { type: Number, default: 0 },
  checkinStreak: { type: Number, default: 0 },
  lastCheckinDate: { type: Date, default: null },
  
  // Khác
  statusEffects: { type: Array, default: [] },
  shopData: { type: Array, default: [] },
  sellingEquipmentData: { type: Array, default: [] },
  script: { type: String, default: '' },
  dark: { type: Boolean, default: false },
  time: { type: Number, default: 0 },
  version: { type: Number, default: 0.97 }
}, {
  timestamps: true
});

// Index để tìm kiếm nhanh
playerSchema.index({ userId: 1 });
playerSchema.index({ level: -1 });
playerSchema.index({ score: -1 });

export default mongoose.model('Player', playerSchema);
