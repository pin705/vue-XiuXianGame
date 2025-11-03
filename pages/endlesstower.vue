<template>
  <div class="endless-tower">
    <div class="battle-info">
      <div class="player-info">
        <tag
          class="name"
          type="primary"
          @click="openInfo('player')"
          v-text="player.name"
        />
        <el-progress
          :percentage="playerProgress"
          :status="playerStatus"
          :format="playerHealth"
          :stroke-width="20"
          text-inside
        />
      </div>
      <div class="vs">
        VS
      </div>
      <div
        class="monster-info"
        v-if="monster"
      >
        <tag
          class="name"
          type="danger"
          @click="openInfo('monster')"
        >
          {{ monster.name }}
        </tag>
        <el-progress
          :percentage="monsterProgress"
          :status="monsterStatus"
          :format="monsterhealth"
          :stroke-width="20"
          text-inside
        />
      </div>
    </div>
    <div class="actions">
      <el-button
        v-for="(item, index) in buttonData"
        :key="index"
        @click="item.click"
        :disabled="item.disabled"
        v-text="item.text"
      />
    </div>
    <div class="sweep-info">
      <el-row>
        <el-col
          :span="6"
          v-for="(item, index) in sweepData"
          :key="index"
        >
          <div class="el-statistic">
            <div
              class="el-statistic__head"
              v-text="item.name"
            />
            <div class="el-statistic__content">
              <span
                class="el-statistic__number"
                v-text="item.suffix"
              />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <LogPanel
      :texts="battleLogs"
      ref="scrollbar"
    />
  </div>
</template>

<script setup>
import LogPanel from "~/components/LogPanel.vue";
import tag from "~/components/tag.vue";
import { checkAchievements } from "~/composables/achievementChecker";
import boss from "~/composables/boss";
import { Combat } from "~/composables/combat";
import equip from "~/composables/equip";
import monsters from "~/composables/monster";
import { useMainStore } from "~/stores/main";
import {
    computed,
    getCurrentInstance,
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
} from "vue";
import { useRouter } from "vue-router";

// Store and router
const store = useMainStore();
const router = useRouter();

const instance = getCurrentInstance();
const globalProperties = instance.appContext.config.globalProperties;
const { $formatNumberToChineseUnit, $levels, $genre, $confirm, $notifys } =
  globalProperties;

// Reactive state
const player = ref(store.player);
const monster = ref(null);
const sweepTime = ref(0);
const battleLogs = ref([]);
const currentFloor = ref(
  player.value.highestTowerFloor > 1 ? player.value.highestTowerFloor - 1 : 1
);
const isSweeping = ref(false);
const sweepResults = ref({
  expGain: 0,
  moneyGain: 0,
  equipmentGained: 0,
});
const playerStatus = ref("success");
const monsterStatus = ref("success");
const sweepInterval = ref(null);
const isAutoFighting = ref(false);
const autoFightInterval = ref(null);
const sweepFightInterval = ref(null);

// Computed properties
const sweepData = computed(() => [
  { name: "Thời gian càn quét", suffix: formatTime(sweepTime.value) },
  {
    name: "Tu vi nhận được",
    suffix: `${$formatNumberToChineseUnit(sweepResults.value.expGain)} điểm`,
  },
  {
    name: "Linh thạch nhận được",
    suffix: `${$formatNumberToChineseUnit(sweepResults.value.moneyGain)} khối`,
  },
  {
    name: "Trang bị nhận được",
    suffix: `${$formatNumberToChineseUnit(
      sweepResults.value.equipmentGained
    )} món`,
  },
]);

const buttonData = computed(() => [
  {
    text: isAutoFighting.value ? "Dừng đối chiến" : "Chiến đấu tự động",
    click: toggleAutoFight,
    disabled: isSweeping.value || player.value.health <= 0,
  },
  {
    text: "Tiến hành đối chiến",
    click: fight,
    disabled:
      isSweeping.value ||
      isAutoFighting.value ||
      !monster.value ||
      player.value.health <= 0,
  },
  {
    text: isSweeping.value ? "Dừng càn quét" : "Bắt đầu càn quét",
    click: toggleSweep,
    disabled: isAutoFighting.value || player.value.health <= 0,
  },
  { text: "Rút lui động phủ", click: retreat, disabled: false },
]);

