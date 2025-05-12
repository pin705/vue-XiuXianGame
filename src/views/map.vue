<template>
  <div class="mb-4">
    <h2 class="text-2xl font-bold mb-2">
      {{ currentArea?.name || "Chưa chọn khu vực" }}
    </h2>
    <canvas
      ref="mapCanvas"
      height="500"
      width="450"
    />
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    <div class="p-4 rounded shadow">
      <h3 class="text-xl font-semibold mb-2">
        Thông Tin Tu Sĩ
      </h3>
      <p>Khí Huyết: {{ player.health }} / {{ player.maxHealth }}</p>
      <p>Linh Thạch: {{ player.props.money }}</p>
      <p>Cảnh Giới: {{ player.cultivationPath.realm }} ({{ player.cultivationPath.realmLevel }})</p>
      <p>
        Linh Lực: {{ player.cultivationPath.spiritualEnergy }} /
        {{ player.cultivationPath.maxSpiritualEnergy }}
      </p>
      <p>
        Tọa Độ: ({{ player.map.playerPosition.x.toFixed(1) }},
        {{ player.map.playerPosition.y.toFixed(1) }})
      </p>
      <p>Dị Hỏa: {{ player.differentFlames.length ? player.differentFlames.map(f => f.name).join(', ') : 'Chưa có' }}</p>
      <p>Tông Môn: {{ player.sect ? player.sect.name : 'Vô Môn Phái' }}</p>
    </div>
    <div class="p-4 rounded shadow">
      <h3 class="text-xl font-semibold mb-2">
        Nhật Ký Chiến Đấu
      </h3>
      <div class="h-40 overflow-y-auto border p-2">
        <p
          v-for="(log, index) in battleLogs"
          :key="index"
        >
          {{ log }}
        </p>
      </div>
    </div>
  </div>
  <div class="p-4 rounded shadow">
    <h3 class="text-xl font-semibold mb-2">
      Điều Khiển
    </h3>
    <div class="flex flex-wrap gap-2 mb-2">
      <select
        v-model="selectedArea"
        class="border p-2 rounded"
      >
        <option
          v-for="area in areas"
          :value="area.id"
          :key="area.id"
        >
          {{ area.name }} (Cảnh giới yêu cầu: {{ area.realmRequired }})
        </option>
      </select>
      <button
        @click="enterArea"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        :disabled="!selectedArea"
      >
        Vào Bí Cảnh
      </button>
      <button
        @click="toggleAutoBattle"
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        :disabled="!player.map.currentArea"
      >
        {{ player.map.autoBattle.isActive ? "Dừng Luyện Công" : "Bật Luyện Công" }}
      </button>
      <button
        @click="useElixir"
        class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        :disabled="!player.inventory.find(i => i.type === 'elixir')"
      >
        Dùng Đan Dược
      </button>
      <button
        v-for="skill in player.fightSkills"
        :key="skill.id"
        @click="useSkill(skill)"
        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        :disabled="skill.cooldown > 0 || player.cultivationPath.spiritualEnergy < skill.energyCost"
      >
        {{ skill.name }} ({{ skill.cooldown > 0 ? skill.cooldown + 's' : 'Sẵn sàng' }})
      </button>
    </div>
    <p v-if="player.map.autoBattle.isActive">
      Luyện công tại {{ currentArea?.name }}... Phần thưởng:
      {{ player.map.autoBattle.accumulatedRewards.spiritualEnergy }} linh lực,
      {{ player.map.autoBattle.accumulatedRewards.money }} linh thạch
    </p>
  </div>
</template>

<script setup>
import { useMainStore } from "@/plugins/store";
import { computed, onMounted, reactive, ref } from "vue";

// Khởi tạo store và player
const player = useMainStore().player;

// Cấu hình player ban đầu
player.avatar = new Image();
player.avatar.src =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=55&h=55";

// Cấu hình cảnh giới tu luyện
const realms = [
  { name: "Luyện Khí", maxSpiritualEnergy: 100, maxHealth: 100, attack: 10, defense: 5 },
  { name: "Trúc Cơ", maxSpiritualEnergy: 200, maxHealth: 150, attack: 15, defense: 8 },
  { name: "Kim Đan", maxSpiritualEnergy: 500, maxHealth: 300, attack: 25, defense: 12 },
  { name: "Nguyên Anh", maxSpiritualEnergy: 1000, maxHealth: 500, attack: 40, defense: 20 },
];

// Cấu hình Dị Hỏa
const differentFlames = [
  { id: "qinglian", name: "Thanh Liên Địa Tâm Hỏa", attackBoost: 20, healthBoost: 50, chance: 0.01 },
  { id: "jinglian", name: "Tịnh Liên Yêu Hỏa", attackBoost: 50, healthBoost: 100, chance: 0.005 },
];

