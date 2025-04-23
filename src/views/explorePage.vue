<template>
  <div class="explore">
    <div
      class="cultivate"
      v-if="$store.monster.name"
    >
      Bạn đã gặp <span
        class="el-tag el-tag--danger"
        @click="openMonsterInfo"
        v-text="monster.name"
      />
      <div class="storyText">
        <div class="storyText-box">
          <el-scrollbar
            ref="scrollbar"
            always
          >
            <p
              class="fighting"
              v-if="isFighting"
              v-text="`${guashaRounds} hiệp / 10 hiệp`"
            />
            <p
              v-for="(item, index) in texts"
              :key="index"
              v-html="item"
              @click="openEquipmentInfo(openEquipItemInfo)"
            />
          </el-scrollbar>
        </div>
      </div>
      <div class="actions">
        <div class="action">
          <el-button
            class="item"
            @click="operate('startFight')"
            :disabled="isEnd"
          >
            Phát động chiến đấu <span class="shortcutKeys">(Q)</span>
          </el-button>
        </div>
        <div class="action">
          <el-button
            class="item"
            @click="operate('harvestPet')"
            :disabled="isCaptureFailed"
          >
            Thu phục đối phương <span class="shortcutKeys">(E)</span>
          </el-button>
        </div>
        <div class="action">
          <el-button
            @click="operate('runAway')"
            :disabled="isFailedRetreat"
          >
            Rút lui ngay lập tức <span class="shortcutKeys">(R)</span>
          </el-button>
        </div>
        <div class="action">
          <el-button
            class="item"
            @click="operate('explore')"
            :disabled="player.health <= 0"
            v-if="isEnd"
          >
            Tiếp tục khám phá <span class="shortcutKeys">(F)</span>
          </el-button>
        </div>
        <div class="action">
          <el-button
            class="item"
            @click="operate('goHome')"
            v-if="isEnd"
          >
            Về nhà dưỡng thương <span class="shortcutKeys">(G)</span>
          </el-button>
        </div>
      </div>
    </div>
    <div
      class="cultivate error"
      v-else
    >
      <el-result
        icon="error"
        title="Thiếu thông tin đối chiến"
        sub-title="Vui lòng quay lại bản đồ để khám phá lại"
      >
        <template #extra>
          <el-button
            :type="!player.dark ? 'primary' : ''"
            @click="$router.push('/map')"
          >
            Quay lại bản đồ
          </el-button>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script>
// Trang bị
import equip from '@/plugins/equip';
// Thành tựu
import achievement from '@/plugins/achievement';