const playerProgress = computed(
  () => (player.value.health / player.value.maxHealth) * 100
);
const monsterProgress = computed(() =>
  monster.value ? (monster.value.health / monster.value.maxHealth) * 100 : 0
);

// Methods
const playerHealth = () => {
  const { health, maxHealth } = player.value;
  return `${Math.max(0, health)} / ${Math.max(0, maxHealth)}`;
};

const monsterhealth = () => {
  if (!monster.value) return "0 / 0";
  const { health, maxHealth } = monster.value;
  return `${Math.max(0, health)} / ${Math.max(0, maxHealth)}`;
};

const getStatus = (health, maxHealth) => {
  const num = (health / maxHealth) * 100;
  return num >= 70 ? "success" : num >= 30 ? "warning" : "exception";
};

const generateMonster = () => {
  const level = currentFloor.value * 2;
  const health = monsters.monster_Health(level);
  monster.value = {
    name: monsters.monster_Names(level),
    level,
    dodge: monsters.monster_Criticalhitrate(level),
    attack: monsters.monster_Attack(level),
    health,
    defense: monsters.monster_Defense(level),
    maxHealth: health,
    critical: monsters.monster_Criticalhitrate(level),
  };
  battleLogs.value.push({
    message: `Bạn đã gặp người thủ hộ tầng này <span class="text-red-400">${monster.value.name}</span>`,
    time: new Date().toLocaleTimeString(),
  });
};

const openInfo = (type) => {
  const isPlayer = type === "player";
  const info = isPlayer ? player.value : monster.value;
  $confirm("", isPlayer ? player.value.name : info.name, {
    center: true,
    message: `<div class="monsterinfo">
        <div class="monsterinfo-box">
          <p>Khí huyết: ${$formatNumberToChineseUnit(info.health)}</p>
          <p>Công kích: ${$formatNumberToChineseUnit(info.attack)}</p>
          <p>Phòng thủ: ${$formatNumberToChineseUnit(info.defense)}</p>
          <p>Tỷ lệ né tránh: ${
            info.dodge > 0
              ? info.dodge * 100 > 100
                ? 100
                : (info.dodge * 100).toFixed(2)
              : 0
          }%</p>
          <p>Tỷ lệ bạo kích: ${
            info.critical > 0
              ? info.critical * 100 > 100
                ? 100
                : (info.critical * 100).toFixed(2)
              : 0
          }%</p>
        </div>
      </div>`,
    showCancelButton: false,
    confirmButtonText: "Đã hiểu",
    dangerouslyUseHTMLString: true,
  }).catch(() => {});
};

const fight = () => {
  if (player.value.health <= 0) {
    handlePlayerDefeat();
    return;
  }
  if (!monster.value || monster.value.health <= 0) {
    generateMonster();
    return;
  }

  const playerAttacker = new Combat(store.player, monster.value);
  const playerAttackerResult = playerAttacker.autoCombatRound();
  battleLogs.value.push(...playerAttackerResult.message)
  if (monster.value.health <= 0) {
    handleMonsterDefeat();
    return;
  }

  const monsterAttacker = new Combat(store.player, monster.value);
  const monsterAttackerResult = monsterAttacker.autoCombatRound();
  battleLogs.value.push(...monsterAttackerResult.message);

  if (player.value.health <= 0) {
    handlePlayerDefeat();
  }
};