// Cấu hình đấu kỹ
const fightSkills = [
  {
    id: "buddha_flame",
    name: "Phật Nộ Hỏa Liên",
    damageMultiplier: 2.5,
    energyCost: 50,
    cooldown: 0,
    maxCooldown: 10,
    effect: { type: "fire_explosion", radius: 10, color: "rgba(255, 100, 50, 0.8)" },
    sound: "skill_buddha_flame.mp3",
  },
  {
    id: "flame_wave",
    name: "Diễm Phân Phệ Lãng Thước",
    damageMultiplier: 1.8,
    energyCost: 30,
    cooldown: 0,
    maxCooldown: 5,
    effect: { type: "wave", radius: 8, color: "rgba(200, 50, 50, 0.7)" },
    sound: "skill_flame_wave.mp3",
  },
];

// Cấu hình âm thanh
const sounds = {
  normal_attack: new Audio("https://example.com/normal_attack.mp3"), // Thay bằng URL thật
  critical_hit: new Audio("https://example.com/critical_hit.mp3"),
  beast_defeated: new Audio("https://example.com/beast_defeated.mp3"),
  skill_buddha_flame: new Audio("https://example.com/skill_buddha_flame.mp3"),
  skill_flame_wave: new Audio("https://example.com/skill_flame_wave.mp3"),
};

// Khởi tạo dữ liệu player
player.cultivationPath = {
  realm: realms[0].name,
  realmLevel: 1,
  spiritualEnergy: 0,
  maxSpiritualEnergy: realms[0].maxSpiritualEnergy,
};
player.differentFlames = [];
player.fightSkills = fightSkills;
player.sect = null;
player.inventory = [
  { id: "healing_elixir", name: "Hồi Khí Đan", type: "elixir", effect: { health: 50 }, quantity: 2 },
];
player.health = realms[0].maxHealth;
player.maxHealth = realms[0].maxHealth;
player.attack = realms[0].attack;
player.defense = realms[0].defense;
player.map.baseMovementSpeed = 10;
player.map.maxMovementSpeed = 15;

// Cấu hình khu vực (bí cảnh)
const areas = reactive([
  {
    id: "dark_forest",
    name: "Hắc Phong Lâm",
    realmRequired: "Luyện Khí",
    description: "Rừng sâu ẩn chứa ma thú và linh thảo quý hiếm.",
    mapSize: { width: 100, height: 100 },
    maxBeasts: 5,
    beastTypes: [
      {
        id: "shadow_wolf",
        name: "Hắc Phong Lang",
        avatar: new Image(),
        health: 60,
        attack: 8,
        defense: 4,
        speed: 5, // Tốc độ di chuyển
        detectionRadius: 10, // Tầm phát hiện người chơi
        rewards: {
          spiritualEnergy: 15,
          money: 10,
          dropItems: [
            { id: "wolf_core", name: "Tinh Hạch Hắc Lang", chance: 0.3 },
            { id: "spirit_grass", name: "Huyền Linh Thảo", chance: 0.2 },
            { id: "qinglian", name: "Thanh Liên Địa Tâm Hỏa", chance: 0.01 },
          ],
        },
        weight: 1,
      },
    ],
    refreshInterval: 10,
  },
]);

areas[0].beastTypes[0].avatar.src =
  "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?ixlib=rb-4.0.3&auto=format&fit=crop&w=55&h=55";

// Biến trạng thái
const selectedArea = ref(null);
const battleLogs = ref([]);
const rewardEffects = ref([]);
const skillEffects = ref([]);
const lastUpdateTime = ref(null);
const mapCanvas = ref(null);
let ctx = null;
const scale = 500 / 100;

// Computed cho khu vực hiện tại
const currentArea = computed(
  () => areas.find((a) => a.id === player.map.currentArea) || null
);

// Khởi tạo canvas
const initCanvas = () => {
  ctx = mapCanvas.value.getContext("2d");
};

