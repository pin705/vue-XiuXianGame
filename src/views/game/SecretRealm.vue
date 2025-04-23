<template>
  <div class="secret-realm">
    <div class="game-info">
      <div class="info-item">
        <span class="info-label">Lượt khám phá</span>
        <span
          class="info-value"
          v-text="movesLeft"
        />
      </div>
      <div class="info-item">
        <span class="info-label">Linh thạch nhận được</span>
        <span
          class="info-value"
          v-text="rewardMoney"
        />
      </div>
    </div>
    <div class="game-board">
      <template
        v-for="(row, rowIndex) in board"
        :key="rowIndex"
      >
        <div
          v-for="(cell, colIndex) in row"
          :key="colIndex"
          class="board-cell"
          :class="{ 'revealed': cell.revealed, [cell.type]: cell.revealed }"
          @click="revealCell(rowIndex, colIndex)"
          v-text="cell.revealed ? getCellContent(cell) : ''"
        />
      </template>
    </div>
    <div class="new-game-button">
      <el-button
        @click="startNewGame"
        :disabled="!gameOver"
        v-text="'Đang khám phá...'"
        v-if="!gameOver && canExplore"
      />
      <el-countdown
        title="Thời gian khám phá tiếp theo"
        :value="nextExploreTime"
        @finish="startNewGame"
        v-else
      />
    </div>
  </div>
</template>
  
  <script>
  export default {
    name: 'SecretRealm',
    data () {
      return {
        board: [],
        gameOver: false,
        boardSize: 8,
        movesLeft: 20,
        cellTypes: {
          TRAP: 'trap',
          EMPTY: 'empty',
          EVENT: 'event',
          REWARD: 'reward',
          MONSTER: 'monster'
        },
        rewardMoney: 0
      }
    },
    computed: {
      player () {
        return this.$store.player;
      },
      canExplore () {
        return Date.now() >= this.nextExploreTime;
      },
      nextExploreTime () {
        return this.player.nextGameTimes.secretrealm;
      }
    },
    mounted () {
      this.startNewGame();
    },
    methods: {
      initializeBoard () {
        this.board = Array(this.boardSize).fill().map(() =>
          Array(this.boardSize).fill().map(() => ({
            type: this.cellTypes.EMPTY,
            revealed: false
          }))
        );
        this.placeRandomCells(this.cellTypes.REWARD, 10);
        this.placeRandomCells(this.cellTypes.MONSTER, 5);
        this.placeRandomCells(this.cellTypes.TRAP, 3);
        this.placeRandomCells(this.cellTypes.EVENT, 5);
      },
      placeRandomCells (type, count) {
        for (let i = 0; i < count; i++) {
          let row, col;
          do {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * this.boardSize);
          } while (this.board[row][col].type !== this.cellTypes.EMPTY);
          this.board[row][col].type = type;
        }
      },
      revealCell (row, col) {
        if (this.gameOver || this.board[row][col].revealed || !this.canExplore || this.movesLeft <= 0) return;
        const cell = this.board[row][col];
        cell.revealed = true;
        this.movesLeft--;
        switch (cell.type) {
          case this.cellTypes.REWARD:
            const reward = Math.floor(Math.random() * 5000) + 500;
            this.$notifys({ title: 'Tìm được linh thạch!', message: `Nhận được ${reward} linh thạch` });
            this.rewardMoney += reward;
            this.player.props.money += reward;
            break;
          case this.cellTypes.MONSTER:
            this.$notifys({ title: 'Xui thật đấy', message: 'Gặp phải một con quái vật!' });
            this.startBattle();
            break;
          case this.cellTypes.TRAP:
            const damage = Math.floor(Math.random() * 2000) + 500;
            this.player.health = Math.max(0, this.player.health - damage);
            this.$notifys({ title: 'Xui xẻo', message: `Mất ${damage} máu` });
            break;
          case this.cellTypes.EVENT:
            this.triggerRandomEvent();
            break;
        }
        if (this.movesLeft <= 0) {
          this.gameOver = true;
          this.player.nextGameTimes.secretrealm = Date.now() + 120 * 60 * 1000;
        }
      },
      getCellContent (cell) {
        const { TRAP, EVENT, REWARD, MONSTER } = this.cellTypes;
        const contents = {
          [TRAP]: '💥',
          [EVENT]: '❓',
          [REWARD]: '💰',
          [MONSTER]: '👹'
        };
        return contents[cell.type] || '';
      },
      startBattle () {
        const playerWon = Math.random() > 0.5;
        if (playerWon) {
          const battleReward = Math.floor(Math.random() * 200) + 100;
          this.rewardMoney += battleReward;
          this.player.props.money += battleReward;
        } else {
          const damage = Math.floor(Math.random() * 30) + 20;
          this.player.health = Math.max(0, this.player.health - damage);
        }
      },
      triggerRandomEvent () {
        const events = [
          { name: 'Bùa may mắn', effect: () => { this.rewardMoney *= 2; } },
          { name: 'Bị sét đánh', effect: () => { this.player.health = Math.max(0, this.player.health - 50); } },
          { name: 'Linh cảm ngộ đạo', effect: () => { this.player.cultivation += 100; } },
          { name: 'Lạc phương hướng', effect: () => { this.movesLeft = Math.max(1, this.movesLeft - 5); } },
          { name: 'Bản đồ kho báu', effect: () => { this.movesLeft += 5; } }
        ];
        const event = events[Math.floor(Math.random() * events.length)];
        this.$notifys({ title: 'Sự kiện ngẫu nhiên', message: event.name });
        event.effect();
      },
      startNewGame () {
        this.gameOver = false;
        this.movesLeft = 20;
        this.rewardMoney = 0;
        this.initializeBoard();
      }
    }
  }
  </script>

<style scoped>
    .secret-realm {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        color: var(--el-text-color-primary);
        background-color: var(--el-bg-color);
    }

    .game-info {
        display: flex;
        justify-content: space-between;
        width: 100%;
        max-width: 400px;
    }

    .info-item {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .info-label {
        font-size: 14px;
        color: var(--el-text-color-secondary);
    }

    .info-value {
        font-size: 18px;
        font-weight: 600;
        margin-top: 5px;
        color: var(--el-color-primary);
    }

    .game-board {
        display: inline-grid;
        grid-template-columns: repeat(8, 1fr);
        gap: 0px;
        background-color: var(--el-border-color);
        margin: 20px 0;
    }

    .board-cell {
        width: 40px;
        height: 40px;
        background-color: var(--el-fill-color-light);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        cursor: pointer;
        transition: background-color 0.3s;
        border: 1px solid var(--el-border-color);
    }

    .board-cell:hover {
        background-color: var(--el-fill-color);
    }

    .board-cell.revealed {
        background-color: var(--el-bg-color);
    }

    .board-cell.reward {
        background-color: var(--el-color-success-light-5);
    }

    .board-cell.monster {
        background-color: var(--el-color-danger-light-5);
    }

    .board-cell.trap {
        background-color: var(--el-color-warning-light-5);
    }

    .board-cell.event {
        background-color: var(--el-color-info-light-5);
    }

    .new-game-button {
        width: 200px;
    }
</style>
