<template>
  <!-- Chọn con đường -->
  <div v-if="!player.cultivationPath.path">
    <div class="text-left leading-6 mb-2">
      Bước vào con đường trường sinh, mỗi lựa chọn khắc dấu ấn vạn cổ. Kiếm chém
      thiên địa, đan dược bất tử, phù chú thần thông, thân thể vô địch, hay ma
      đạo tung hoành? Quyết định ngay, Tiên Đạo sẽ dẫn ngươi tới đỉnh cao tu
      tiên!
    </div>
    <div
      v-for="path in Object.keys(CULTIVATION_PATHS)"
      :key="path"
    >
      <button
        @click="choosePath(path)"
        class="text-left"
      >
        {{ CULTIVATION_PATHS[path].name }}:
        {{ CULTIVATION_PATHS[path].description }}
      </button>
    </div>
  </div>

  <el-tabs
    v-model="state.pathActive"
    v-if="player.cultivationPath.path"
  >
    <el-tab-pane
      label="Thông tin"
      name="info"
    >
      <h3>Con đường: {{ player.cultivationPath.path }}</h3>
      <div class="">
        <div class="flex items-center justify-center gap-4">
          <div>Cấp độ: {{ player.cultivationPath.pathLevel }}</div>
          <div>
            Kinh nghiệm: {{ player.cultivationPath.pathExp }} /
            {{ player.cultivationPath.maxPathExp }}
          </div>
        </div>
        <div class="flex flex-col">
          <div>Thiên phú</div>
          <div class="flex items-center justify-center gap-2">
            <div
              v-for="(bonuse, key) in player.cultivationPath.bonuses"
              :key="key"
            >
              {{ statNameMapping[key] }} {{ formatStatValue(key, bonuse) }}
            </div>
          </div>
        </div>
        <div>
          Kỹ năng:
          {{
            player.cultivationPath.skills
              .map((s) => `${s.name} (Cấp ${s.level})`)
              .join(", ")
          }}
        </div>
        <div>
          Pháp bảo:
          {{ player.cultivationPath.artifacts.map((a) => a.name).join(", ") }}
        </div>
      </div>
      <!-- <button
        @click="trainPath"
        :disabled="isTraining"
      >
        Luyện công
      </button> -->
    </el-tab-pane>
    <el-tab-pane
      label="Kỹ năng"
      name="skills"
    >
      <!-- Sử dụng kỹ năng (trong chiến đấu) -->
      <!-- <div v-if="inCombat && player.cultivationPath.skills.length">
        <h3>Kỹ năng chiến đấu</h3>
        <button
          v-for="skill in player.cultivationPath.skills"
          :key="skill.id"
          @click="useSkill(skill)"
          :disabled="player.cultivation < skill.cost || skill.level === 0"
        >
          {{ skill.name }} (Cấp {{ skill.level }}) - Cost: {{ skill.cost }}
        </button>
      </div> -->

      <!-- Nâng cấp kỹ năng -->
      <div
        v-if="player.cultivationPath.skills.length"
        class="mb-4"
      >
        <h3>Nâng cấp kỹ năng</h3>
        <div
          v-for="skill in player.cultivationPath.skills"
          :key="skill.id"
          class="border rounded border-[#3b3b3b] p-2"
        >
          <div class="flex items-center justify-center gap-2">
            <el-tag>
              {{ skill.name }} (Cấp {{ skill.level }}) 
            </el-tag>
            <div class="text-left leading-6">
              {{ skill.description }}
            </div>
          </div>
          <!-- <el-button
            size="small"
            type="primary"
            v-if="skill.level < 5"
            @click="upgradeSkill(skill)"
            :disabled="player.props.money < skillUpgradeCost(skill.level)"
          >
            Nâng cấp ({{ skillUpgradeCost(skill.level) }} linh thạch)
          </el-button> -->
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane
      label="Pháp bảo"
      name="artifact"
    >
      <div
        v-for="artifact in player.cultivationPath.artifacts"
        :key="artifact.id"
        class="border rounded border-[#3b3b3b] p-2"
      >
        <div class="flex items-center justify-center gap-2">
          <el-tag>
            {{ artifact.name }} (Cấp {{ artifact.level }}) 
          </el-tag>
          <div class="text-left leading-6">
            {{ artifact.description }}
          </div>
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>

  <!-- Tu luyện -->
  <!-- <button :disabled="isCultivating">
    Tu luyện
  </button> -->
</template>

<script setup>
import { CULTIVATION_PATHS, CultivationPath } from "~/composables/cultivation";
import { formatStatValue, statNameMapping } from '~/composables/stats';
import { useMainStore } from "~/stores/main";
import { getCurrentInstance, reactive } from "vue";

const store = useMainStore();
const player = store.player;

const state = reactive({
  pathActive: 'info',
});

// State cho các trạng thái
const instance = getCurrentInstance();
const globalProperties = instance.appContext.config.globalProperties;

const cultivationPath = new CultivationPath(player);

const choosePath = (path) => {
  const pathData = CULTIVATION_PATHS[path];
  console.log('pathData', pathData)

  globalProperties
    .$confirm(
      `Bạn có chắc muốn chọn ${pathData.name} không?`,
      "Nhắc nhở lựa chọn",
      {
        center: true,
        cancelButtonText: "Tôi nhấn nhầm",
        confirmButtonText: "Chắc chắn",
      }
    )
    .then(() => {
      cultivationPath.choosePath(path);
    });
};


const levelUpPath = () => {
  const pathData = CULTIVATION_PATHS[player.cultivationPath.path];
  player.cultivationPath.pathLevel += 1;
  player.cultivationPath.pathExp = 0;
  player.cultivationPath.maxPathExp =
    pathData.expPerLevel[player.cultivationPath.pathLevel - 1] || 1000;

  // Mở khóa phần thưởng
  const reward = pathData.levelUpRewards[player.cultivationPath.pathLevel];
  if (reward) {
    if (reward.skill) {
      const skill = pathData.skills.find((s) => s.name === reward.skill);
      if (skill) {
        skill.level = 1;
        player.cultivationPath.skills.push(skill);
      }
    }
    if (reward.artifact) {
      const artifact = pathData.artifacts.find(
        (a) => a.name === reward.artifact
      );
      if (artifact) {
        artifact.level = 1;
        player.cultivationPath.artifacts.push(artifact);
        player.equipment[artifact.type] = artifact;
      }
    }
  }
};

const skillUpgradeCost = (level) => {
  return 100000 * (level + 1); // Chi phí tăng theo cấp
};

const upgradeSkill = (skill) => {
  const cost = skillUpgradeCost(skill.level);
  if (player.props.money >= cost) {
    player.props.money -= cost;
    skill.level += 1;
    // Cập nhật thông số kỹ năng
    if (skill.damage) skill.damage += 20;
    if (skill.effect) {
      if (skill.effect.defensePower) skill.effect.defensePower += 10;
      if (skill.effect.attackPower) skill.effect.attackPower += 10;
      if (skill.effect.manaGainRate) skill.effect.manaGainRate += 10;
      if (skill.effect.burn) skill.effect.burn += 5;
      if (skill.effect.heal) skill.effect.heal += 5;
    }
    skill.cost += 5;
  }
};
</script>