// Vẽ bản đồ với UI nâng cao
const drawMap = () => {
  ctx.clearRect(0, 0, mapCanvas.value.width, mapCanvas.value.height);
  ctx.save();

  // Hiệu ứng đấu khí
  if (player.map.visualEffects.auraOpacity > 0) {
    ctx.beginPath();
    ctx.arc(
      player.map.playerPosition.x * scale,
      player.map.playerPosition.y * scale,
      player.map.detectionRadius * 1.5 * scale,
      0,
      2 * Math.PI
    );
    const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 200);
    ctx.fillStyle = `rgba(255, 100, 100, ${
      player.map.visualEffects.auraOpacity * pulse
    })`;
    ctx.fill();
  }

  // Vẽ nhân vật
  ctx.beginPath();
  ctx.arc(
    player.map.playerPosition.x * scale,
    player.map.playerPosition.y * scale,
    player.map.detectionRadius * scale,
    0,
    2 * Math.PI
  );
  ctx.clip();
  ctx.drawImage(
    player.avatar,
    (player.map.playerPosition.x - player.map.detectionRadius) * scale,
    (player.map.playerPosition.y - player.map.detectionRadius) * scale,
    player.map.detectionRadius * 2 * scale,
    player.map.detectionRadius * 2 * scale
  );
  ctx.restore();

  // Vẽ thanh trạng thái người chơi
  const playerHealthRatio = player.health / player.maxHealth;
  const playerEnergyRatio = player.cultivationPath.spiritualEnergy / player.cultivationPath.maxSpiritualEnergy;
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(
    (player.map.playerPosition.x - 5) * scale,
    (player.map.playerPosition.y - 7) * scale,
    10 * scale,
    1 * scale
  );
  ctx.fillStyle = `rgba(255, 0, 0, ${1 - (Date.now() % 1000) / 1000})`;
  ctx.fillRect(
    (player.map.playerPosition.x - 5) * scale,
    (player.map.playerPosition.y - 7) * scale,
    10 * playerHealthRatio * scale,
    0.5 * scale
  );
  ctx.fillStyle = `rgba(0, 0, 255, ${1 - (Date.now() % 1000) / 1000})`;
  ctx.fillRect(
    (player.map.playerPosition.x - 5) * scale,
    (player.map.playerPosition.y - 6.5) * scale,
    10 * playerEnergyRatio * scale,
    0.5 * scale
  );

  // Vẽ ma thú và thanh HP
  player.map.beasts.forEach((beast) => {
    const fadeDuration = 2000;
    let opacity = 1;
    if (beast.isFading && beast.fadeStartTime) {
      const elapsed = Date.now() - new Date(beast.fadeStartTime).getTime();
      opacity = 1 - elapsed / fadeDuration;
      if (opacity <= 0) opacity = 0;
    }
    ctx.save();
    ctx.beginPath();
    ctx.arc(
      beast.position.x * scale,
      beast.position.y * scale,
      3 * scale,
      0,
      2 * Math.PI
    );
    ctx.clip();
    ctx.globalAlpha = opacity;
    const beastType = currentArea.value.beastTypes.find(
      (bt) => bt.id === beast.id
    );
    ctx.drawImage(
      beastType.avatar,
      (beast.position.x - 3) * scale,
      (beast.position.y - 3) * scale,
      6 * scale,
      6 * scale
    );
    ctx.globalAlpha = 1;
    if (beast.newlySpawned) {
      ctx.beginPath();
      ctx.arc(
        beast.position.x * scale,
        beast.position.y * scale,
        3.5 * scale,
        0,
        2 * Math.PI
      );
      ctx.strokeStyle = `rgba(255, 100, 100, ${opacity})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.restore();

    // Vẽ thanh HP ma thú
    const dx = player.map.playerPosition.x - beast.position.x;
    const dy = player.map.playerPosition.y - beast.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 10 || beast.isFading || beast.health < beastType.health) {
      const healthRatio = beast.health / beastType.health;
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(
        (beast.position.x - 3) * scale,
        (beast.position.y - 5) * scale,
        6 * scale,
        0.5 * scale
      );
      ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`;
      ctx.fillRect(
        (beast.position.x - 3) * scale,
        (beast.position.y - 5) * scale,
        6 * healthRatio * scale,
        0.5 * scale
      );
    }

    if (
      beast.newlySpawned &&
      Date.now() - new Date(beast.spawnTime).getTime() > 1000
    ) {
      beast.newlySpawned = false;
    }
  });

  // Vẽ hiệu ứng phần thưởng
  rewardEffects.value.forEach((effect) => {
    const elapsed = Date.now() - effect.startTime;
    if (elapsed > 2000) return;
    const opacity = 1 - elapsed / 2000;
    const offsetY = -(elapsed / 2000) * 20;
    ctx.font = "14px serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = `rgba(${effect.color.r}, ${effect.color.g}, ${effect.color.b}, ${opacity})`;
    ctx.fillText(
      effect.text,
      (player.map.playerPosition.x + 10) * scale,
      (player.map.playerPosition.y + offsetY) * scale
    );
  });
  rewardEffects.value = rewardEffects.value.filter(
    (effect) => Date.now() - effect.startTime <= 2000
  );

  // Vẽ hiệu ứng kỹ năng và text thông tin
  skillEffects.value.forEach((effect) => {
    const elapsed = Date.now() - effect.startTime;
    if (elapsed > effect.duration) return;
    const opacity = 1 - elapsed / effect.duration;
    const offsetY = -(elapsed / effect.duration) * 20;
    ctx.save();
    ctx.globalAlpha = opacity;

    if (effect.type === "fire_explosion") {
      ctx.beginPath();
      ctx.arc(
        effect.position.x * scale,
        effect.position.y * scale,
        (effect.radius * (elapsed / effect.duration)) * scale,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = effect.color;
      ctx.fill();
    } else if (effect.type === "wave") {
      ctx.beginPath();
      ctx.arc(
        effect.position.x * scale,
        effect.position.y * scale,
        (effect.radius * (elapsed / effect.duration)) * scale,
        0,
        2 * Math.PI
      );
      ctx.strokeStyle = effect.color;
      ctx.lineWidth = 3;
      ctx.stroke();
    } else if (effect.type === "slash") {
      ctx.beginPath();
      ctx.moveTo(
        (effect.position.x - 2) * scale,
        (effect.position.y - 2) * scale
      );
      ctx.lineTo(
        (effect.position.x + 2) * scale,
        (effect.position.y + 2) * scale
      );
      ctx.strokeStyle = effect.color;
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (effect.type === "text") {
      ctx.font = "16px serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillStyle = effect.color;
      ctx.fillText(
        effect.text,
        (effect.position.x + 5) * scale,
        (effect.position.y + offsetY) * scale
      );
    }

    ctx.restore();
  });
  skillEffects.value = skillEffects.value.filter(
    (effect) => Date.now() - effect.startTime <= effect.duration
  );
};

// Thuật toán A* cho người chơi và ma thú
const aStar = (start, goal, mapSize, obstacles) => {
  const gridSize = 1;
  const gridWidth = Math.ceil(mapSize.width / gridSize);
  const gridHeight = Math.ceil(mapSize.height / gridSize);
  const heuristic = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

  const isObstacle = (x, y) => {
    return obstacles.some((obs) => {
      const dx = x * gridSize - obs.x;
      const dy = y * gridSize - obs.y;
      return Math.sqrt(dx * dx + dy * dy) < 2;
    });
  };

  const openSet = [
    {
      x: Math.floor(start.x / gridSize),
      y: Math.floor(start.y / gridSize),
      g: 0,
      h: 0,
      f: 0,
      parent: null,
    },
  ];
  const closedSet = new Set();
  const cameFrom = {};

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift();
    const currentKey = `${current.x},${current.y}`;
    if (closedSet.has(currentKey)) continue;
    closedSet.add(currentKey);

    if (
      Math.abs(current.x * gridSize - goal.x) < gridSize &&
      Math.abs(current.y * gridSize - goal.y) < gridSize
    ) {
      let path = [];
      let temp = current;
      while (temp) {
        path.push({
          x: temp.x * gridSize + gridSize / 2,
          y: temp.y * gridSize + gridSize / 2,
        });
        temp = cameFrom[`${temp.x},${temp.y}`];
      }
      path = path.reverse();

      // Path smoothing
      const smoothedPath = [path[0]];
      let i = 1;
      while (i < path.length - 1) {
        const p0 = smoothedPath[smoothedPath.length - 1];
        const p1 = path[i];
        const p2 = path[i + 1];
        const dx1 = p1.x - p0.x;
        const dy1 = p1.y - p0.y;
        const dx2 = p2.x - p1.x;
        const dy2 = p2.y - p1.y;
        const angle = Math.abs(
          Math.atan2(dy2, dx2) - Math.atan2(dy1, dx1)
        );
        if (angle < Math.PI / 4) {
          i++;
        } else {
          smoothedPath.push(p1);
          i++;
        }
      }
      smoothedPath.push(path[path.length - 1]);
      return smoothedPath;
    }

    const neighbors = [
      { x: current.x + 1, y: current.y },
      { x: current.x - 1, y: current.y },
      { x: current.x, y: current.y + 1 },
      { x: current.x, y: current.y - 1 },
      { x: current.x + 1, y: current.y + 1 },
      { x: current.x - 1, y: current.y - 1 },
      { x: current.x + 1, y: current.y - 1 },
      { x: current.x - 1, y: current.y + 1 },
    ];

    for (const neighbor of neighbors) {
      if (
        neighbor.x < 0 ||
        neighbor.x >= gridWidth ||
        neighbor.y < 0 ||
        neighbor.y >= gridHeight ||
        closedSet.has(`${neighbor.x},${neighbor.y}`) ||
        isObstacle(neighbor.x, neighbor.y)
      )
        continue;

      const gScore = current.g + Math.sqrt(
        ((neighbor.x - current.x) ** 2) + ((neighbor.y - current.y) ** 2)
      );
      const hScore = heuristic(
        { x: neighbor.x * gridSize, y: neighbor.y * gridSize },
        goal
      );
      const fScore = gScore + hScore;

      const existing = openSet.find(
        (n) => n.x === neighbor.x && n.y === neighbor.y
      );
      if (!existing || fScore < existing.f) {
        if (existing) {
          openSet.splice(openSet.indexOf(existing), 1);
        }
        openSet.push({
          x: neighbor.x,
          y: neighbor.y,
          g: gScore,
          h: hScore,
          f: fScore,
        });
        cameFrom[`${neighbor.x},${neighbor.y}`] = current;
      }
    }
  }
  return [];
};