export default {
    data() {
        return {
            // Nhật ký
            texts: [],
            // Kết thúc chiến đấu
            isEnd: false,
            player: {},
            // Thông tin quái vật
            monster: {},
            loading: true,
            // Chiến thắng
            victory: false,
            timerIds: [],
            isFighting: false,
            // Số hiệp
            guashaRounds: 10,
            // Rút lui thất bại
            isFailedRetreat: false,
            // Thu phục thất bại
            isCaptureFailed: false,
            openEquipItemInfo: {}
        }
    },
    beforeUnmount() {
        this.stopFight();
        // Xóa lắng nghe bàn phím
        window.removeEventListener('keydown', this.operate);
    },
    mounted() {
        this.player = this.$store.player;
        // Kiểm tra thông tin quái vật có tồn tại không
        if (this.$store.monster.name) {
            this.loading = false;
            this.monster = this.$store.monster;
        }
        // Thêm lắng nghe bàn phím
        window.addEventListener('keydown', this.operate);
    },
    methods: {
        // Thao tác người chơi (gán phím tắt)
        operate(oprName) {
            oprName = typeof oprName === 'string' ? oprName : oprName.key;
            switch (oprName) {
                // Phát động chiến đấu
                case 'q':
                case 'startFight':
                    if (!this.isEnd) this.startFight();
                    break;
                // Thu phục đối phương
                case 'e':
                case 'harvestPet':
                    if (!this.isEnd && !this.isCaptureFailed) this.harvestPet(this.monster);
                    break;
                // Rút lui ngay lập tức
                case 'r':
                case 'runAway':
                    if (!this.isEnd && !this.isFailedRetreat) this.runAway();
                    break;
                // Về nhà dưỡng thương
                case 'g':
                case 'goHome':
                    if (this.isEnd) this.goHome();
                    break;
                // Tiếp tục khám phá
                case 'f':
                case 'explore':
                    if (this.isEnd) this.$router.push('/map');
                    return;
                default:
                    return;
            }
        },
        // Về nhà dưỡng thương
        goHome() {
            this.$store.mapData = { y: 0, x: 0, map: [] };
            this.$router.push('/home');
            this.$store.mapScroll = 0;
        },
        // Thông tin quái vật
        openMonsterInfo() {
            const successRate = this.calculateCaptureRate();
            const newProperties = (100 - successRate) * 0.5;
            this.$alert('', this.monster.name, {
                center: true,
                message: `<div class="monsterinfo">
                    <div class="monsterinfo-box">
                        <p>Cảnh giới: ${this.player.level == 0 ? this.$levelNames(this.player.level + 1) : this.$levelNames(this.player.level)}</p>
                        <p>Ngộ tính: ${Math.floor(newProperties)}</p>
                        <p>Khí huyết: ${this.$formatNumberToChineseUnit(this.monster.health)}</p>
                        <p>Công kích: ${this.$formatNumberToChineseUnit(this.monster.attack)}</p>
                        <p>Phòng thủ: ${this.$formatNumberToChineseUnit(this.monster.defense)}</p>
                        <p>Tỷ lệ né tránh: ${this.monster.dodge > 0 ? (this.monster.dodge * 100 > 100 ? 100 : (this.monster.dodge * 100).toFixed(2)) : 0}%</p>
                        <p>Tỷ lệ bạo kích: ${this.monster.critical > 0 ? (this.monster.critical * 100 > 100 ? 100 : (this.monster.critical * 100).toFixed(2)) : 0}%</p>
                        <p>Tỷ lệ thu phục: ${successRate}%</p>
                    </div>
                </div>`,
                confirmButtonText: 'Đã hiểu',
                dangerouslyUseHTMLString: true
            }).catch(() => {});
        },
        // Bắt đầu tấn công
        startFight() {
            if (this.isEnd) return;
            this.isEnd = true;
            this.victory = false;
            const zs = this.player.reincarnation * 10;
            const time = zs >= 200 ? 100 : 300 - zs;
            const timerId = setInterval(() => {
                this.fightMonster();
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
        stopFight() {
            this.timerIds.forEach(id => {
                clearInterval(id);
            });
            this.isEnd = true;
            this.timerIds = [];
            this.isFailedRetreat = true;
            this.isCaptureFailed = true;
        },
        // Tấn công quái vật
        fightMonster() {
            this.isFighting = true;
            if (this.monster.health <= 0) return;
            // Tính toán sát thương quái vật
            const monsterAttack = this.monster.attack; // Công kích quái vật
            const playerDefense = this.player.defense; // Phòng thủ người chơi
            let monsterHarm = Math.max(0, Math.floor(monsterAttack - playerDefense)); // Sát thương quái vật
            monsterHarm = monsterHarm <= 1 ? 1 : monsterHarm; // Sát thương nhỏ hơn 1 thì buộc phá phòng thủ
            // Tính toán sát thương người chơi
            const playerAttack = this.player.attack; // Công kích người chơi
            const monsterDefense = this.monster.defense; // Phòng thủ quái vật
            let playerHarm = Math.max(0, Math.floor(playerAttack - monsterDefense)); // Sát thương cơ bản của người chơi
            playerHarm = playerHarm <= 1 ? 1 : playerHarm; // Sát thương nhỏ hơn 1 thì buộc phá phòng thủ
            // Kiểm tra bạo kích
            let isMCritical = false, isCritical = false;
            // Quái vật có né tránh không
            const isMHit = Math.random() > this.player.dodge;
            // Người chơi có né tránh không
            const isPHit = Math.random() > this.monster.dodge;

            // Kiểm tra quái vật có bạo kích không
            if (Math.random() < this.monster.critical) {
                // Quái vật bạo kích, sát thương tăng gấp đôi
                monsterHarm *= 2;
                // Quái vật bạo kích thành công
                isMCritical = true;
            }

            // Kiểm tra người chơi có bạo kích không
            if (Math.random() < this.player.critical) {
                // Người chơi bạo kích, sát thương tăng 1.5 lần
                playerHarm *= 1.5;
                // Người chơi bạo kích thành công
                isCritical = true;
            }

            // Quái vật không né tránh
            if (isMHit) this.player.health -= monsterHarm;

            // Người chơi không né tránh
            if (isPHit) this.monster.health -= playerHarm;

            this.player.health = Math.max(0, this.player.health);
            this.monster.health = Math.max(0, this.monster.health);

            if (this.guashaRounds > 1) {
                // Giảm số hiệp
                this.guashaRounds--;
                // Khí huyết quái vật nhỏ hơn hoặc bằng 0
                if (this.monster.health <= 0) {
                    // Tăng số lượng tiêu diệt
                    this.player.taskNum++;
                    // Tăng đan bồi dưỡng
                    const reincarnation = this.player.reincarnation ? 1 + 1 * this.player.reincarnation : 1;
                    this.player.props.cultivateDan += reincarnation;
                    // Gửi thông báo
                    this.texts.push(`Sau khi đánh bại ${this.monster.name}, bạn nhận được ${reincarnation} đan bồi dưỡng`);
                    this.findTreasure(this.monster.name);
                    this.stopFight();
                } else if (this.player.health <= 0) {
                    this.texts.push('Bạn quá yếu và đã bị đánh bại.');
                    this.stopFight();
                } else {
                    // Người chơi
                    this.texts.push(!isPHit ? `Bạn tấn công ${this.monster.name}, nhưng đối phương né tránh được, bạn không gây sát thương, còn lại ${this.monster.health} khí huyết.` : `Bạn tấn công ${this.monster.name}, ${isCritical ? 'kích hoạt bạo kích' : ''} gây ${playerHarm} sát thương, còn lại ${this.monster.health} khí huyết.`);
                    // Quái vật
                    this.texts.push(!isMHit ? `${this.monster.name} tấn công bạn, nhưng bạn né tránh được, đối phương không gây sát thương.` : `${this.monster.name} tấn công bạn, ${isMCritical ? 'kích hoạt bạo kích' : ''} gây ${monsterHarm} sát thương.`);
                }
            } else {
                this.guashaRounds = 10;
                this.texts.push(`Hiệp đấu kết thúc, bạn không thể đánh bại ${this.monster.name}, bạn đã thua.`);
                this.stopFight();
            }
        },
        // Rút lui
        runAway() {
            this.guashaRounds--;
            if (equip.getRandomInt(0, 1)) {
                this.isFailedRetreat = true;
                this.texts.push('Rút lui thất bại, tiếp tục chiến đấu.');
            } else {
                this.guashaRounds = 10;
                this.$router.push('/map');
                this.$notifys({ title: 'Gợi ý', message: 'Bạn đã chọn rút lui.' });
            }
        },
        // Tìm thấy đạo cụ
        findTreasure() {
            let equipItem = {};
            let exp = Math.floor(this.player.maxCultivation / 100);
            exp = exp ? exp : 1;
            // Nếu dung lượng túi vượt quá giới hạn
            this.victory = true;
            const randomInt = equip.getRandomInt(1, 4);
            // Thần binh
            if (randomInt == 1) equipItem = equip.equip_Weapons(this.player.level);
            // Hộ giáp
            else if (randomInt == 2) equipItem = equip.equip_Armors(this.player.level);
            // Linh bảo
            else if (randomInt == 3) equipItem = equip.equip_Accessorys(this.player.level);
            // Pháp khí
            else if (randomInt == 4) equipItem = equip.equip_Sutras(this.player.level);
            this.texts.push(`Sau khi đánh bại ${this.monster.name}, bạn phát hiện một rương báu, mở ra nhận được <span class="el-tag el-tag--${equipItem.quality}">${this.$levels[equipItem.quality]}${equipItem.name}(${this.$genre[equipItem.type]})</span>`);
            this.openEquipItemInfo = equipItem;
            // Nếu dung lượng túi trang bị hiện tại vượt quá giới hạn
            if (this.player.inventory.length >= this.player.backpackCapacity) {
                this.texts.push(`Dung lượng túi trang bị hiện tại đã đầy, đạo cụ này tự động bị bỏ, chuyển sinh có thể tăng dung lượng túi.`);
            } else {
                // Người chơi nhận đạo cụ
                this.player.inventory.push(equipItem);
            }
            // Nếu chưa đạt cấp tối đa
            if (this.player.level < this.$maxLv) {
                // Tăng tu vi
                // Nếu cảnh giới hiện tại nhỏ hơn cảnh giới tối đa và tu vi hiện tại lớn hơn hoặc bằng tu vi tối đa
                if (this.player.level < this.$maxLv) {
                    if (this.player.cultivation >= this.player.maxCultivation) {
                        // Nếu cấp độ người chơi lớn hơn 10 và số lượng tiêu diệt nhỏ hơn cấp độ hiện tại
                        if (this.player.level > 10 && this.player.level > this.player.taskNum) {
                            this.texts.push(`Tu vi cảnh giới hiện tại đã đầy, bạn cần đánh bại <span class="textColor">(${this.player.taskNum} / ${this.player.level})</span> kẻ địch để chứng đạo đột phá.`);
                            return;
                        }
                        // Xóa số kẻ địch đã tiêu diệt
                        this.player.taskNum = 0;
                        // Tăng cảnh giới
                        this.player.level++;
                        // Tăng điểm thuộc tính
                        this.player.points += 3;
                        // Cập nhật khí huyết
                        this.player.health = this.player.maxHealth;
                        // Tăng tổng tu vi của người chơi
                        this.player.maxCultivation = Math.floor(100 * Math.pow(2, this.player.level));
                        this.texts.push(`Chúc mừng bạn đã đột phá! Cảnh giới hiện tại: ${this.$levelNames(this.player.level)}`);
                    } else {
                        // Tu vi hiện tại
                        this.player.cultivation += exp;
                    }
                } else {
                    this.isStop = false;
                    this.isStart = false;
                    this.player.level = this.$maxLv;
                    this.player.maxCultivation = Math.floor(100 * Math.pow(2, this.$maxLv));
                    this.texts.push('Cảnh giới hiện tại của bạn đã viên mãn, cần chuyển sinh để tiếp tục tu luyện.');
                }
            }
        },
        // Thông tin đạo cụ tìm thấy
        openEquipmentInfo(item) {
            if (!this.victory) return;
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
                showCancelButton: false,
                confirmButtonText: 'Xác nhận',
                dangerouslyUseHTMLString: true
            }).catch(() => {});
        },
        // Thu phục linh sủng
        harvestPet(item) {
            this.isCaptureFailed = true;
            // Tỷ lệ thành công
            const successRate = this.calculateCaptureRate();
            // Kiểm tra thu phục thành công
            const isSuccess = successRate >= this.getRandomInt(1, 100);
            // Nếu thu phục thành công
            if (isSuccess) {
                // Nếu dung lượng túi linh sủng chưa đầy
                if (this.player.backpackCapacity > this.player.pets.length) {
                    // Thuộc tính sau thu phục dựa trên tỷ lệ thành công
                    const newProperties = Math.floor((100 - successRate) * 0.5);
                    // Công kích
                    const attack = Math.floor(this.getRandomInt(50, 150) * newProperties);
                    // Phòng thủ
                    const defense = Math.floor(this.getRandomInt(1, 15) * newProperties);
                    // Khí huyết
                    const health = Math.floor(this.getRandomInt(100, 500) * newProperties);
                    // Né tránh
                    const dodge = parseFloat(this.getRandomFloatInRange(0.001, 0.01) * newProperties);
                    // Bạo kích
                    const critical = parseFloat(this.getRandomFloatInRange(0.001, 0.01) * newProperties);
                    // Thêm vào túi linh sủng
                    this.player.pets.push({
                        id: Date.now(),
                        lock: false,
                        name: item.name,
                        level: 1,
                        score: equip.calculateEquipmentScore(dodge, attack, health, critical, defense),
                        dodge,
                        health,
                        attack,
                        defense,
                        critical,
                        // Dữ liệu ban đầu
                        initial: {
                            dodge,
                            health,
                            attack,
                            defense,
                            critical,
                            rootBone: newProperties
                        },
                        // Ngộ tính
                        rootBone: newProperties,
                        // Độ thân thiện
                        favorability: 0,
                        // Chuyển sinh
                        reincarnation: 0
                    });
                    // Thành tựu linh sủng của người chơi
                    const petAchievement = this.player.achievement.pet;
                    // Kiểm tra hoàn thành thành tựu
                    const checkAchievement = (item) => {
                        const conditions = item.condition;
                        return (
                            (conditions.health === 0 || conditions.health <= health) &&
                            (conditions.attack === 0 || conditions.attack <= attack) &&
                            (conditions.defense === 0 || conditions.defense <= defense) &&
                            (conditions.dodge === 0 || conditions.dodge <= dodge.toFixed(2)) &&
                            (conditions.critical === 0 || conditions.critical <= critical.toFixed(2))
                        );
                    };
                    // Hoàn thành thành tựu
                    achievement.pet().forEach(item => {
                        // Kiểm tra điều kiện thành tựu và thành tựu chưa hoàn thành
                        if (checkAchievement(item) && !petAchievement.find(i => i.id === item.id)) {
                            // Thêm thành tựu
                            this.player.achievement.pet.push({ id: item.id });
                            // Tăng đan bồi dưỡng
                            this.player.props.cultivateDan += item.award;
                            // Gửi thông báo
                            this.notify({ title: 'Gợi ý nhận thành tựu', message: `Chúc mừng bạn đã hoàn thành thành tựu ${item.name}` });
                        }
                    });
                    this.texts.push(`Thu phục ${item.name} thành công`);
                } else {
                    this.texts.push(`Dung lượng túi linh sủng đã đầy, thu phục ${item.name} thất bại, chuyển sinh có thể tăng dung lượng túi.`);
                }
                // Khôi phục số hiệp
                this.guashaRounds = 10;
                this.stopFight();
            } else {
                this.isCaptureFailed = true;
                this.texts.push(`Thu phục ${item.name} thất bại`);
            }
        },
        // Tính tỷ lệ thu phục linh sủng
        calculateCaptureRate() {
            // Tỷ lệ cơ bản 100%
            const baseRate = 100;
            // Giảm tỷ lệ cơ bản mỗi cấp
            const decayFactor = 0.9800;
            // Tính tỷ lệ thực tế dựa trên cấp độ
            let captureRate = baseRate * Math.pow(decayFactor, this.player.level);
            // Đảm bảo tỷ lệ nằm trong khoảng 0% đến 100%
            captureRate = Math.floor(Math.max(0, Math.min(100, captureRate)));
            return captureRate;
        },
        getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        getRandomFloatInRange(min, max) {
            return Math.random() * (max - min) + min;
        }
    }
}
</script>

<style scoped>
    .actions .action {
        width: calc(33.333% - 10px);
        margin: 5px;
    }

    .shortcutKeys {
        color: rgba(169, 169, 169, 0.4);
        margin-left: 2px;
    }

    .cultivate.error {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 770px;
    }

    @media only screen and (max-width: 768px) {
        .shortcutKeys {
            display: none;
        }
    }
</style>
