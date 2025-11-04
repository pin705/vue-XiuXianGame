<template>
  <div class="cultivate">
    <div class="boss">
      <div class="boss-box">
        <span
          class="el-tag el-tag--warning"
          @click="openBossInfo"
        >{{ boss.name }}</span>
        <el-alert
          class="desc"
          :title="boss.desc"
          :closable="false"
          type="error"
        />
      </div>
    </div>
    <div class="storyText">
      <div class="storyText-box">
        <el-scrollbar
          ref="scrollbar"
          always
        >
          <p
            class="fighting"
            v-if="isFighting"
            v-text="`${guashaRounds} hiệp / 50 hiệp`"
          />
          <p
            v-for="(item, index) in texts"
            :key="index"
            v-html="item"
            @click="openEquipmentInfo(equipmentInfo)"
          />
        </el-scrollbar>
      </div>
    </div>
    <div class="actions">
      <el-button
        @click="startFightBoss"
        :disabled="isEnd"
      >
        Phát động chiến đấu
      </el-button>
      <el-button @click="$router.push('/home')">
        Động phủ dưỡng thương
      </el-button>
    </div>
  </div>
</template>

<script>
// Thế giới boss
import boss from '~/composables/boss';

export default {
    data() {
        return {
            boss: {},
            isEnd: false,
            texts: [],
            player: {},
            timerIds: [],
            currency: 0,
            isFighting: false,
            startFight: false,
            isequipment: false,
            guashaRounds: 50,
            equipmentInfo: {}
        }
    },
    mounted() {
        this.boss = this.$store.boss;
        this.player = this.$store.player;
        this.currency = boss.getRandomInt(1, 10);
        this.assaultBoss();
    },
    beforeUnmount() {
        this.stopFightBoss();
    },
    methods: {
        // Bắt đầu tấn công
        startFightBoss() {
            if (this.isEnd) return;
            this.isEnd = true;
            const zs = this.player.reincarnation * 10;
            const time = zs >= 200 ? 100 : 300 - zs;
            const timerId = setInterval(() => {
                this.fightBoss();
                const element = this.$refs.scrollbar.wrapRef;
                const observer = new MutationObserver(() => {
                    this.$smoothScrollToBottom(element);
                });
                observer.observe(element, {
                    childList: true,
                    subtree: true
                });
            }, time);
            this.timerIds.push(timerId);
        },
        // Dừng tấn công
        stopFightBoss() {
            this.timerIds.forEach(id => {
                clearInterval(id);
            });
            this.timerIds = [];
        },
        // Thông tin boss
        openBossInfo() {
            const info = this.boss;
            this.$confirm('', info.name, {
                center: true,
                message: `<div class="monsterinfo">
                    <div class="monsterinfo-box">
                        <p>Cảnh giới: ${this.$levelNames(info.level)}</p>
                        <p>Khí huyết: ${this.$formatNumberToChineseUnit(info.health)}</p>
                        <p>Công kích: ${this.$formatNumberToChineseUnit(info.attack)}</p>
                        <p>Phòng thủ: ${this.$formatNumberToChineseUnit(info.defense)}</p>
                        <p>Tỷ lệ né tránh: ${info.dodge > 0 ? (info.dodge * 100 > 100 ? 100 : (info.dodge * 100).toFixed(2)) : 0}%</p>
                        <p>Tỷ lệ bạo kích: ${info.critical > 0 ? (info.critical * 100 > 100 ? 100 : (info.critical * 100).toFixed(2)) : 0}%</p>
                        <p>Rơi Hồng Mông Thạch: ${this.currency} viên</p>
                        <p>Tỷ lệ rơi thần trang: 100%</p>
                    </div>
                </div>`,
                showCancelButton: false,
                confirmButtonText: 'Đã hiểu',
                dangerouslyUseHTMLString: true
            }).catch(() => {});
        },
        // Tấn công thế giới boss
        fightBoss() {
            if (this.player.level < this.$maxLv) {
                this.isEnd = true;
                this.stopFightBoss();
                this.texts.push(`Cảnh giới của bạn chưa đạt ${this.$levelNames(this.$maxLv)}, ${this.boss.name} khinh thường thử thách của bạn`);
                return;
            }
            if (this.boss.health <= 0 || !this.boss.health) {
                this.texts.push('Thời gian làm mới BOSS chưa đến');
                return;
            }
            this.isFighting = true;
            // Tính sát thương boss
            const monsterAttack = this.boss.attack; // Công kích boss
            const playerDefense = this.player.defense; // Phòng thủ người chơi
            let monsterHarm = Math.max(0, Math.floor(monsterAttack - playerDefense)); // Sát thương boss
            monsterHarm = monsterHarm <= 1 ? 1 : monsterHarm; // Sát thương nhỏ hơn 1 thì buộc phá phòng thủ
            // Tính sát thương người chơi
            const playerAttack = this.player.attack; // Công kích người chơi
            const monsterDefense = this.boss.defense; // Phòng thủ boss
            let playerHarm = Math.max(0, Math.floor(playerAttack - monsterDefense)); // Sát thương cơ bản của người chơi
            playerHarm = playerHarm <= 1 ? 1 : playerHarm; // Sát thương nhỏ hơn 1 thì buộc phá phòng thủ
            // Kiểm tra bạo kích
            let isMCritical = false, isCritical = false;
            // Người chơi có né tránh không
            const isPlayerHit = Math.random() > this.boss.dodge;
            // Boss có né tránh không
            const isBHit = Math.random() > this.player.dodge;

            // Kiểm tra boss có bạo kích không
            if (Math.random() < this.boss.critical) {
                // Boss bạo kích, sát thương tăng gấp đôi
                monsterHarm *= 2;
                // Boss bạo kích thành công
                isMCritical = true;
            }

            // Kiểm tra người chơi có bạo kích không
            if (Math.random() < this.player.critical) {
                // Người chơi bạo kích, sát thương tăng 1.5 lần
                playerHarm *= 1.5;
                // Người chơi bạo kích thành công
                isCritical = true;
            }

            // Nếu người chơi không né tránh, trừ khí huyết người chơi
            if (isBHit) this.player.health -= monsterHarm;

            // Nếu boss không né tránh, trừ khí huyết boss
            if (isPlayerHit) this.boss.health -= playerHarm;

            this.player.health = Math.max(0, this.player.health);
            this.boss.health = Math.max(0, this.boss.health);

            if (this.guashaRounds > 1) {
                // Giảm số hiệp
                this.guashaRounds--;
                // Khí huyết boss nhỏ hơn hoặc bằng 0
                if (this.boss.health <= 0) {
                    const equipItem = boss.boss_Equip(this.$maxLv);
                    this.isequipment = true;
                    this.equipmentInfo = equipItem;
                    this.texts.push(`Sau khi đánh bại ${this.boss.name}, bạn nhận được <span class="el-tag el-tag--${equipItem.quality}">${this.$levels[equipItem.quality]}${equipItem.name}(${this.$genre[equipItem.type]})</span>`);
                    // Nếu dung lượng túi trang bị hiện tại vượt quá giới hạn
                    if (this.player.inventory.length >= this.player.backpackCapacity) this.texts.push(`Dung lượng túi trang bị hiện tại đã đầy, trang bị này tự động bị bỏ, chuyển sinh có thể tăng dung lượng túi`);
                    // Người chơi nhận đạo cụ
                    else this.player.inventory.push(equipItem);
                    // Tăng đan ngộ tính
                    this.player.props.rootBone += 1;
                    // Thông báo nhận đan ngộ tính
                    this.texts.push('Bạn nhận được 1 viên đan ngộ tính');
                    // Tăng Hồng Mông Thạch
                    this.player.props.currency += this.currency;
                    // Thông báo nhận Hồng Mông Thạch
                    this.texts.push(`Bạn nhận được ${this.currency} viên Hồng Mông Thạch`);
                    // Thay đổi trạng thái nút
                    this.isEnd = true;
                    // Thay đổi trạng thái boss
                    this.boss.time = Math.floor(Date.now() / 1000);
                    this.boss.health = 0;
                    this.boss.conquer = true;
                    this.stopFightBoss();
                } else if (this.player.health <= 0) {
                    this.isEnd = true;
                    // Phục hồi khí huyết boss
                    this.boss.health = this.boss.maxhealth;
                    this.texts.push('Bạn quá yếu và đã bị đánh bại.');
                    this.texts.push(`${this.boss.text}`);
                    this.stopFightBoss();
                    this.guashaRounds = 50;
                } else {
                    this.texts.push(isPlayerHit ? `Bạn tấn công ${this.boss.name}, ${isCritical ? 'kích hoạt bạo kích' : ''} gây ${playerHarm} sát thương, còn ${this.boss.health} khí huyết.` : `Bạn tấn công ${this.boss.name}, nhưng đối phương né tránh được, bạn không gây sát thương, còn ${this.boss.health} khí huyết.`);
                    this.texts.push(isBHit ? `${this.boss.name} tấn công bạn, ${isMCritical ? 'kích hoạt bạo kích' : ''} gây ${monsterHarm} sát thương.` : `${this.boss.name} tấn công bạn, nhưng bạn né tránh được, đối phương không gây sát thương, bạn còn ${this.player.health} khí huyết.`);
                }
            } else {
                // Phục hồi số hiệp mặc định
                this.guashaRounds = 50;
                this.stopFightBoss();
                // Phục hồi khí huyết boss
                this.boss.health = this.boss.maxhealth;
                this.texts.push(`Hiệp đấu kết thúc, bạn không thể đánh bại ${this.boss.name}, bạn đã thua.`);
                this.texts.push(`${this.boss.text}`);
            }
        },
        openEquipmentInfo(item) {
            if (!this.isequipment) return;
            this.$confirm('', item.name, {
                center: true,
                message: `<div class="monsterinfo">
                    <div class="monsterinfo-box">
                        <p>Loại: ${this.$genre[item.type] ?? 'Không xác định'}</p>
                        <p>Cảnh giới: ${this.$levelNames(item.level)}</p>
                        <p>Phẩm chất: ${this.$levels[item.quality] ?? 'Không xác định'}</p>
                        <p>Khí huyết: ${this.$formatNumberToChineseUnit(item.health)}</p>
                        <p>Công kích: ${this.$formatNumberToChineseUnit(item.attack)}</p>
                        <p>Phòng thủ: ${this.$formatNumberToChineseUnit(item.defense)}</p>
                        <p>Tỷ lệ né tránh: ${(item.dodge * 100).toFixed(2) ?? 0}%</p>
                        <p>Tỷ lệ bạo kích: ${(item.critical * 100).toFixed(2) ?? 0}%</p>
                    </div>
                </div>`,
                showClose: false,
                closeOnClickModal: false,
                closeOnPressEscape: false,
                dangerouslyUseHTMLString: true
            }).then(() => {
                this.$router.push('/home');
            }).catch(() => {
                this.$router.push('/home');
            });
        },
        // Thế giới BOSS
        assaultBoss() {
            // Thời gian sinh boss
            const time = this.getMinuteDifference(this.boss.time);
            // Độ khó boss dựa trên cấp độ tối đa của người chơi + số lần chuyển sinh
            const bossLv = this.$maxLv * this.player.reincarnation + this.$maxLv;
            // Kiểm tra khí huyết và thời gian của boss
            if (this.boss.health > 0) {
                // Nếu boss còn khí huyết, cho phép người chơi thách đấu
                if (time >= 5) {
                    // Nếu boss hết khí huyết nhưng thời gian lớn hơn hoặc bằng 5 phút, tạo lại boss
                    this.boss = boss.drawPrize(bossLv);
                }
            } else {
                if (time >= 5 || this.boss.time == 0) {
                    // Nếu boss hết khí huyết nhưng thời gian lớn hơn hoặc bằng 5 phút, tạo lại boss
                    this.boss = boss.drawPrize(bossLv);
                } else {
                    this.isEnd = true;
                    this.texts.push('BOSS chưa làm mới, vui lòng đợi 5 phút để thử thách lại');
                    return;
                }
            }
            // Cập nhật số hiệp
            this.guashaRounds = 50;
        },
        // Tính số phút chênh lệch giữa thời gian hiện tại và thời gian chỉ định
        getMinuteDifference(specifiedTimestamp) {
            // Lấy thời gian hiện tại (tính bằng giây)
            const currentTimestamp = Math.floor(Date.now() / 1000);
            specifiedTimestamp = specifiedTimestamp == 0 ? currentTimestamp : specifiedTimestamp;
            // Tính chênh lệch thời gian (tính bằng phút)
            const timeDifferenceInSeconds = Math.abs(currentTimestamp - specifiedTimestamp);
            const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60);
            return timeDifferenceInMinutes;
        }
    }
}
</script>

<style scoped>
    .boss-box .desc {
        margin: 10px 0;
    }
</style>