// Tìm ma thú gần nhất
const findNearestBeast = () => {
  let nearestBeast = null;
  let maxScore = -Infinity;
  player.map.beasts.forEach((beast) => {
    if (beast.isFading) return;
    const dx = player.map.playerPosition.x - beast.position.x;
    const dy = player.map.playerPosition.y - beast.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const beastType = currentArea.value.beastTypes.find(bt => bt.id === beast.id);
    const score = beastType.weight / (distance + 0.1);
    if (score > maxScore) {
      maxScore = score;
      nearestBeast = beast;
    }
  });
  return { beast: nearestBeast, distance: maxScore > -Infinity ? 1 / maxScore : Infinity };
};

// Cập nhật đường đi người chơi
const updatePath = () => {
  if (!currentArea.value) return;
  const now = Date.now();
  if (
    player.map.autoBattle.lastPathUpdate &&
    now - new Date(player.map.autoBattle.lastPathUpdate).getTime() < 100
  ) {
    return;
  }
  const { beast } = findNearestBeast();
  if (beast) {
    const obstacles = player.map.beasts
      .filter(b => b !== beast && !b.isFading)
      .map(b => ({ x: b.position.x, y: b.position.y }));
    player.map.path = aStar(
      player.map.playerPosition,
      beast.position,
      currentArea.value.mapSize,
      obstacles
    );
    player.map.autoBattle.lastPathUpdate = new Date().toISOString();
  } else {
    player.map.path = [];
  }
};