const handleMonsterDefeat = () => {
  const expGain = Math.floor(monster.value.level * 100);
  const moneyGain = Math.floor(monster.value.level * 2);
  player.value.cultivation += expGain;
  player.value.props.money += moneyGain;
  battleLogs.value.push({
    message: `Bạn đã đánh bại ${monster.value.name}!`,
    time: new Date().toLocaleTimeString(),
  });
  battleLogs.value.push({
    message: `Nhận được ${expGain} điểm tu vi và ${moneyGain} linh thạch`,
    time: new Date().toLocaleTimeString(),
  });
  getRandomEquipment();
  currentFloor.value++;
  if (
    currentFloor.value % 5 === 0 &&
    !player.value.rewardedTowerFloors.includes(currentFloor.value)
  ) {
    player.value.props.cultivateDan += 500;
    player.value.rewardedTowerFloors.push(currentFloor.value);
    battleLogs.value.push({
      message: `Chúc mừng bạn đã vượt qua tầng ${currentFloor.value}, nhận thêm phần thưởng: 500 đan bồi dưỡng!`,
      time: new Date().toLocaleTimeString(),
    });
  }
  if (currentFloor.value > player.value.highestTowerFloor) {
    player.value.highestTowerFloor = currentFloor.value;
  }
  battleLogs.value.push({
    message: `Vượt qua tầng ${
      currentFloor.value - 1
    } thành công, tự động tiến đến tầng ${currentFloor.value}`,
    time: new Date().toLocaleTimeString(),
  });
  generateMonster();
};

const handlePlayerDefeat = () => {
  battleLogs.value.push({
    message: "Bạn đã bị đánh bại! Thử thách kết thúc.",
    time: new Date().toLocaleTimeString(),
  });
  battleLogs.value.push({
    message: `${monster.value.name}: ${
      boss.drawPrize(monster.value.level).text
    }`,
    time: new Date().toLocaleTimeString(),
  });
  isAutoFighting.value = false;
  isSweeping.value = false;
  stopAutoFight();
  stopSweep();
};

const toggleAutoFight = () => {
  isAutoFighting.value = !isAutoFighting.value;
  if (isAutoFighting.value) {
    autoFightInterval.value = setInterval(fight, 1000);
  } else {
    stopAutoFight();
  }
};

const stopAutoFight = () => {
  clearInterval(autoFightInterval.value);
  autoFightInterval.value = null;
};

const retreat = () => {
  isAutoFighting.value = false;
  isSweeping.value = false;
  stopAutoFight();
  stopSweep();
  router.push("/home");
};

const getRandomEquipment = () => {
  let equipItem = {};
  let exp = Math.floor(player.value.maxCultivation / 100);
  exp = exp ? exp : 1;
  const randomInt = equip.getRandomInt(1, 4);
  if (randomInt === 1) equipItem = equip.equip_Weapons(player.value.level);
  else if (randomInt === 2) equipItem = equip.equip_Armors(player.value.level);
  else if (randomInt === 3)
    equipItem = equip.equip_Accessorys(player.value.level);
  else if (randomInt === 4) equipItem = equip.equip_Sutras(player.value.level);
  battleLogs.value.push({
    message: `Bạn phát hiện một rương báu, mở ra nhận được ${
      $levels[equipItem.quality]
    } ${equipItem.name} (${$genre[equipItem.type]})`,
    time: new Date().toLocaleTimeString(),
  });
  if (player.value.inventory.length >= player.value.backpackCapacity) {
    battleLogs.value.push({
      message: `Dung lượng túi trang bị hiện tại đã đầy, trang bị này tự động bị bỏ, chuyển sinh có thể tăng dung lượng túi`,
      time: new Date().toLocaleTimeString(),
    });
  } else {
    player.value.inventory.push(equipItem);
  }
};

const toggleSweep = () => {
  isSweeping.value = !isSweeping.value;
  if (isSweeping.value) {
    sweepTime.value = 0;
    sweepResults.value = { expGain: 0, moneyGain: 0, equipmentGained: 0 };
    sweepInterval.value = setInterval(sweep, 1000);
    sweepFightInterval.value = setInterval(sweepFight, 30000);
  } else {
    stopSweep();
  }
};

const stopSweep = () => {
  clearInterval(sweepInterval.value);
  clearInterval(sweepFightInterval.value);
  sweepInterval.value = null;
  sweepFightInterval.value = null;
};

