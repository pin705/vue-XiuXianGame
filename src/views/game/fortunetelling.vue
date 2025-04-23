<template>
  <div class="fortune-telling">
    <el-button
      @click="tellFortune"
      :disabled="!canTellFortune"
      class="fortune-button"
      v-text="canTellFortune ? 'Bắt đầu bói toán' : 'Hôm nay đã bói rồi'"
    />
    <div
      v-if="result"
      class="result"
    >
      <p v-text="result.message" />
    </div>
  </div>
</template>

<script>
export default {
  name: "FortuneTelling",
  data() {
    return {
      result: null,
    };
  },
  computed: {
    player() {
      return this.$store.player;
    },
    canTellFortune() {
      const now = new Date();
      const lastFortune = new Date(this.player.fortuneTellingDate);
      return (
        !this.player.fortuneTellingDate ||
        now.toDateString() !== lastFortune.toDateString()
      );
    },
  },
  methods: {
    tellFortune() {
      if (!this.canTellFortune) return;

      const fortunes = [
        "Đại Cát",
        "Trung Cát",
        "Tiểu Cát",
        "Cát",
        "Cuối Cát",
        "Hung",
        "Đại Hung",
      ];
      const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
      const reward =
        fortune === "Đại Cát"
          ? 50
          : fortune === "Trung Cát"
          ? 30
          : fortune === "Tiểu Cát"
          ? 20
          : 0;

      this.result = {
        message: `Vận mệnh của bạn là: ${fortune}${
          reward > 0 ? `, nhận được ${reward} linh thạch!` : ""
        }`,
      };

      this.player.fortuneTellingDate = new Date().toISOString();
      this.player.props.money += reward;

      this.$emit("game-result", { reward, success: reward > 0 });
    },
  },
};
</script>
<style scoped>
.fortune-telling {
  padding: 20px;
  background-color: var(--el-bg-color);
  border-radius: 12px;
  box-shadow: var(--el-box-shadow-light);
}

.fortune-button {
  width: 100%;
  background-color: var(--el-color-primary);
  color: var(--el-color-white);
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.fortune-button:hover {
  opacity: 0.9;
}

.fortune-button:disabled {
  background-color: var(--el-button-disabled-bg-color);
  color: var(--el-button-disabled-text-color);
}

.result {
  margin-top: 20px;
  font-size: 16px;
  color: var(--el-text-color-primary);
}
</style>