// Di chuyển ma thú
const moveBeasts = (deltaTime) => {
  if (!currentArea.value) return;
  player.map.beasts.forEach((beast) => {
    if (beast.isFading) return;
    const beastType = currentArea.value.beastTypes.find(bt => bt.id === beast.id);
    const dx = player.map.playerPosition.x - beast.position.x;
    const dy = player.map.playerPosition.y - beast.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < beastType.detectionRadius) {
      // Đuổi theo người chơi
      if (
        !beast.path ||
        !beast.lastPathUpdate ||
        Date.now() - new Date(beast.lastPathUpdate).getTime() > 500
      ) {
        const obstacles = player.map.beasts
          .filter(b => b !== beast && !b.isFading)
          .map(b => ({ x: b.position.x, y: b.position.y }));
        beast.path = aStar(
          beast.position,
          player.map.playerPosition,
          currentArea.value.mapSize,
          obstacles
        );
        beast.lastPathUpdate = new Date().toISOString();
      }

      if (beast.path && beast.path.length > 1) {
        const nextPoint = beast.path[1];
        const dx = nextPoint.x - beast.position.x;
        const dy = nextPoint.y - beast.position.y;
        const distToNext = Math.sqrt(dx * dx + dy * dy);
        const moveDistance = beastType.speed * deltaTime;
        if (distToNext < 0.1 || distToNext < moveDistance) {
          beast.path.splice(0, 1);
        } else {
          const t = easeInOutCubic(moveDistance / distToNext);
          beast.position.x += dx * t * 4;
          beast.position.y += dy * t * 4;
          beast.position.x = Math.max(0, Math.min(beast.position.x, currentArea.value.mapSize.width));
          beast.position.y = Math.max(0, Math.min(beast.position.y, currentArea.value.mapSize.height));
        }
      }
    } else {
      // Di chuyển ngẫu nhiên
      if (
        !beast.randomMoveTime ||
        Date.now() - new Date(beast.randomMoveTime).getTime() > 2000
      ) {
        beast.randomTarget = {
          x: beast.position.x + (Math.random() - 0.5) * 10,
          y: beast.position.y + (Math.random() - 0.5) * 10,
        };
        beast.randomTarget.x = Math.max(0, Math.min(beast.randomTarget.x, currentArea.value.mapSize.width));
        beast.randomTarget.y = Math.max(0, Math.min(beast.randomTarget.y, currentArea.value.mapSize.height));
        beast.randomMoveTime = new Date().toISOString();
        const obstacles = player.map.beasts
          .filter(b => b !== beast && !b.isFading)
          .map(b => ({ x: b.position.x, y: b.position.y }));
        beast.path = aStar(
          beast.position,
          beast.randomTarget,
          currentArea.value.mapSize,
          obstacles
        );
      }

      if (beast.path && beast.path.length > 1) {
        const nextPoint = beast.path[1];
        const dx = nextPoint.x - beast.position.x;
        const dy = nextPoint.y - beast.position.y;
        const distToNext = Math.sqrt(dx * dx + dy * dy);
        const moveDistance = beastType.speed * deltaTime;
        if (distToNext < 0.1 || distToNext < moveDistance) {
          beast.path.splice(0, 1);
        } else {
          const t = easeInOutCubic(moveDistance / distToNext);
          beast.position.x += dx * t * 4;
          beast.position.y += dy * t * 4;
          beast.position.x = Math.max(0, Math.min(beast.position.x, currentArea.value.mapSize.width));
          beast.position.y = Math.max(0, Math.min(beast.position.y, currentArea.value.mapSize.height));
        }
      }
    }
  });
};

// Easing function
const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// Di chuyển người chơi
const movePlayer = (deltaTime) => {
  if (!currentArea.value) return;
  const mapSize = currentArea.value.mapSize;
  let speed = player.map.baseMovementSpeed;
  const { beast, distance } = findNearestBeast();
  player.map.visualEffects.auraOpacity =
    distance < 8 && beast ? 1 - distance / 8 : 0;
  player.map.visualEffects.glow = player.map.autoBattle.isActive;

  if (distance < 10 && beast) {
    speed = player.map.baseMovementSpeed +
      (player.map.maxMovementSpeed - player.map.baseMovementSpeed) * (1 - distance / 10);
  }

  if (player.map.path.length > 1) {
    const nextPoint = player.map.path[1];
    const dx = nextPoint.x - player.map.playerPosition.x;
    const dy = nextPoint.y - player.map.playerPosition.y;
    const distToNext = Math.sqrt(dx * dx + dy * dy);
    const moveDistance = speed * deltaTime;
    if (distToNext < 0.1 || distToNext < moveDistance) {
      player.map.path.splice(0, 1);
    } else {
      const t = easeInOutCubic(moveDistance / distToNext);
      const newX = player.map.playerPosition.x + dx * t * 4;
      const newY = player.map.playerPosition.y + dy * t * 4;
      player.map.playerPosition = {
        x: Math.max(0, Math.min(newX, mapSize.width)),
        y: Math.max(0, Math.min(newY, mapSize.height)),
      };
    }
  } else {
    const angle = Math.random() * 2 * Math.PI;
    let newX =
      player.map.playerPosition.x + speed * Math.cos(angle) * deltaTime;
    let newY =
      player.map.playerPosition.y + speed * Math.sin(angle) * deltaTime;
    newX = Math.max(0, Math.min(newX, mapSize.width));
    newY = Math.max(0, Math.min(newY, mapSize.height));
    player.map.playerPosition = { x: newX, y: newY };
  }
};

