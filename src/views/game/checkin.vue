<template>
  <div class="check-in">
    <div class="check-in-calendar">
      <div
        v-for="day in 7"
        :key="day"
        class="day-box"
        :class="{ checked: isCheckedIn(day), current: isCurrentDay(day) }"
      >
        <span
          class="day-number"
          v-text="day"
        />
        <span
          class="reward"
          v-text="getReward(day)"
        />
      </div>
    </div>
    <el-button
      @click="checkIn"
      :disabled="!canCheckIn"
      class="check-in-button"
      v-text="canCheckIn ? 'Điểm danh' : 'Hôm nay đã điểm danh'"
    />
    <p class="streak-info">
      Số ngày điểm danh liên tục: {{ player.checkinStreak }} ngày
    </p>
    <p class="next-bonus">
      Còn {{ daysUntilNextBonus }} ngày nữa sẽ nhận thưởng thêm
    </p>
  </div>
</template>

<script>
export default {
  name: "CheckIn",
  data() {
    return {
      rewards: [100, 200, 300, 400, 500, 1000, 2000],
      bonusRewards: [100, 2000, 5000],
    };
  },
  computed: {
    player() {
      return this.$store.player;
    },
    canCheckIn() {
      const now = new Date();
      const lastCheckin = new Date(this.player.lastCheckinDate);
      return (
        !this.player.lastCheckinDate ||
        now.toDateString() !== lastCheckin.toDateString()
      );
    },
    daysUntilNextBonus() {
      return 7 - (this.player.checkinStreak % 7);
    },
  },
  methods: {
    isCheckedIn(day) {
      return day <= this.player.checkinStreak % 7;
    },
    isCurrentDay(day) {
      return day === (this.player.checkinStreak % 7) + 1;
    },
    getReward(day) {
      const baseReward = this.rewards[day - 1];
      const bonus =
        day === 7
          ? this.bonusRewards[Math.floor(this.player.checkinStreak / 7)] || 0
          : 0;
      return baseReward + bonus;
    },
    checkIn() {
      if (!this.canCheckIn) return;

      const dayInStreak = (this.player.checkinStreak % 7) + 1;
      let reward = this.rewards[dayInStreak - 1];

      if (dayInStreak === 7) {
        const bonusLevel = Math.floor(this.player.checkinStreak / 7);
        reward += this.bonusRewards[Math.min(bonusLevel, 2)];
      }

      this.player.checkinStreak++;
      this.player.checkinDays++;
      this.player.lastCheckinDate = new Date().toISOString();
      this.player.props.cultivateDan += reward;
      this.player.props.money += dayInStreak * 1000;

      this.$emit("game-result", { success: true, reward });

      this.$notify({
        title: "Điểm danh thành công",
        message: `Bạn đã nhận được ${reward} viên Phục Dược!`,
      });
    },
  },
};
</script>

<style scoped>
.check-in {
  padding: 20px;
  background-color: var(--el-bg-color);
  border-radius: 12px;
  color: var(--el-text-color-primary);
}

h3 {
  color: var(--el-text-color-primary);
}

.check-in-calendar {
  display: flex;
  overflow: auto;
  justify-content: center;
}

.day-box {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--el-fill-color-light);
  font-size: 14px;
  transition: all 0.3s ease;
  color: var(--el-text-color-primary);
  margin-left: 10px;
}

.day-box.checked {
  background-color: var(--el-color-success);
  color: var(--el-color-white);
}

.day-box.current {
  border: 2px solid var(--el-color-primary);
}

.day-number {
  font-weight: bold;
}

.reward {
  font-size: 12px;
}

.check-in-button {
  width: 100%;
  margin-top: 20px;
  background-color: var(--el-color-primary);
  color: var(--el-color-white);
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.check-in-button:disabled {
  background-color: var(--el-button-disabled-bg-color);
  color: var(--el-button-disabled-text-color);
}

.streak-info,
.next-bonus {
  margin-top: 10px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

@media only screen and (max-width: 768px) {
  .check-in-calendar {
    display: -webkit-box;
  }
}
</style>
