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
    <!-- <el-scrollbar
      class="battle-log"
      height="300px"
      ref="scrollbar"
      always
    >
      <p
        v-for="(log, index) in battleLogs"
        :key="index"
        v-html="log"
      />
    </el-scrollbar> -->
  </div>
</template>

<script>
// Thành phần thẻ
import tag from '@/components/tag.vue';
// Boss
import boss from '@/plugins/boss';
// Trang bị
import equip from '@/plugins/equip';
// Quái vật
import LogPanel from '@/components/LogPanel.vue';
import { checkAchievements } from '@/plugins/achievementChecker';
import combatSystem from '@/plugins/combat';
import monsters from '@/plugins/monster';

export default {
    components: {
        LogPanel
    },
    data() {
        return {
            // Dữ liệu người chơi
            player: {},
            // Dữ liệu quái vật
            monster: null,
            observer: null,
            // Thời gian càn quét
            sweepTime: 0,
            // Nhật ký chiến đấu
            battleLogs: [],
            // Tầng hiện tại
            currentFloor: 1,
            // Đang càn quét
            isSweeping: false,
            // Kết quả càn quét
            sweepResults: {
                // Tu vi nhận được
                expGain: 0,
                // Linh thạch nhận được
                moneyGain: 0,
                // Số lượng trang bị nhận được
                equipmentGained: 0
            },
            // Trạng thái khí huyết người chơi
            playerStatus: 'success',
            // Trạng thái khí huyết quái vật
            monsterStatus: 'success',
            // Khoảng thời gian càn quét
            sweepInterval: null,
            // Đang chiến đấu tự động
            isAutoFighting: false,
            // Khoảng thời gian chiến đấu tự động
            autoFightInterval: null,
            // Khoảng thời gian chiến đấu càn quét
            sweepFightInterval: null
        }
    },
    created() {
        // Dữ liệu người chơi
        this.player = this.$store.player;
        // Kiểm tra thành tựu
        const newAchievements = checkAchievements(this.player, 'monster');
        newAchievements.forEach(achievement => {
            this.$notifys({
                title: 'Gợi ý nhận thành tựu',
                message: `Chúc mừng bạn đã hoàn thành thành tựu ${achievement.name}`
            });
        });
        // Tầng hiện tại
        this.currentFloor = this.player.highestTowerFloor > 1 ? this.player.highestTowerFloor - 1 : 1
    },
    mounted() {
        // Tạo nhật ký
        this.battleLogs.push({
            message: `Chào mừng đến với Vô Tận Tháp, đây là tầng ${this.currentFloor} của Vô Tận Tháp, kỷ lục leo tháp cao nhất của bạn là ${this.player.highestTowerFloor} tầng`,
            time: new Date().toLocaleTimeString()
        });
        // Tạo quái vật
        this.generateMonster();
    },
    beforeUnmount() {
        // Dừng chiến đấu tự động
        this.stopAutoFight();
        // Dừng càn quét
        this.stopSweep();
        // this.stopObserving();
    },
    watch: {
        // battleLogs: {
        //     deep: true,
        //     handler() {
        //         // this.setupObserver();
        //     }
        // },
        'player.health': function(val) {
            const { health, maxHealth } = this.player;
            this.playerStatus = this.getStatus(health, maxHealth);
        },
        'monster.health': function(val) {
            const { health, maxHealth } = this.monster;
            this.monsterStatus = this.getStatus(health, maxHealth);
        }
    },
    components: {
        tag
    },
    computed: {
        // Thông tin liên quan đến càn quét
        sweepData() {
            return [
                { name: 'Thời gian càn quét', suffix: this.formatTime(this.sweepTime) },
                { name: 'Tu vi nhận được', suffix: `${this.$formatNumberToChineseUnit(this.sweepResults.expGain)} điểm` },
                { name: 'Linh thạch nhận được', suffix: `${this.$formatNumberToChineseUnit(this.sweepResults.moneyGain)} khối` },
                { name: 'Trang bị nhận được', suffix: `${this.$formatNumberToChineseUnit(this.sweepResults.equipmentGained)} món` },
            ];
        },
        // Nút
        buttonData() {
            return [
                { text: this.isAutoFighting ? 'Dừng đối chiến' : 'Chiến đấu tự động', click: () => this.toggleAutoFight(), disabled: this.isSweeping || this.player.health <= 0 },
                { text: 'Tiến hành đối chiến', click: () => this.fight(), disabled: this.isSweeping || this.isAutoFighting || !this.monster || this.player.health <= 0 },
                { text: this.isSweeping ? 'Dừng càn quét' : 'Bắt đầu càn quét', click: () => this.toggleSweep(), disabled: this.isAutoFighting || this.player.health <= 0 },
                { text: 'Rút lui về nhà', click: () => this.retreat(), disabled: false }
            ];
        },
        // Thanh tiến độ khí huyết người chơi
        playerProgress() {
            return (this.player.health / this.player.maxHealth) * 100;
        },
        // Thanh tiến độ khí huyết quái vật
        monsterProgress() {
            return (this.monster.health / this.monster.maxHealth) * 100;
        }
    },
    methods: {
        // Khí huyết người chơi
        playerHealth() {
            const { health, maxHealth } = this.player;
            return `${Math.max(0, health)} / ${Math.max(0, maxHealth)}`;
        },
        // Khí huyết quái vật
        monsterhealth() {
            const { health, maxHealth } = this.monster;
            return `${Math.max(0, health)} / ${Math.max(0, maxHealth)}`;
        },
        // Thay đổi trạng thái khí huyết động
        getStatus(health, maxHealth) {
            const num = (health / maxHealth) * 100;
            return num >= 70 ? 'success' : (num >= 30 ? 'warning' : 'exception');
        },
        // Tạo quái vật của tầng hiện tại
        generateMonster() {
            // Tính cấp độ quái vật dựa trên tầng hiện tại
            const level = this.currentFloor * 2;
            const health = monsters.monster_Health(level);
            this.monster = {
                // Tên
                name: monsters.monster_Names(level),
                // Cấp độ
                level,
                // Tỷ lệ né tránh
                dodge: monsters.monster_Criticalhitrate(level),
                // Công kích
                attack: monsters.monster_Attack(level),
                // Khí huyết
                health: health,
                // Phòng thủ
                defense: monsters.monster_Defense(level),
                // Khí huyết tối đa
                maxHealth: health,
                // Tỷ lệ bạo kích
                critical: monsters.monster_Criticalhitrate(level)
            };
            // Nhật ký
            this.battleLogs.push({
                message: `Bạn đã gặp người thủ hộ tầng này <span class="text-red-400">${this.monster.name}</span>`,
                time: new Date().toLocaleTimeString()
            });
        },
        // Mở cửa sổ thông tin của cả hai bên
        openInfo(type) {
            const isPlayer = type == 'player';
            const info = isPlayer ? this.player : this.monster;
            this.$confirm('', isPlayer ? this.player.name : info.name, {
                center: true,
                message: `<div class="monsterinfo">
                    <div class="monsterinfo-box">
                        <p>Khí huyết: ${this.$formatNumberToChineseUnit(info.health)}</p>
                        <p>Công kích: ${this.$formatNumberToChineseUnit(info.attack)}</p>
                        <p>Phòng thủ: ${this.$formatNumberToChineseUnit(info.defense)}</p>
                        <p>Tỷ lệ né tránh: ${info.dodge > 0 ? (info.dodge * 100 > 100 ? 100 : (info.dodge * 100).toFixed(2)) : 0}%</p>
                        <p>Tỷ lệ bạo kích: ${info.critical > 0 ? (info.critical * 100 > 100 ? 100 : (info.critical * 100).toFixed(2)) : 0}%</p>
                    </div>
                </div>`,
                showCancelButton: false,
                confirmButtonText: 'Đã hiểu',
                dangerouslyUseHTMLString: true
            }).catch(() => {});
        },
        // Tiến hành chiến đấu
        fight() {
            // Bị đánh bại
            if (this.player.health <= 0) {
                this.handlePlayerDefeat();
                return;
            }
            // Tạo quái vật mới
            if (!this.monster || this.monster.health <= 0) {
                this.generateMonster();
                return;
            }
            // Người chơi tấn công quái vật
            const playerAttackResult = combatSystem.executeCombatRound(this.player, this.monster);
            this.generateCombatLog(this.player.name, this.monster.name, playerAttackResult);
            // Kiểm tra quái vật có bị đánh bại không
            if (this.monster.health <= 0) {
                this.handleMonsterDefeat();
                return;
            }
            // Quái vật tấn công người chơi
            const monsterAttackResult = combatSystem.executeCombatRound(this.monster, this.player);
            this.generateCombatLog(this.monster.name, this.player.name, monsterAttackResult);
            // Kiểm tra người chơi có bị đánh bại không
            if (this.player.health <= 0) {
                this.handlePlayerDefeat();
            }
        },
        generateCombatLog(attackerName, defenderName, result) {
            if (!result.isHit) {
                this.battleLogs.push({
                    message: `Tấn công của ${attackerName} bị ${defenderName} né tránh.`,
                    time: new Date().toLocaleTimeString()
                });
            } else {
                let logMessage = `<span class="text-green-400">${attackerName}</span> gây <span class="text-yellow-400">${result.damage} sát thương</span> cho <span class="text-red-400">${defenderName}</span>`;
                if (result.isCritical) logMessage += ' (bạo kích!)';
                logMessage += `, ${defenderName} còn ${result.remainingHealth} khí huyết.`;
                this.battleLogs.push({
                    message: logMessage,
                    time: new Date().toLocaleTimeString()
                });
            }
        },
        // Xử lý khi quái vật bị đánh bại
        handleMonsterDefeat() {
            // Tu vi
            const expGain = Math.floor(this.monster.level * 100);
            // Linh thạch
            const moneyGain = Math.floor(this.monster.level * 2);
            // Tăng tu vi
            this.player.cultivation += expGain;
            // Tăng linh thạch
            this.player.props.money += moneyGain;
            // Nhật ký
            this.battleLogs.push({
                message: `Bạn đã đánh bại ${this.monster.name}!`,
                time: new Date().toLocaleTimeString()
            });
            this.battleLogs.push({
                message: `Nhận được ${expGain} điểm tu vi và ${moneyGain} linh thạch`,
                time: new Date().toLocaleTimeString()
            });
            // Nhận trang bị ngẫu nhiên
            this.getRandomEquipment();
            // Tăng tầng
            this.currentFloor++;
            // Kiểm tra tầng chia hết cho 5 và chưa nhận thưởng tầng đó
            if (this.currentFloor % 5 === 0 && !this.player.rewardedTowerFloors.includes(this.currentFloor)) {
                this.player.props.cultivateDan += 500;
                this.player.rewardedTowerFloors.push(this.currentFloor);
                this.battleLogs.push({
                    message: `Chúc mừng bạn đã vượt qua tầng ${this.currentFloor}, nhận thêm phần thưởng: 500 đan bồi dưỡng!`,
                    time: new Date().toLocaleTimeString()
                });
            }
            // Nếu tầng hiện tại vượt kỷ lục cao nhất
            if (this.currentFloor > this.player.highestTowerFloor) this.player.highestTowerFloor = this.currentFloor;
            // Nhật ký
            this.battleLogs.push({
                message: `Vượt qua tầng ${this.currentFloor - 1} thành công, tự động tiến đến tầng ${this.currentFloor}`,
                time: new Date().toLocaleTimeString()   
            });
            // Tạo quái vật mới (tầng tiếp theo)
            this.generateMonster();
        },
        // Xử lý khi người chơi bị đánh bại
        handlePlayerDefeat() {
            // Nhật ký
            this.battleLogs.push({
                message: 'Bạn đã bị đánh bại! Thử thách kết thúc.',
                time: new Date().toLocaleTimeString()
            });
            this.battleLogs.push({
                message: `${this.monster.name}: ${boss.drawPrize(this.monster.level).text}`,
                time: new Date().toLocaleTimeString()
            });
            // Tắt chiến đấu tự động
            this.isAutoFighting = false;
            // Tắt càn quét
            this.isSweeping = false;
            // Dừng chiến đấu tự động
            this.stopAutoFight();
            // Dừng càn quét
            this.stopSweep();
        },
        // Chuyển đổi trạng thái chiến đấu tự động
        toggleAutoFight() {
            // Chuyển đổi trạng thái chiến đấu tự động
            this.isAutoFighting = !this.isAutoFighting;
            // Bắt đầu chiến đấu tự động
            if (this.isAutoFighting) this.autoFightInterval = setInterval(this.fight, 1000);
            // Dừng chiến đấu tự động
            else this.stopAutoFight();
        },
        // Dừng chiến đấu tự động
        stopAutoFight() {
            clearInterval(this.autoFightInterval);
            this.autoFightInterval = null;
        },
        // Rút lui
        retreat() {
            // Tắt chiến đấu tự động
            this.isAutoFighting = false;
            // Tắt càn quét
            this.isSweeping = false;
            // Dừng chiến đấu tự động
            this.stopAutoFight();
            // Dừng càn quét
            this.stopSweep();
            this.$router.push('/home');
        },
        // Nhận trang bị ngẫu nhiên
        getRandomEquipment() {
            let equipItem = {};
            let exp = Math.floor(this.player.maxCultivation / 100);
            exp = exp ? exp : 1;
            // Chiến thắng
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
            this.battleLogs.push({
                message: `Bạn phát hiện một rương báu, mở ra nhận được ${this.$levels[equipItem.quality]} ${equipItem.name} (${this.$genre[equipItem.type]})`,
                time: new Date().toLocaleTimeString()
            });
            // Thông tin trang bị
            this.openEquipItemInfo = equipItem;
            // Nếu túi đầy thì không thêm trang bị
            if (this.player.inventory.length >= this.player.backpackCapacity) {
                this.battleLogs.push({
                    message: `Dung lượng túi trang bị hiện tại đã đầy, trang bị này tự động bị bỏ, chuyển sinh có thể tăng dung lượng túi`,
                    time: new Date().toLocaleTimeString()
                });
            } else this.player.inventory.push(equipItem);
        },
        // Chuyển đổi trạng thái càn quét
        toggleSweep() {
            // Trạng thái càn quét
            this.isSweeping = !this.isSweeping;
            if (this.isSweeping) {
                // Đặt lại thời gian càn quét
                this.sweepTime = 0;
                // Đặt lại kết quả càn quét
                this.sweepResults = { expGain: 0, moneyGain: 0, equipmentGained: 0 };
                // Cập nhật thời gian càn quét mỗi giây
                this.sweepInterval = setInterval(this.sweep, 1000);
                // Tiến hành chiến đấu càn quét mỗi 30 giây
                this.sweepFightInterval = setInterval(this.sweepFight, 30000);
            } else {
                // Dừng càn quét
                this.stopSweep();
            }
        },
        // Dừng càn quét
        stopSweep() {
            clearInterval(this.sweepInterval);
            clearInterval(this.sweepFightInterval);
            this.sweepInterval = null;
            this.sweepFightInterval = null;
        },
        // Tiến hành càn quét
        sweep() {
            // Tăng thời gian càn quét
            this.sweepTime++;
            // Cập nhật nhật ký mỗi 60 giây
            if (this.sweepTime % 60 === 0) this.battleLogs.push({
                message: `Kết quả càn quét: Hiện đã càn quét ${this.formatTime(this.sweepTime)}, chúc mừng bạn nhận được ${this.sweepResults.expGain} điểm tu vi, ${this.sweepResults.moneyGain} linh thạch và ${this.sweepResults.equipmentGained} món trang bị.`,
                time: new Date().toLocaleTimeString()
            });
        },
        // Chiến đấu càn quét
        sweepFight() {
            // Tính tu vi nhận được dựa trên tầng hiện tại
            const expGain = Math.floor(this.currentFloor * 10);
            // Tính linh thạch nhận được dựa trên tầng hiện tại
            const moneyGain = Math.floor(this.currentFloor * 10);
            // Tăng tu vi người chơi
            this.player.cultivation += expGain;
            // Tăng linh thạch người chơi
            this.player.props.money += moneyGain;
            // Tăng số lượng tiêu diệt
            this.player.jishaNum++;
            // Cập nhật tu vi trong kết quả càn quét
            this.sweepResults.expGain += expGain;
            // Cập nhật linh thạch trong kết quả càn quét
            this.sweepResults.moneyGain += moneyGain;
            // 10% xác suất nhận trang bị
            const equipmentGained = Math.random() < 0.1;
            if (equipmentGained) {
                this.getRandomEquipment();
                this.sweepResults.equipmentGained++;
            }
            // Nhật ký
            this.battleLogs.push({
                message: `Kết quả càn quét: Chúc mừng bạn nhận được ${expGain} điểm tu vi, ${moneyGain} khối linh thạch${equipmentGained ? ' và 1 món trang bị' : '.'}`,
                time: new Date().toLocaleTimeString()
            });
        },
        // async setupObserver() {
        //     await this.$nextTick();
        //     const element = this.$refs.scrollbar.scrollbarRef
        //     if (element) {
        //         this.observer = new MutationObserver(() => this.$smoothScrollToBottom(element));
        //         this.observer.observe(element, { subtree: true, childList: true });
        //     }
        // },
        // stopObserving() {
        //     if (this.observer) {
        //         this.observer.disconnect();
        //         this.observer = null;
        //     }
        // },
        formatTime(seconds) {
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
        }
    }
}
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
