<template>
  <div class="cultivate">
    <div class="cultivation-info">
      <div class="realm-display">
        Cảnh giới hiện tại：<span
          class="realm-text"
          v-text="
            `${$levelNames(player.level)}(${player.reincarnation || 0} chuyển)`
          "
        />
      </div>
      <el-progress
        :percentage="cultivationPercentage"
        text-inside
        :stroke-width="20"
        status="success"
        class="custom-progress"
      />
    </div>
    <LogPanel
      ref="scrollbar"
      :texts="texts"
    />
    <!-- <div class="storyText">
      <div class="storyText-box">
        <el-scrollbar
          ref="scrollbar"
          always
        >
          <div
            v-for="(item, index) in texts"
            :key="index"
          >
            <tag>
              {{ item.time }}
            </tag>
            <span v-html="item.message" />
          </div>
        </el-scrollbar>
      </div>
    </div> -->
    <div class="actions">
      <div
        class="action"
        v-for="(item, index) in buttonsFor"
        :key="index"
      >
        <el-button
          class="item"
          @click="item.click"
          :disabled="item.disabled"
          v-text="item.text"
        />
      </div>
    </div>
  </div>
</template>

<script>
import LogPanel from "@/components/LogPanel.vue";
import equip from "@/plugins/equip";

export default {
  components: {
    LogPanel,
  },
  data() {
    return {
      texts: [],
      player: {},
      isStop: false,
      isStart: false,
      timerIds: [],
      observer: null,
    };
  },
  beforeUnmount() {
    this.stopCultivate();
    // this.stopObserving();
  },
  computed: {
    buttonsFor() {
      return [
        {
          text: "Bắt đầu tu luyện",
          click: () => this.startCultivate(),
          disabled: !this.isStart,
        },
        {
          text: "Dừng tu luyện",
          click: () => this.stopCultivate(),
          disabled: !this.isStop,
        },
        {
          text: "Chuyển sinh đột phá",
          click: () => this.reincarnationBreakthrough(),
        },
        { text: "Quay về nhà", click: () => this.$router.push("/home") },
      ];
    },
    cultivationPercentage() {
      const { cultivation, maxCultivation } = this.$store.player;
      return Math.min(100, (cultivation / maxCultivation) * 100);
    },
  },
  mounted() {
    this.player = this.$store.player;
    this.startCultivate();
    // this.setupObserver();
  },
  methods: {
    startCultivate() {
      this.isStart = false;
      const zs = this.player.reincarnation * 10;
      const time = zs >= 200 ? 100 : 300 - zs;
      const timerId = setInterval(() => {
        if (this.player.cultivation <= this.player.maxCultivation) {
          this.isStop = true;
          this.isStart = false;
          const exp =
            this.player.level <= 10
              ? Math.floor(
                  this.player.maxCultivation / equip.getRandomInt(10, 30)
                )
              : Math.floor(this.player.maxCultivation / 100);
          this.texts.push(
            {
              message: this.player.level < this.$maxLv
              ? "Bạn bắt đầu thiền định, hấp thụ linh khí xung quanh. Tu vi đã tăng!"
              : "Cảnh giới hiện tại của bạn đã viên mãn, cần chuyển sinh để tiếp tục tu luyện",
              time: new Date().toLocaleTimeString(),
            }
          );
          this.breakThrough(exp);
          // 10% xác suất kích hoạt sự kiện ngẫu nhiên
          if (Math.random() < 0.1) this.triggerRandomEvent();
        } else {
          this.breakThrough(100);
        }
      }, time);
      this.timerIds.push(timerId);
    },
    triggerRandomEvent() {
      const randomEvents = [
        {
          type: "resource",
          name: "Linh thạch",
          amount: 100,
          description: "Bạn phát hiện một đống linh thạch!",
        },
        {
          type: "cultivation",
          name: "Đốn ngộ",
          amount: 500,
          description: "Bạn đột nhiên đốn ngộ, tu vi tăng vọt!",
        },
        {
          type: "item",
          name: "Đan dược",
          effect: "Tăng 100 điểm tu vi",
          description: "Bạn nhận được một viên đan dược quý giá!",
        },
        {
          type: "skill",
          name: "Kiếm pháp",
          effect: "Tăng 10% công kích",
          description: "Bạn lĩnh ngộ một môn kiếm pháp cao thâm!",
        },
        {
          type: "lucky",
          name: "Lôi kiếp",
          effect: "Tu vi giảm 10%",
          description: "Bạn gặp phải lôi kiếp!",
        },
      ];
      const event =
        randomEvents[Math.floor(Math.random() * randomEvents.length)];
      this.texts.push(
        {
          message: `<span style="color: #E6A23C;">${event.description}</span>`,
          time: new Date().toLocaleTimeString(),
        }
      );
      switch (event.type) {
        case "resource":
          this.player.props.money += event.amount;
          break;
        case "cultivation":
          this.player.cultivation += event.amount;
          break;
        // Tăng tu vi
        case "item":
          this.player.cultivation += this.player.cultivation * 0.05;
          break;
        // Giảm tu vi
        case "lucky":
          this.player.cultivation -= this.player.cultivation * 0.1;
          break;
        // Tăng công kích
        case "skill":
          this.player.attack *= 1.1;
          break;
      }
    },
    stopCultivate() {
      this.timerIds.forEach((id) => {
        clearInterval(id);
      });
      this.timerIds = [];
      this.isStart = true;
      this.isStop = false;
    },
    breakThrough(exp) {
      const reincarnation = this.player.reincarnation
        ? this.player.reincarnation + 1
        : 1;
      if (this.player.level < this.$maxLv) {
        if (this.player.cultivation >= this.player.maxCultivation) {
          if (
            this.player.level > 10 &&
            this.player.level > this.player.taskNum
          ) {
            this.stopCultivate();
            this.isStop = false;
            this.isStart = false;
            this.texts.push({
              message: `Tu vi cảnh giới hiện tại đã đầy, bạn cần đánh bại <span class="textColor">(${this.player.taskNum} / ${this.player.level})</span> kẻ địch để chứng đạo đột phá`,
              time: new Date().toLocaleTimeString(),
            });
            return;
          }
          this.player.taskNum = 0;
          this.player.level++;
          this.player.points += 3;
          this.player.health = this.player.maxHealth;
          this.player.maxCultivation = Math.floor(
            100 * Math.pow(2, this.player.level * reincarnation)
          );
          this.texts.push({
            message: `Chúc mừng bạn đã đột phá! Cảnh giới hiện tại: ${this.$levelNames(
              this.player.level
            )}`,
            time: new Date().toLocaleTimeString(),
          });
        } else {
          this.player.cultivation += exp;
        }
      } else {
        this.isStop = false;
        this.isStart = false;
        this.player.level = this.$maxLv;
        this.player.maxCultivation = Math.floor(
          100 * Math.pow(2, this.$maxLv * reincarnation)
        );
        this.stopCultivate();
      }
    },
    reincarnationBreakthrough() {
      let reincarnation = this.player.reincarnation;
      reincarnation = reincarnation == 0 ? 1 * 100 : reincarnation * 100;
      if (this.player.level == this.$maxLv) {
        if (this.player.points) {
          this.$notifys({
            title: "Chưa đủ điều kiện chuyển sinh",
            message: `Hiện còn ${this.player.points} điểm cảnh giới chưa sử dụng, không thể chuyển sinh`,
          });
          return;
        }
        if (this.player.taskNum >= reincarnation) {
          const txt =
            this.player.reincarnation == 0
              ? "Thuộc tính kẻ địch sau chuyển sinh mạnh gấp trăm lần trước chuyển sinh<br>Trước khi chuyển sinh, hãy đảm bảo sức mạnh của bạn đủ để đánh bại đối thủ sau chuyển sinh, tránh bị kẹt tiến độ và phải xóa lưu trữ để chơi lại"
              : "Hành động chuyển sinh không thể hoàn tác, bạn có chắc muốn chuyển sinh?";
          this.$confirm(txt, "Nhắc nhở chuyển sinh", {
            center: true,
            cancelButtonText: "Hủy chuyển sinh",
            confirmButtonText: "Chuyển sinh ngay",
            dangerouslyUseHTMLString: true,
          })
            .then(() => {
              this.player.level = 0;
              this.player.taskNum = 0;
              this.player.cultivation = 0;
              this.player.maxCultivation = 100;
              this.player.reincarnation++;
              this.player.backpackCapacity += 50;
              this.$notifys({
                title: "Gợi ý chuyển sinh",
                message: `Chuyển sinh thành công, hiện tại là ${this.player.reincarnation} chuyển, dung lượng túi tăng thêm 50`,
                dangerouslyUseHTMLString: true,
              });
            })
            .catch(() => {});
        } else {
          this.$notifys({
            title: "Chưa đủ điều kiện chuyển sinh",
            message: `Cần đánh bại <span class="textColor">(${this.player.taskNum} / ${reincarnation})</span> kẻ địch để chứng đạo chuyển sinh`,
            dangerouslyUseHTMLString: true,
          });
        }
      } else {
        this.$notifys({
          title: "Chưa đủ điều kiện chuyển sinh",
          message: `Cảnh giới cần đạt <span class="textColor">${this.$levelNames(
            this.$maxLv
          )}</span> để đủ điều kiện chuyển sinh`,
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // setupObserver() {
    //   const element = this.$refs.scrollbar.wrapRef;
    //   if (element) {
    //     this.observer = new MutationObserver(() =>
    //       this.$smoothScrollToBottom(element)
    //     );
    //     this.observer.observe(element, { subtree: true, childList: true });
    //   }
    // },
    // stopObserving() {
    //   if (this.observer) {
    //     this.observer.disconnect();
    //     this.observer = null;
    //   }
    // },
  },
};
</script>

<style scoped>
.cultivate {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.cultivation-info {
  width: 100%;
  margin-bottom: 20px;
}

.custom-progress {
  width: 100%;
}

.realm-display {
  margin-bottom: 10px;
  font-size: 16px;
  text-align: center;
}

.realm-text {
  color: var(--el-color-primary);
  font-weight: bold;
}

.storyText {
  width: 100%;
}

.storyText-box {
  text-align: left;
  max-height: 300px;
  overflow-y: auto;
  padding: 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
  font-size: 14px;
}

.actions {
  width: 100%;
}

.action {
  width: calc(25% - 10px);
}

.item {
  width: 100%;
}

.event-text {
  color: #e6a23c;
  font-weight: bold;
}

@media (max-width: 768px) {
  .action {
    width: calc(50% - 10px);
  }
}
</style>