// Kiểm tra va chạm
const checkCollisions = () => {
  if (!currentArea.value) return;
  player.map.beasts.forEach((beast) => {
    if (beast.isFading) return;
    const dx = player.map.playerPosition.x - beast.position.x;
    const dy = player.map.playerPosition.y - beast.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < player.map.detectionRadius) {
      fightBeast(beast);
    }
  });
};

// Sử dụng đấu kỹ
const useSkill = (skill) => {
  if (skill.cooldown > 0 || player.cultivationPath.spiritualEnergy < skill.energyCost) return;
  skill.cooldown = skill.maxCooldown;
  player.cultivationPath.spiritualEnergy -= skill.energyCost;
  battleLogs.value.push(`Ngươi thi triển ${skill.name}! Đấu khí bùng nổ!`);
  skillEffects.value.push({
    ...skill.effect,
    position: player.map.playerPosition,
    startTime: Date.now(),
    duration: 1000,
  });
  skillEffects.value.push({
    type: "text",
    text: `${skill.name}`,
    color: "rgba(255, 50, 50, 1)",
    position: player.map.playerPosition,
    startTime: Date.now(),
    duration: 1500,
  });
  if (sounds[skill.id]) {
    sounds[skill.id].play().catch(() => {});
  }
};

// Cập nhật thời gian hồi chiêu
const updateCooldowns = () => {
  player.fightSkills.forEach((skill) => {
    if (skill.cooldown > 0) {
      skill.cooldown = Math.max(0, skill.cooldown - 0.1);
    }
  });
};

