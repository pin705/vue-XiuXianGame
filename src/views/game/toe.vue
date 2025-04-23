<template>
  <div class="tic-tac-toe">
    <div class="game-board">
      <div
        v-for="(row, rowIndex) in board"
        :key="rowIndex"
        class="row"
      >
        <el-button
          v-for="(cell, colIndex) in row"
          :key="colIndex"
          @click="makeMove(rowIndex, colIndex)"
          :disabled="cell !== ' ' || !canPlay"
          class="cell"
          v-text="cell"
        />
      </div>
    </div>
    <p
      v-if="canPlay"
      class="game-status"
      v-text="gameStatus"
    />
    <el-button
      @click="resetGame"
      v-text="'Bắt đầu lại'"
      v-if="canPlay && !gameEnded"
    />
    <el-countdown
      :title="hasEnoughMoney ? 'Đang hồi chiêu' : 'Không đủ linh thạch'"
      :value="nextGameTime"
      @finish="finish"
      v-else
    />
  </div>
</template>

<script>
// Định nghĩa các tổ hợp chiến thắng
const WINNING_LINES = [
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]]
];

export default {
    name: 'TicTacToe',
    data() {
        return {
            // Bàn cờ trò chơi, mảng 3x3, ban đầu được điền bằng khoảng trắng
            board: [
                [' ', ' ', ' '],
                [' ', ' ', ' '],
                [' ', ' ', ' ']
            ],
            canPlay: false,
            // Người chơi hiện tại, 'X' hoặc 'O'
            currentPlayer: 'X',
            // Trò chơi đã kết thúc chưa
            gameEnded: false
        }
    },
    computed: {
        // Lấy thông tin người chơi từ Vuex store
        player() {
            return this.$store.player;
        },
        // Kiểm tra xem có người chơi nào chiến thắng không
        checkWinner() {
            return WINNING_LINES.some(line =>
                line.every(([row, col]) => this.board[row][col] === this.currentPlayer)
            );
        },
        // Kiểm tra xem bàn cờ đã đầy chưa
        isBoardFull() {
            return this.board.flat().every(cell => cell !== ' ');
        },
        // Tính thời gian có thể chơi trò chơi tiếp theo
        nextGameTime() {
            return this.player.nextGameTimes?.ticTacToe || 0;
        },
        // Kiểm tra xem người chơi có đủ linh thạch không
        hasEnoughMoney() {
            return this.player.props.money >= 1000;
        },
        // Trạng thái trò chơi
        gameStatus: {
            get() {
                return this._gameStatus || `${this.player.name} lượt đi`;
            },
            set(value) {
                this._gameStatus = value;
            }
        }
    },
    created() {
        // Kiểm tra xem người chơi có thể chơi trò chơi không
        this.canPlay = Date.now() >= this.nextGameTime && this.hasEnoughMoney;
        this.gameStatus = `${this.player.name} lượt đi`;
    },
    methods: {
        finish() {
            this.canPlay = true;
            this.gameEnded = false;
        },
        // Xử lý nước đi của người chơi
        makeMove(row, col) {
            // Kiểm tra xem ô có trống không, trò chơi chưa kết thúc và người chơi có thể chơi
            if (this.board[row][col] === ' ' && !this.gameEnded && this.canPlay) {
                // Cập nhật bàn cờ và kiểm tra trạng thái trò chơi
                this.updateBoard(row, col, this.currentPlayer);
                if (this.checkWinner) {
                    this.endGame(`Chúc mừng ${this.player.name} chiến thắng!`, true);
                } else if (this.isBoardFull) {
                    this.endGame('Hòa!', false);
                } else {
                    // Chuyển người chơi và thực hiện nước đi của Thiên Đạo
                    this.switchPlayer();
                    this.computerMove();
                }
            }
        },
        // Xử lý nước đi của Thiên Đạo
        computerMove() {
            if (!this.gameEnded) {
                setTimeout(() => {
                    let row, col;
                    const emptyCells = [];
                    this.board.forEach((r, i) => r.forEach((c, j) => c === ' ' && emptyCells.push([i, j])));
                    [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                    this.updateBoard(row, col, this.currentPlayer);
                    if (this.checkWinner) this.endGame(`Chúc mừng Thiên Đạo chiến thắng!`, false);
                    else if (this.isBoardFull) this.endGame('Hòa!', false);
                    else this.switchPlayer();
                }, 500);
            }
        },
        // Cập nhật dữ liệu bàn cờ
        updateBoard(row, col, player) {
            this.board[row][col] = player;
        },
        // Chuyển đổi người chơi hiện tại
        switchPlayer() {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.gameStatus = `${this.currentPlayer === 'X' ? this.player.name : 'Thiên Đạo'} lượt đi`;
        },
        // Đặt lại trạng thái trò chơi
        resetGame() {
            this.board = [
                [' ', ' ', ' '],
                [' ', ' ', ' '],
                [' ', ' ', ' ']
            ];
            this.currentPlayer = 'X';
            this.gameEnded = false;
            this.gameStatus = `${this.player.name} lượt đi`;
        },
        // Kết thúc trò chơi và xử lý kết quả
        endGame(status, playerWon) {
            this.gameStatus = status;
            this.gameEnded = true;
            const reward = playerWon ? 1000 : -1000;
            this.$emit('game-result', { success: playerWon, reward });
            const newNextGameTime = Date.now() + 10 * 60 * 1000;
            this.player.nextGameTimes.ticTacToe = newNextGameTime;
            this.$emit('update-next-game-time', { game: 'ticTacToe', time: newNextGameTime });
        }
    }
}
</script>

<style scoped>
    .tic-tac-toe {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        padding: 20px;
        background-color: var(--el-bg-color);
        border-radius: 12px;
        box-shadow: var(--el-box-shadow-light);
    }

    .game-board {
        display: grid;
        grid-template-rows: repeat(3, 1fr);
        gap: 10px;
    }

    .row {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
    }

    .cell {
        width: 80px;
        height: 80px;
        font-size: 40px;
        font-weight: bold;
        background-color: var(--el-fill-color-light);
        color: var(--el-text-color-primary);
        /* border: none; */
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .cell:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }

    .cell:hover:not(:disabled) {
        background-color: var(--el-fill-color);
    }

    .game-status {
        font-size: 18px;
        font-weight: bold;
        color: var(--el-text-color-primary);
    }

    h3 {
        color: var(--el-text-color-primary);
    }
</style>