const sweep = () => {
  sweepTime.value++;
  if (sweepTime.value % 60 === 0) {
    battleLogs.value.push({
      message: `Kết quả càn quét: Hiện đã càn quét ${formatTime(
        sweepTime.value
      )}, chúc mừng bạn nhận được ${sweepResults.value.expGain} điểm tu vi, ${
        sweepResults.value.moneyGain
      } linh thạch và ${sweepResults.value.equipmentGained} món trang bị.`,
      time: new Date().toLocaleTimeString(),
    });
  }
};

const sweepFight = () => {
  const expGain = Math.floor(currentFloor.value * 10);
  const moneyGain = Math.floor(currentFloor.value * 10);
  player.value.cultivation += expGain;
  player.value.props.money += moneyGain;
  player.value.jishaNum++;
  sweepResults.value.expGain += expGain;
  sweepResults.value.moneyGain += moneyGain;
  const equipmentGained = Math.random() < 0.1;
  if (equipmentGained) {
    getRandomEquipment();
    sweepResults.value.equipmentGained++;
  }
  battleLogs.value.push({
    message: `Kết quả càn quét: Chúc mừng bạn nhận được ${expGain} điểm tu vi, ${moneyGain} khối linh thạch${
      equipmentGained ? " và 1 món trang bị" : "."
    }`,
    time: new Date().toLocaleTimeString(),
  });
};

const formatTime = (seconds) => {
  if (seconds < 60) {
    return `${seconds} giây`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} phút ${remainingSeconds} giây`;
  } else {
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${hours} giờ ${minutes} phút ${remainingSeconds} giây`;
  }
};

// Lifecycle hooks
onMounted(() => {
  // Initialize player data
  player.value = store.player;
  // Check achievements
  const newAchievements = checkAchievements(player.value, "monster");
  newAchievements.forEach((achievement) => {
    $notifys({
      title: "Gợi ý nhận thành tựu",
      message: `Chúc mừng bạn đã hoàn thành thành tựu ${achievement.name}`,
    });
  });
  // Initialize current floor
  currentFloor.value =
    player.value.highestTowerFloor > 1 ? player.value.highestTowerFloor - 1 : 1;
  // Initialize battle log
  battleLogs.value.push({
    message: `Chào mừng đến với Vô Tận Tháp, đây là tầng ${currentFloor.value} của Vô Tận Tháp, kỷ lục leo tháp cao nhất của bạn là ${player.value.highestTowerFloor} tầng`,
    time: new Date().toLocaleTimeString(),
  });
  // Generate initial monster
  generateMonster();
});

onBeforeUnmount(() => {
  stopAutoFight();
  stopSweep();
});

// Watchers
watch(
  () => player.value.health,
  (val) => {
    const { health, maxHealth } = player.value;
    playerStatus.value = getStatus(health, maxHealth);
  }
);

watch(
  () => monster.value?.health,
  (val) => {
    if (monster.value) {
      const { health, maxHealth } = monster.value;
      monsterStatus.value = getStatus(health, maxHealth);
    }
  }
);
</script>

<style scoped>
.battle-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.player-info,
.monster-info {
  width: 45%;
}

.name {
  margin-bottom: 10px;
}

.vs {
  font-size: 24px;
  font-weight: bold;
  color: var(--el-color-info);
}

.actions {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
}

.actions .el-button {
  flex: 1;
  margin: 0 5px;
}

.sweep-info {
  margin: 20px 0;
}

.sweep-info p {
  margin: 5px 0;
  font-size: 14px;
}

.battle-log {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
}

.battle-log p {
  margin: 5px 0;
  font-size: 14px;
  color: var(--el-color-info);
}

@media (max-width: 768px) {
  .player-info,
  .monster-info {
    width: 100%;
    margin-bottom: 20px;
  }

  .vs {
    margin: 0 10px;
  }

  .actions {
    flex-wrap: wrap;
  }

  .actions .el-button {
    flex: 1 0 40%;
    margin: 5px;
  }
}
</style>