// Chiến đấu với ma thú
const fightBeast = (beast) => {
  const beastType = currentArea.value.beastTypes.find(
    (bt) => bt.id === beast.id
  );
  battleLogs.value.push(
    `Một ${beastType.name} gầm thét lao tới tại (${beast.position.x.toFixed(
      1
    )}, ${beast.position.y.toFixed(1)})! Đấu khí bùng nổ!`
  );

  let beastHealth = beast.health;
  let playerHealth = player.health;
  let flameBonus = player.differentFlames.reduce((sum, flame) => sum + flame.attackBoost, 0);

  while (beastHealth > 0 && playerHealth > 0) {
    const isCritical = Math.random() < player.critical;
    let playerDamage = Math.max(0, (player.attack + flameBonus) - beast.defense) *
      (1 + (isCritical ? 0.5 : 0));

    // Kiểm tra sử dụng kỹ năng
    const availableSkill = player.fightSkills.find(
      (skill) => skill.cooldown === 0 && player.cultivationPath.spiritualEnergy >= skill.energyCost
    );
    if (availableSkill && Math.random() < 0.3) {
      playerDamage *= availableSkill.damageMultiplier;
      useSkill(availableSkill);
      battleLogs.value.push(
        `Ngươi thi triển ${availableSkill.name}, gây ${playerDamage.toFixed(1)} sát thương${isCritical ? ' (Bạo kích!)' : ''}!`
      );
      skillEffects.value.push({
        type: "text",
        text: `-${playerDamage.toFixed(1)} ${isCritical ? 'Bạo kích!' : ''}`,
        color: isCritical ? "rgba(255, 0, 0, 1)" : "rgba(255, 255, 255, 1)",
        position: beast.position,
        startTime: Date.now(),
        duration: 1500,
      });
    } else {
      // Hiệu ứng đánh thường
      skillEffects.value.push({
        type: "slash",
        position: beast.position,
        color: "rgba(255, 255, 200, 0.8)",
        startTime: Date.now(),
        duration: 500,
      });
      battleLogs.value.push(
        `Ngươi tung đòn đấu khí, gây ${playerDamage.toFixed(1)} sát thương${isCritical ? ' (Bạo kích!)' : ''}.`
      );
      skillEffects.value.push({
        type: "text",
        text: `-${playerDamage.toFixed(1)} ${isCritical ? 'Bạo kích!' : ''}`,
        color: isCritical ? "rgba(255, 0, 0, 1)" : "rgba(255, 255, 255, 1)",
        position: beast.position,
        startTime: Date.now(),
        duration: 1500,
      });
      sounds.normal_attack.play().catch(() => {});
      if (isCritical) {
        sounds.critical_hit.play().catch(() => {});
      }
    }

    beastHealth -= playerDamage;
    beast.health = beastHealth;

    if (beastHealth > 0) {
      const beastDamage = Math.max(0, beast.attack - player.defense);
      playerHealth -= beastDamage;
      battleLogs.value.push(
        `${beastType.name} phản công, gây ${beastDamage.toFixed(
          1
        )} sát thương. Ngươi còn ${playerHealth.toFixed(1)} khí huyết.`
      );
      skillEffects.value.push({
        type: "text",
        text: `-${beastDamage.toFixed(1)} Khí huyết Warcraft`,
        color: "rgba(255, 100, 100, 1)",
        position: player.map.playerPosition,
        startTime: Date.now(),
        duration: 1500,
      });
    }
  }

  if (beastHealth <= 0) {
    battleLogs.value.push(`Ngươi đánh bại ${beastType.name}! Đấu khí dần tan biến...`);
    beast.isFading = true;
    beast.fadeStartTime = new Date().toISOString();
    sounds.beast_defeated.play().catch(() => {});
    const rewards = beastType.rewards;
    const sectBonus = player.sect ? 1.2 : 1;

    player.map.autoBattle.accumulatedRewards.spiritualEnergy += rewards.spiritualEnergy * sectBonus;
    player.map.autoBattle.accumulatedRewards.money += rewards.money * sectBonus;
    player.cultivationPath.spiritualEnergy += rewards.spiritualEnergy * sectBonus;
    player.props.money += rewards.money * sectBonus;

    // Hiệu ứng phần thưởng
    rewardEffects.value.push({
      text: `+${rewards.spiritualEnergy * sectBonus} linh lực`,
      color: { r: 0, g: 183, b: 235 },
      position: {
        x: player.map.playerPosition.x,
        y: player.map.playerPosition.y,
      },
      startTime: Date.now(),
    });
    rewardEffects.value.push({
      text: `+${rewards.money * sectBonus} linh thạch`,
      color: { r: 255, g: 215, b: 0 },
      position: {
        x: player.map.playerPosition.x,
        y: player.map.playerPosition.y + 1,
      },
      startTime: Date.now(),
    });

    // Nhận vật phẩm
    rewards.dropItems.forEach((item) => {
      if (Math.random() < item.chance) {
        if (item.id.includes("flame")) {
          if (!player.differentFlames.find(f => f.id === item.id)) {
            const flame = differentFlames.find(f => f.id === item.id);
            player.differentFlames.push(flame);
            battleLogs.value.push(`Dị Hỏa ${item.name} xuất hiện! Ngươi hấp thu thành công!`);
            skillEffects.value.push({
              type: "text",
              text: `Dị Hỏa: ${item.name}`,
              color: "rgba(255, 215, 0, 1)",
              position: player.map.playerPosition,
              startTime: Date.now(),
              duration: 2000,
            });
          }
        } else {
          const existingItem = player.inventory.find((i) => i.id === item.id);
          if (existingItem) {
            existingItem.quantity += 1;
          } else {
            player.inventory.push({ ...item, quantity: 1 });
          }
          battleLogs.value.push(`Thu hoạch ${item.name}!`);
          rewardEffects.value.push({
            text: `${item.name} x1`,
            color: { r: 255, g: 255, b: 255 },
            position: {
              x: player.map.playerPosition.x,
              y: player.map.playerPosition.y + 2,
            },
            startTime: Date.now(),
          });
        }
      }
    });

    // Kiểm tra đột phá cảnh giới
    const currentRealmIndex = realms.findIndex(r => r.name === player.cultivationPath.realm);
    if (player.cultivationPath.spiritualEnergy >= player.cultivationPath.maxSpiritualEnergy) {
      if (currentRealmIndex < realms.length - 1) {
        player.cultivationPath.realm = realms[currentRealmIndex + 1].name;
        player.cultivationPath.realmLevel = 1;
        player.cultivationPath.spiritualEnergy = 0;
        player.cultivationPath.maxSpiritualEnergy = realms[currentRealmIndex + 1].maxSpiritualEnergy;
        player.maxHealth = realms[currentRealmIndex + 1].maxHealth;
        player.health = player.maxHealth;
        player.attack = realms[currentRealmIndex + 1].attack;
        player.defense = realms[currentRealmIndex + 1].defense;
        battleLogs.value.push(
          `Linh lực bùng nổ! Ngươi đột phá đến ${player.cultivationPath.realm}!`
        );
        skillEffects.value.push({
          type: "text",
          text: `Đột phá: ${player.cultivationPath.realm}`,
          color: "rgba(0, 255, 0, 1)",
          position: player.map.playerPosition,
          startTime: Date.now(),
          duration: 2000,
        });
      } else {
        player.cultivationPath.realmLevel += 1;
        player.cultivationPath.spiritualEnergy = 0;
        battleLogs.value.push(
          `Cảnh giới ${player.cultivationPath.realm} tăng lên cấp ${player.cultivationPath.realmLevel}!`
        );
        skillEffects.value.push({
          type: "text",
          text: `Thăng cấp: ${player.cultivationPath.realm} ${player.cultivationPath.realmLevel}`,
          color: "rgba(0, 255, 0, 1)",
          position: player.map.playerPosition,
          startTime: Date.now(),
          duration: 2000,
        });
      }
    }
    player.map.path = [];
  } else {
    player.health = playerHealth;
    battleLogs.value.push(`Ngươi bị ${beastType.name} đánh bại! Đấu khí tan biến...`);
    if (player.map.autoBattle.isActive) {
      toggleAutoBattle();
    }
  }
};

// Làm mới ma thú
const refreshBeasts = () => {
  if (!currentArea.value) return;
  const now = Date.now();
  player.map.beasts = player.map.beasts.filter((beast) => {
    if (
      beast.isFading &&
      now - new Date(beast.fadeStartTime).getTime() > 2000
    ) {
      player.map.path = [];
      return false;
    }
    return true;
  });
  while (player.map.beasts.length < currentArea.value.maxBeasts) {
    const beastType =
      currentArea.value.beastTypes[
        Math.floor(Math.random() * currentArea.value.beastTypes.length)
      ];
    const newBeast = {
      id: beastType.id,
      position: {
        x: Math.random() * currentArea.value.mapSize.width,
        y: Math.random() * currentArea.value.mapSize.height,
      },
      health: beastType.health,
      attack: beastType.attack,
      defense: beastType.defense,
      speed: beastType.speed,
      detectionRadius: beastType.detectionRadius,
      isFading: false,
      fadeStartTime: null,
      newlySpawned: true,
      spawnTime: new Date().toISOString(),
      path: [],
      lastPathUpdate: null,
      randomMoveTime: null,
      randomTarget: null,
    };
    player.map.beasts.push(newBeast);
    battleLogs.value.push(
      `Một ${
        beastType.name
      } xuất hiện trong làn sương tại (${newBeast.position.x.toFixed(
        1
      )}, ${newBeast.position.y.toFixed(1)})!`
    );
    player.map.path = [];
  }
};

// Sử dụng đan dược
const useElixir = () => {
  const elixir = player.inventory.find(i => i.type === "elixir");
  if (!elixir) return;
  player.health = Math.min(player.maxHealth, player.health + elixir.effect.health);
  elixir.quantity -= 1;
  if (elixir.quantity <= 0) {
    player.inventory = player.inventory.filter(i => i.id !== elixir.id);
  }
  battleLogs.value.push(`Ngươi sử dụng ${elixir.name}, hồi phục ${elixir.effect.health} khí huyết!`);
  skillEffects.value.push({
    type: "text",
    text: `+${elixir.effect.health} Khí huyết`,
    color: "rgba(0, 255, 0, 1)",
    position: player.map.playerPosition,
    startTime: Date.now(),
    duration: 1500,
  });
};

// Game loop
const gameLoop = () => {
  const now = Date.now();
  const deltaTime = (now - lastUpdateTime.value) / 1000;
  lastUpdateTime.value = now;
  if (player.map.autoBattle.isActive) {
    updatePath();
    movePlayer(deltaTime);
    checkCollisions();
  }
  moveBeasts(deltaTime);
  refreshBeasts();
  updateCooldowns();
  drawMap();
  requestAnimationFrame(gameLoop);
};

// Vào khu vực
const enterArea = () => {
  if (!selectedArea.value) return;
  const area = areas.find((a) => a.id === selectedArea.value);
  const playerRealmIndex = realms.findIndex(r => r.name === player.cultivationPath.realm);
  const areaRealmIndex = realms.findIndex(r => r.name === area.realmRequired);
  if (playerRealmIndex < areaRealmIndex) {
    battleLogs.value.push(
      `Cảnh giới chưa đủ để vào ${area.name}! Cần ${area.realmRequired}.`
    );
    return;
  }
  player.map.currentArea = selectedArea.value;
  player.map.playerPosition = { x: 50, y: 50 };
  player.map.beasts = [];
  player.map.path = [];
  refreshBeasts();
  battleLogs.value.push(`Ngươi bước vào ${area.name}, đấu khí lan tỏa!`);
};

// Bật/tắt luyện công
const toggleAutoBattle = () => {
  if (!player.map.currentArea) return;
  if (player.map.autoBattle.isActive) {
    player.map.autoBattle.isActive = false;
    const rewards = player.map.autoBattle.accumulatedRewards;
    battleLogs.value.push(
      `Luyện công kết thúc! Thu hoạch: ${rewards.spiritualEnergy} linh lực, ${
        rewards.money
      } linh thạch, ${rewards.items
        .map((i) => `${i.name} x${i.quantity}`)
        .join(", ")}`
    );
    player.map.autoBattle.accumulatedRewards = { spiritualEnergy: 0, money: 0, items: [] };
  } else {
    player.map.autoBattle.isActive = true;
    player.map.autoBattle.lastMoveTime = new Date().toISOString();
    player.map.autoBattle.lastPathUpdate = new Date().toISOString();
    battleLogs.value.push(`Luyện công bắt đầu tại ${currentArea.value.name}! Đấu khí ngưng tụ!`);
  }
};

// Khởi tạo khi mount
onMounted(() => {
  lastUpdateTime.value = Date.now();
  initCanvas();
  gameLoop();
});
</script>
