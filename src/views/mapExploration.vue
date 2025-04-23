<template>
  <div>
    <div class="legend">
      <div class="legend-item">
        <div class="color-box player" />
        Người chơi
      </div>
      <div class="legend-item">
        <div class="color-box npc" />
        NPC
      </div>
      <div class="legend-item">
        <div class="color-box fishing" />
        Điểm câu cá
      </div>
      <div class="legend-item">
        <div class="color-box obstacle" />
        Chướng ngại vật
      </div>
      <div class="legend-item">
        <div class="color-box empty" />
        Đất trống
      </div>
    </div>
    <div class="map">
      <div class="grid-container">
        <div
          v-for="(cell, index) in grid"
          :key="index"
          :ref="'cell-' + index"
          :class="[
            'grid-item',
            cell.type,
            `x-${index % this.gridSize}`,
            `y-${Math.floor(index / this.gridSize)}`,
          ]"
          :style="{ backgroundColor: cell.his }"
          @click="gridInfo(index, cell)"
        />
      </div>
    </div>
    <div class="controls">
      <el-button
        class="home-button"
        @click="move('q')"
      >
        Động phủ <span class="shortcutKeys">(Q)</span>
      </el-button>
      <el-button
        class="up-button"
        @click="move('up')"
        :disabled="isTopObstacle || playerY == 0"
      >
        Đi hướng Bắc<span class="shortcutKeys">(W)</span>
      </el-button>
      <el-button
        class="dialogue-button"
        @click="move('e')"
        :disabled="!isNpc && !isFishing"
      >
        {{ isNpc || !isFishing ? "Đối thoại" : "Câu cá"
        }}<span class="shortcutKeys">(E)</span>
      </el-button>
      <el-button
        class="left-button"
        @click="move('left')"
        :disabled="isLeftObstacle || playerX === 0"
      >
        Đi hướng Tây<span class="shortcutKeys">(A)</span>
      </el-button>
      <el-button
        class="down-button"
        @click="move('down')"
        :disabled="isDownObstacle || playerY === gridSize - 1"
      >
        Đi hướng Nam<span class="shortcutKeys">(S)</span>
      </el-button>
      <el-button
        class="right-button"
        @click="move('right')"
        :disabled="isRightObstacle || playerX === gridSize - 1"
      >
        Đi hướng Đông<span class="shortcutKeys">(D)</span>
      </el-button>
    </div>
    <el-drawer
      v-model="fishingShow"
      @close="endGame"
      title="Câu cá"
      direction="rtl"
      class="strengthen"
    >
      <div class="game-container">
        <div class="time">
          Đếm ngược: {{ fishing.timeLeft }} giây
        </div>
        <div class="outer-wrapper">
          <div class="progress-bar-container">
            <div
              class="progress-bar"
              ref="progressBar"
              :style="{ height: fishing.progressPercentage }"
            />
            <div class="progress-text">
              {{ fishing.progressText }}%
            </div>
          </div>
          <div
            class="outer-container"
            ref="outerContainer"
            :style="{
              border: fishing.overlap
                ? '2px solid var(--el-color-warning)'
                : '2px solid var(--el-border-color)',
            }"
          >
            <div
              class="moving-container"
              ref="movingContainer"
              :style="{
                animation: fishing.overlap
                  ? 'wobble .5s ease-in-out infinite'
                  : '',
                transformorigin: fishing.overlap ? 'bottom center' : '',
              }"
            >
              <svg viewBox="0 0 1024 1024">
                <path
                  d="M942 619.8c-27.4-29.4-42.5-67.6-42.5-107.8s15.1-78.4 42.5-107.8c14.8-15.8 18.6-38 10-58-8.6-19.8-27.3-32.2-48.9-32.3h-0.9c-35.3 0-70 9.4-100.2 27.2-29.4 17.3-53.9 41.9-71.1 71.4-2.8 4.8-7.3 6-9.7 6.4-4.2 0.6-8.4-0.8-11.3-3.8-38.3-38.2-82.9-68.2-132.5-89.1-51.4-21.7-105.9-32.7-162.2-32.7-29.1 0-57.6 2.9-85.5 8.7l-1.1 0.3c-33.5 7.1-66 18.3-97.1 33.6-28.6 14.1-55.7 31.5-80.5 51.8l-0.2 0.2c-2.1 1.7-4.1 3.4-6.2 5.2-0.4 0.4-0.9 0.8-1.3 1.1l-4.5 3.9c-0.6 0.5-1.2 1.1-1.8 1.6-1.7 1.5-3.3 3-5 4.5-0.8 0.7-1.6 1.5-2.4 2.3-1 1-2.1 2-3.1 2.9-0.8 0.8-1.6 1.5-2.4 2.3l-4.5 4.5c-0.8 0.8-1.6 1.6-2.4 2.5-1 1.1-2.1 2.1-3.1 3.2-0.7 0.8-1.4 1.5-2.2 2.3l-4.5 4.8c-0.6 0.7-1.3 1.4-1.9 2.1-1.3 1.5-2.7 3-4 4.5-0.3 0.4-0.7 0.8-1 1.1-1.6 1.9-3.3 3.8-4.9 5.7-0.4 0.5-0.9 1-1.3 1.6-1.7 2-3.3 4-4.9 6-14.1 17.6-21.9 39.7-21.9 62.2s7.8 44.6 21.9 62.2c1.6 2 3.3 4 4.9 6 0.4 0.5 0.9 1 1.3 1.6 1.6 1.9 3.2 3.8 4.9 5.7 0.3 0.4 0.7 0.7 1 1.1 1.3 1.5 2.7 3 4 4.5 0.6 0.7 1.3 1.4 1.9 2.1 1.5 1.6 3 3.3 4.6 4.9 0.7 0.7 1.4 1.5 2.1 2.2 1 1.1 2.1 2.2 3.1 3.2l2.4 2.4c1.5 1.5 3 3 4.6 4.5 0.8 0.8 1.6 1.5 2.4 2.3 1 1 2.1 2 3.1 3 0.8 0.7 1.6 1.5 2.4 2.2 1.7 1.5 3.3 3 5 4.5 0.6 0.5 1.2 1.1 1.8 1.6l4.5 3.9c0.4 0.4 0.9 0.7 1.3 1.1 2.1 1.8 4.1 3.5 6.2 5.2 0.1 0 0.1 0.1 0.2 0.1 24.8 20.3 51.9 37.8 80.5 51.9 31.2 15.3 63.7 26.5 97.1 33.6l1.1 0.3c27.8 5.8 56.4 8.7 85.5 8.7 56.2 0 110.8-11 162.2-32.7 49.6-20.9 94.2-50.9 132.5-89.1 3-3 7.1-4.3 11.3-3.8 2.4 0.3 6.9 1.6 9.7 6.4 17.1 29.4 41.7 54.1 71.1 71.4 30.3 17.8 64.9 27.2 100.2 27.2h0.9c21.5-0.1 40.3-12.5 48.8-32.3 8.6-20.3 4.8-42.5-10-58.3z m-619.8 59.4c-76.3-19.4-145.4-62.9-196.3-123.6-0.3-0.4-0.6-0.7-0.9-1.1-1.5-1.8-2.9-3.5-4.4-5.3 0 0 0-0.1-0.1-0.1-11.5-14.4-15.5-32.4-11.9-49.4 0.3-1.6 0.8-3.2 1.2-4.8s1-3.2 1.6-4.7c2.2-5.4 5.2-10.6 9-15.4 1.5-1.8 3-3.7 4.5-5.5 0.3-0.3 0.6-0.7 0.9-1 50.9-60.7 120.1-104.2 196.3-123.6 54.7 38.3 87.1 100.2 87.1 167.2 0.1 67.2-32.3 129.1-87 167.3z m593.1-17.3c-1.1 2.5-4.4 8.2-12.3 8.2h-0.8c-28.2 0-55.8-7.5-80-21.7-23.5-13.8-43.1-33.5-56.8-57-8.3-14.3-22.6-23.7-39.1-25.9-16.6-2.2-32.9 3.3-44.8 15.1-71.3 71-165.9 110.2-266.4 110.2-13.9 0-27.8-0.8-41.4-2.3 47.9-45.6 75.5-108.9 75.5-176.6s-27.6-131-75.5-176.6c13.7-1.5 27.5-2.3 41.4-2.3 100.5 0 195.2 39.1 266.4 110.2 11.8 11.8 28.1 17.3 44.8 15.1 16.5-2.2 30.8-11.6 39.1-25.9 13.7-23.5 33.3-43.2 56.8-57 24.1-14.2 51.8-21.7 80-21.7h0.7c7.9 0 11.2 5.7 12.3 8.2s3 8.9-2.5 14.8c-34.3 36.8-53.2 84.8-53.2 135.1s18.9 98.3 53.2 135.1c5.6 6.1 3.7 12.5 2.6 15z"
                  :fill="
                    fishing.overlap
                      ? 'var(--el-color-warning)'
                      : 'var(--el-border-color)'
                  "
                />
                <path
                  d="M273 515.4m-30 0a30 30 0 1 0 60 0 30 30 0 1 0-60 0Z"
                  :fill="
                    fishing.overlap
                      ? 'var(--el-color-warning)'
                      : 'var(--el-border-color)'
                  "
                />
              </svg>
            </div>
            <div
              class="inner-container"
              ref="innerContainer"
            >
              <svg viewBox="0 0 1024 1024">
                <path
                  d="M893.456828 709.055005"
                  :fill="
                    fishing.overlap
                      ? 'var(--el-color-warning)'
                      : 'var(--el-border-color)'
                  "
                />
                <path
                  d="M491.889987 337.939709"
                  :fill="
                    fishing.overlap
                      ? 'var(--el-color-warning)'
                      : 'var(--el-border-color)'
                  "
                />
                <path
                  d="M568.154951 338.993714"
                  :fill="
                    fishing.overlap
                      ? 'var(--el-color-warning)'
                      : 'var(--el-border-color)'
                  "
                />
                <path
                  d="M789.271978 570.404178c-10.123568-32.030507-33.907251-88.211041-88.099501-128.403438 59.974953 92.142583 39.444361 191.201693 16.587793 231.574193 19.583011-9.214872 48.428989-39.642882 48.428989-39.642882s5.043876 37.219693-1.590218 81.112366c-2.619664 2.876514-4.52199 6.466272-5.253654 10.576893-14.963807 83.60514-81.932034 172.931584-216.578664 172.931584-129.71634 0-226.874147-110.219287-226.874147-262.079974L315.892577 167.967526c0-1.240247 2.843768-2.440585 2.641153-3.623527 24.40483-7.115048 43.811832-29.649274 43.811832-56.31561 0-32.355919-25.581632-58.68968-57.93755-58.68968s-58.313104 26.332738-58.313104 58.68968c0 23.514553 11.484565 43.790342 31.504528 53.148477-0.724501 2.143826-3.66139 4.402263-3.66139 6.791683l0 468.503347c0 176.588881 114.748441 304.763099 269.192975 304.763099 130.210597 0 230.4066-78.81709 255.399831-201.286376 2.036379-0.156566 4.120854-0.963954 4.539386-2.777253C817.526485 674.573679 802.432719 618.005312 789.271978 570.404178zM305.160141 81.350796c14.71412 0 26.676569 11.962449 26.676569 26.676569s-11.962449 26.676569-26.676569 26.676569-26.676569-11.962449-26.676569-26.676569S290.446022 81.350796 305.160141 81.350796z"
                  :fill="
                    fishing.overlap
                      ? 'var(--el-color-warning)'
                      : 'var(--el-border-color)'
                  "
                />
              </svg>
            </div>
          </div>
        </div>
        <el-button
          @touchstart="startFishing"
          @touchend="stopFishing"
          @mousedown="startFishing"
          @mouseup="stopFishing"
          @mouseleave="stopFishing"
          @click="moveButton('click')"
          :disabled="fishing.disabled"
          class="button"
        >
          Câu cá<span class="shortcutKeys">({{ holdingId ? "Thả" : "Giữ" }})</span>
        </el-button>
      </div>
    </el-drawer>
    <el-drawer
      v-model="npcShow"
      :title="npcInfo.name"
      direction="rtl"
      class="strengthen"
    >
      <div class="wife-box">
        <div class="attributes">
          <div class="attribute-box">
            <div class="tag attribute">
              Cảnh giới: {{ $levelNames(npcInfo.lv) }} ({{
                npcInfo.reincarnation
              }}
              lần luân hồi)
            </div>
            <div class="tag attribute">
              Khí huyết: Không rõ
            </div>
            <div class="tag attribute">
              Công kích: Không rõ
            </div>
            <div class="tag attribute">
              Phòng thủ: Không rõ
            </div>
            <div class="tag attribute">
              Né tránh: Không rõ
            </div>
            <div class="tag attribute">
              Bạo kích: Không rõ
            </div>
            <div class="tag attribute">
              Độ hảo cảm: {{ npcInfo.favorability }}
            </div>
          </div>
        </div>
        <div class="click-box">
          <el-button
            type="primary"
            @click="giftShow = !giftShow"
          >
            {{ giftShow ? "Hủy tặng quà" : "Tặng quà" }}
          </el-button>
          <el-button
            type="primary"
            :disabled="npcInfo.favorability < 1000 || isHaveWife(npcInfo.name)"
            @click="harvestNpc(npcInfo)"
          >
            {{
              isHaveWife(npcInfo.name)
                ? "Đã kết thành đạo lữ"
                : "Kết thành đạo lữ"
            }}
          </el-button>
        </div>
        <div
          class="gift-box"
          v-if="giftShow"
        >
          <div
            class="gift-item"
            v-for="(item, index) in giftItems"
            :key="index"
            @click="giftInfo(item, index)"
          >
            <tag :type="item.lv">
              {{ item.name }}
            </tag>
            <span class="gift-name">{{ item.price }} Linh thạch</span>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
// Component tag
import tag from "@/components/tag.vue";
// Dữ liệu NPC
import npc from "@/plugins/npc";
// Dữ liệu quái vật
import monster from "@/plugins/monster";

export default {
  data() {
    return {
      // Lưu dữ liệu của mỗi ô trên bản đồ
      grid: [],
      // Dữ liệu người chơi
      player: {},
      // Vị trí người chơi trên trục X
      playerX: 0,
      // Vị trí người chơi trên trục Y
      playerY: 0,
      npcInfo: {},
      // Dữ liệu liên quan đến câu cá
      fishing: {
        // Điểm số
        score: 0,
        bottom: "0px",
        // Trạng thái chồng lấn
        overlap: false,
        // Lưu trữ các định thời
        timerIds: [],
        // Thời gian còn lại
        timeLeft: 60,
        // Trò chơi kết thúc
        gameOver: false,
        // Vô hiệu hóa nút
        disabled: false,
        // Hết thời gian
        timeExpired: false,
        // Tiến độ
        progressText: 0,
        // Vị trí của container bên trong
        innerPosition: 0,
        // ID của animation di chuyển lên
        moveUpAnimationId: "",
        // Phần trăm thanh tiến độ
        progressPercentage: "0%",
        // ID của animation di chuyển xuống
        moveDownAnimationId: "",
        // ID của animation di chuyển container cha
        moveParentContainerId: "",
      },
      npcShow: false,
      // Kích thước bản đồ
      gridSize: 50,
      giftShow: false,
      // Số lượng NPC
      npcCount: 10,
      // Trạng thái đang giữ chuột
      holdingId: null,
      // Tọa độ các điểm câu cá
      fishingMap: [],
      // Cửa sổ câu cá
      fishingShow: false,
      // Số lượng chướng ngại vật
      obstacleCount: 0,
    };
  },
  components: {
    tag,
  },
  computed: {
    giftItems() {
      const arr = [];
      const num = {
        1: "Nhất",
        2: "Nhị",
        3: "Tam",
        4: "Tứ",
        5: "Ngũ",
        6: "Lục",
      };
      const lv = {
        1: "info",
        2: "success",
        3: "primary",
        4: "purple",
        5: "warning",
        6: "danger",
      };
      const price = {
        1: 200,
        2: 400,
        3: 800,
        4: 1500,
        5: 2000,
        6: 3000,
      };
      for (let i = 1; i < 7; i++) {
        arr.push({
          lv: lv[i],
          plus: price[i] / 100,
          name: `${num[i]} Phẩm Trú Nhan Đan`,
          price: price[i],
        });
      }
      return arr;
    },
    totalCells() {
      return this.gridSize * this.gridSize;
    },
    nearbyIndices() {
      return [
        (this.playerY - 1) * this.gridSize + this.playerX, // Bắc
        (this.playerY + 1) * this.gridSize + this.playerX, // Nam
        this.playerY * this.gridSize + (this.playerX - 1), // Tây
        this.playerY * this.gridSize + (this.playerX + 1), // Đông
      ];
    },
    // Kiểm tra xem gần người chơi có NPC không
    isNpc() {
      return this.nearbyIndices.some(
        (index) => this.grid[index]?.type === "npc"
      );
    },
    // Kiểm tra xem gần người chơi có điểm câu cá không
    isFishing() {
      return this.nearbyIndices.some(
        (index) => this.grid[index]?.type === "fishing"
      );
    },
    // Kiểm tra phía Bắc người chơi có chướng ngại vật không
    isTopObstacle() {
      return this.checkDirection("up");
    },
    // Kiểm tra phía Tây người chơi có chướng ngại vật không
    isLeftObstacle() {
      return this.checkDirection("left");
    },
    // Kiểm tra phía Nam người chơi có chướng ngại vật không
    isDownObstacle() {
      return this.checkDirection("down");
    },
    // Kiểm tra phía Đông người chơi có chướng ngại vật không
    isRightObstacle() {
      return this.checkDirection("right");
    },
  },
  mounted() {
    // Dữ liệu trò chơi
    const store = this.$store;
    // Dữ liệu người chơi
    this.player = store.player;
    // Dữ liệu bản đồ
    const mapData = store.mapData;
    if (mapData.map.length) {
      // Khôi phục dữ liệu bản đồ
      this.grid = mapData.map;
      // Tọa độ Y của người chơi
      this.playerY = mapData.y;
      // Tọa độ X của người chơi
      this.playerX = mapData.x;
    } else {
      // Khởi tạo dữ liệu bản đồ
      this.initializeGrid();
    }
    // Khôi phục vị trí thanh cuộn
    if (store.mapScroll)
      this.$nextTick(() => this.updateScroll(store.mapScroll));
    // Thêm lắng nghe sự kiện bàn phím
    window.addEventListener("keydown", this.move);
  },
  beforeUnmount() {
    // Xóa tất cả định thời
    this.clearAllTiming();
    // Xóa lắng nghe sự kiện bàn phím
    window.removeEventListener("keydown", this.move);
  },
  methods: {
    // Về nhà
    goHome() {
      this.$router.push("/home");
      if (this.playerX !== 0 || this.playerY !== 0) {
        this.$store.mapData = { y: 0, x: 0, map: [] };
        // Đặt lại tất cả dữ liệu câu cá
        this.resetFishingData(false);
        // Đặt lại vị trí thanh cuộn
        this.$store.mapScroll = 0;
      }
    },
    // Xóa tất cả định thời
    clearAllTiming() {
      this.fishing.timerIds.forEach((id) => clearInterval(id));
    },
    // Khởi tạo bản đồ
    initializeGrid() {
      // Tạo bản đồ
      this.grid = Array(this.totalCells)
        .fill()
        .map(() => ({ his: "", type: "empty" }));
      const safeZone = this.createSafeZone();
      // Số lượng chướng ngại vật
      this.obstacleCount = Math.floor(this.totalCells * 0.1);
      // Tạo chướng ngại vật
      this.generateItems("obstacle", this.obstacleCount, safeZone);
      // Đảm bảo chướng ngại vật không chặn đường
      this.ensurePathAvailability();
      // Tạo điểm câu cá
      this.generateItems("fishing", 10, safeZone);
      // Đảm bảo điểm câu cá không chặn đường
      this.ensurePathAvailability();
      // Tạo NPC
      this.generateNpcs(this.npcCount, safeZone);
      // Đảm bảo NPC không chặn đường
      this.ensurePathAvailability();
      // Cập nhật vị trí ban đầu của người chơi
      this.updatePlayerPosition();
    },
    // Tạo vùng an toàn, là lưới 5x5 quanh vị trí người chơi
    createSafeZone() {
      const safeZone = new Set();
      for (let y = this.playerY - 2; y <= this.playerY + 2; y++) {
        for (let x = this.playerX - 2; x <= this.playerX + 2; x++) {
          // Đảm bảo tọa độ nằm trong lưới hợp lệ
          if (y >= 0 && y < this.gridSize && x >= 0 && x < this.gridSize)
            safeZone.add(y * this.gridSize + x); // Chuyển tọa độ thành chỉ số 1D và thêm vào vùng an toàn
        }
      }
      // Trả về tập hợp vùng an toàn
      return safeZone;
    },
    // Đảm bảo có đường đi trên bản đồ, nếu không thì tạo lại chướng ngại vật và NPC
    ensurePathAvailability() {
      while (!this.isPathAvailable()) {
        // Tạo lại chướng ngại vật, loại trừ vùng an toàn
        this.generateItems(
          "obstacle",
          this.obstacleCount,
          this.createSafeZone()
        );
        // Tạo lại NPC, loại trừ vùng an toàn
        this.generateNpcs(this.npcCount, this.createSafeZone());
      }
    },
    // Kiểm tra đường đi từ điểm bắt đầu đến điểm kết thúc bằng thuật toán A*
    isPathAvailable() {
      // Tọa độ bắt đầu
      const start = [this.playerY, this.playerX];
      // Tọa độ kết thúc
      const end = [49, 49];
      // Các hướng di chuyển
      const directions = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ];
      // Hàm heuristic (khoảng cách Manhattan với trọng số nhỏ)
      const heuristic = (a, b) => {
        const d1 = Math.abs(a[0] - b[0]);
        const d2 = Math.abs(a[1] - b[1]);
        return d1 + d2 + 0.1 * Math.min(d1, d2);
      };
      // Khởi tạo cấu trúc dữ liệu cho A*
      const openSet = new MinHeap(); // Lưu các node cần kiểm tra
      const cameFrom = new Map(); // Ghi lại đường đi
      const gScore = new Map(); // Chi phí thực từ điểm bắt đầu
      const fScore = new Map(); // Chi phí ước tính đến điểm kết thúc
      gScore.set(start.toString(), 0);
      fScore.set(start.toString(), heuristic(start, end));
      openSet.add(start, fScore.get(start.toString()));
      while (!openSet.isEmpty()) {
        // Lấy node có giá trị f thấp nhất
        const current = openSet.poll();
        // Nếu đến điểm kết thúc, đường đi khả dụng
        if (current[0] === 49 && current[1] === 49) return true;
        for (const [dy, dx] of directions) {
          const newY = current[0] + dy;
          const newX = current[1] + dx;
          const neighbor = [newY, newX];
          // Đảm bảo node lân cận nằm trong lưới và là ô trống
          if (
            newY >= 0 &&
            newY < this.gridSize &&
            newX >= 0 &&
            newX < this.gridSize &&
            this.grid[newY * this.gridSize + newX].type === "empty"
          ) {
            const tentativeGScore = gScore.get(current.toString()) + 1;
            // Nếu tìm thấy đường ngắn hơn
            if (
              !gScore.has(neighbor.toString()) ||
              tentativeGScore < gScore.get(neighbor.toString())
            ) {
              cameFrom.set(neighbor.toString(), current);
              gScore.set(neighbor.toString(), tentativeGScore);
              const fScoreValue = tentativeGScore + heuristic(neighbor, end);
              fScore.set(neighbor.toString(), fScoreValue);
              openSet.add(neighbor, fScoreValue);
            }
          }
        }
      }
      // Nếu không tìm thấy đường, trả về false
      return false;
    },
    // Tạo số lượng vật phẩm (chướng ngại vật, điểm câu cá) và đảm bảo đường đi khả dụng
    generateItems(type, count, excludeSet) {
      // Chuyển tất cả vật phẩm hiện tại thành ô trống
      this.grid.forEach((cell) => {
        if (cell.type === type) cell.type = "empty";
      });
      let placed = 0;
      const arr = [];
      // Lưu vùng cấm 5x5 quanh mỗi điểm câu cá
      const restrictedZone = new Set();
      while (placed < count) {
        const index = Math.floor(Math.random() * this.totalCells);
        // Kiểm tra vị trí mới không nằm trong vùng an toàn hoặc vùng cấm, và là ô trống
        if (
          !excludeSet.has(index) &&
          !restrictedZone.has(index) &&
          this.grid[index].type === "empty"
        ) {
          this.grid[index].type = type;
          placed++;
          // Nếu là điểm câu cá, lưu tọa độ và tạo vùng cấm 5x5
          if (type === "fishing") {
            arr.push(index);
            this.$store.fishingMap = arr;
            // Thêm vùng cấm 5x5 quanh điểm câu cá
            this.addToRestrictedZone(index, restrictedZone);
          }
          // Kiểm tra ngay lập tức xem đường đi có khả dụng không
          if (!this.isPathAvailable()) {
            // Nếu chặn đường, hoàn tác việc đặt vật phẩm
            this.grid[index].type = "empty";
            placed--;
          }
        }
      }
    },
    // Tạo số lượng NPC và đảm bảo đường đi khả dụng
    generateNpcs(count, excludeSet) {
      // Chuyển tất cả NPC hiện tại thành ô trống
      this.grid.forEach((cell) => {
        if (cell.type === "npc") cell.type = "empty";
      });
      const npcs = this.player.npcs.length ? this.player.npcs : npc.npcNames();
      const isData = this.player.npcs.length;
      let arr = [];
      let placed = 0;
      while (placed < count) {
        const index = Math.floor(Math.random() * this.totalCells);
        // Đảm bảo NPC mới không nằm trong vùng an toàn và là ô trống
        if (!excludeSet.has(index) && this.grid[index].type === "empty") {
          const favorability = isData ? npcs[placed].favorability : 0;
          const lightness = this.calculateLightness(favorability);
          // Đặt màu cho NPC
          this.grid[index].his = `hsl(340, 82%, ${lightness}%, 1)`;
          this.grid[index].type = "npc";
          const npcData = {
            lv: 144,
            name: isData ? npcs[placed].name : npcs[placed],
            position: index,
            favorability: favorability,
            reincarnation: 10,
          };
          arr.push(npcData);
          this.player.npcs = arr;
          placed++;
          // Kiểm tra ngay lập tức xem đường đi có khả dụng không
          if (!this.isPathAvailable()) {
            // Nếu chặn đường, hoàn tác việc đặt NPC
            this.grid[index].type = "empty";
            placed--;
          }
        }
      }
    },
    // Đặt vùng cấm 5x5 quanh một ô
    addToRestrictedZone(index, restrictedZone) {
      const gridX = index % this.gridSize;
      const gridY = Math.floor(index / this.gridSize);
      // Duyệt vùng 5x5 quanh ô mục tiêu
      for (let y = gridY - 2; y <= gridY + 2; y++) {
        for (let x = gridX - 2; x <= gridX + 2; x++) {
          if (y >= 0 && y < this.gridSize && x >= 0 && x < this.gridSize) {
            // Chuyển tọa độ thành chỉ số 1D và thêm vào vùng cấm
            restrictedZone.add(y * this.gridSize + x);
          }
        }
      }
    },
    // Tính độ sáng màu dựa trên độ hảo cảm
    calculateLightness(favorability) {
      const maxFavorability = 1000;
      const minLightness = 50; // Tối nhất
      const maxLightness = 76; // Sáng nhất
      // Tính độ sáng dựa trên phần trăm hảo cảm
      const percentage = favorability / maxFavorability;
      return minLightness + (maxLightness - minLightness) * percentage;
    },
    // Kết thành đạo lữ với NPC
    harvestNpc(item) {
      this.$confirm(
        "Kết thành đạo lữ với đối phương có 50% khả năng thất bại, nếu thất bại độ hảo cảm sẽ về 0, bạn có muốn tiếp tục?",
        "Kết thành đạo lữ",
        {
          center: true,
          cancelButtonText: "Hủy",
          confirmButtonText: "Xác nhận",
        }
      )
        .then(() => {
          const rand = this.isLucky(50);
          if (rand) {
            // Thêm đạo lữ
            this.player.wifes.push({
              name: item.name,
              level: 0,
              dodge: 0,
              attack: 10,
              health: 100,
              defense: 10,
              critical: 0,
              reincarnation: 0,
            });
            this.$notifys({
              title: "Thông báo",
              message: "Bạn đã thành công mời đối phương kết thành đạo lữ",
              position: "top-left",
            });
          } else {
            this.npcInfo.favorability = 0;
            this.$notifys({
              title: "Thông báo",
              message: "Đối phương từ chối lời mời, độ hảo cảm đã bị xóa",
              position: "top-left",
            });
          }
        })
        .catch(() => {});
    },
    // Thông tin quà tặng
    giftInfo(item, index) {
      this.$confirm("", "Tặng quà", {
        center: true,
        message: `<div class="monsterinfo">
                        <div class="monsterinfo-box">
                            <p>Tên: ${item.name}</p>
                            <p>Giá: ${item.price}</p>
                            <p>Tăng hảo cảm: ${item.plus}</p>
                        </div>
                    </div>`,
        lockScroll: false,
        cancelButtonText: "Hủy tặng quà",
        confirmButtonText: "Tặng ngay",
        dangerouslyUseHTMLString: true,
      })
        .then(() => {
          if (item.price > this.player.props.money) {
            this.$notifys({
              title: "Thông báo tặng quà",
              message: "Linh thạch không đủ, tặng quà thất bại",
              position: "top-left",
            });
            return;
          }
          // Trừ linh thạch
          this.player.props.money -= item.price;
          // Tăng độ hảo cảm
          this.npcInfo.favorability += item.plus;
          // Tăng số lượng truyền tống phù
          this.player.props.flying += index;
          // Tăng điểm tình duyên
          this.player.props.qingyuan += index;
          this.$notifys({
            title: "Thông báo tặng quà",
            message: `Tặng quà thành công, độ hảo cảm của ${this.npcInfo.name} tăng lên, đồng thời nhận được ${index} Truyền Tống Phù và ${index} điểm Tình Duyên`,
            position: "top-left",
          });
        })
        .catch(() => {});
    },
    // Thông tin ô trên bản đồ
    gridInfo(index, item) {
      // Nếu ô không phải đất trống
      if (item.type != "empty") return;
      const x = index % this.gridSize;
      const y = Math.floor(index / this.gridSize);
      this.$confirm("Thông tin tọa độ bản đồ", "Thông tin tọa độ bản đồ", {
        center: true,
        message: `<div class="monsterinfo">
                        <div class="monsterinfo-box">
                            <p>Trục X: ${x}</p>
                            <p>Trục Y: ${y}</p>
                        </div>
                    </div>`,
        lockScroll: false,
        cancelButtonText: "Hủy truyền tống",
        confirmButtonText: "Truyền tống ngay",
        dangerouslyUseHTMLString: true,
      })
        .then(() => {
          if (!this.player.props.flying) {
            this.$notifys({
              title: "Thông báo truyền tống",
              message: "Truyền tống thất bại, không đủ Truyền Tống Phù",
              position: "top-left",
            });
            return;
          }
          this.playerY = y;
          this.playerX = x;
          this.updatePlayerPosition();
          this.$notifys({
            title: "Thông báo truyền tống",
            message: "Truyền tống thành công",
            position: "top-left",
          });
        })
        .catch(() => {});
    },
    // Cập nhật vị trí người chơi trên bản đồ
    updatePlayerPosition() {
      this.grid.forEach((cell) =>
        cell.type === "player" ? (cell.type = "empty") : cell.type
      );
      const playerIndex = this.playerY * this.gridSize + this.playerX;
      this.grid[playerIndex].type = "player";
      // Cập nhật dữ liệu bản đồ
      this.$store.mapData = {
        y: this.playerY,
        x: this.playerX,
        map: this.grid,
      };
      // 20% khả năng gặp quái
      const rand = this.isLucky(20);
      if (rand && playerIndex != 0) {
        // Cảnh giới người chơi
        let level = this.player.level == 0 ? 1 : this.player.level;
        // Độ khó quái dựa trên cảnh giới cao nhất + số lần luân hồi
        const monsterLv = level * this.player.reincarnation + level;
        // Thêm dữ liệu quái
        this.$store.monster = {
          // Tên
          name: monster.monster_Names(monsterLv),
          // Khí huyết
          health: monster.monster_Health(monsterLv),
          // Công kích
          attack: monster.monster_Attack(monsterLv),
          // Phòng thủ
          defense: monster.monster_Defense(monsterLv),
          // Tỷ lệ né tránh
          dodge: monster.monster_Criticalhitrate(monsterLv),
          // Tỷ lệ bạo kích
          critical: monster.monster_Criticalhitrate(monsterLv),
        };
        // Chuyển đến giao diện chiến đấu
        this.$router.push("/explore");
      }
      // Gọi mỗi khi cập nhật vị trí người chơi
      if (playerIndex != 0) this.updateScroll(playerIndex);
    },
    // Kiểm tra hướng chỉ định có NPC hoặc chướng ngại vật không
    checkDirection(direction) {
      const directions = {
        up: (this.playerY - 1) * this.gridSize + this.playerX,
        down: (this.playerY + 1) * this.gridSize + this.playerX,
        left: this.playerY * this.gridSize + (this.playerX - 1),
        right: this.playerY * this.gridSize + (this.playerX + 1),
      };
      const index = directions[direction];
      return ["obstacle", "fishing", "npc"].includes(this.grid[index]?.type);
    },
    // Di chuyển người chơi theo hướng
    move(direction) {
      let newX = this.playerX;
      let newY = this.playerY;
      direction = typeof direction === "string" ? direction : direction.key;
      switch (direction) {
        case "q":
          this.goHome();
          return;
        case "w":
        case "up":
        case "ArrowUp":
          if (newY > 0) {
            newY--;
            this.goPlayerXY(newY, newX);
          }
          break;
        case "s":
        case "down":
        case "ArrowDown":
          if (newY < this.gridSize - 1) {
            newY++;
            this.goPlayerXY(newY, newX);
          }
          break;
        case "a":
        case "left":
        case "ArrowLeft":
          if (newX > 0) {
            newX--;
            this.goPlayerXY(newY, newX);
          }
          break;
        case "d":
        case "right":
        case "ArrowRight":
          if (newX < this.gridSize - 1) {
            newX++;
            this.goPlayerXY(newY, newX);
          }
          break;
        case "e":
          if (!this.isNpc && !this.isFishing) return;
          if (this.isNpc) this.talkToNpc();
          else this.startGame();
          return;
        default:
          return;
      }
    },
    goPlayerXY(newY, newX) {
      const newIndex = newY * this.gridSize + newX;
      // Chỉ di chuyển người chơi nếu ô đích là đất trống
      if (this.grid[newIndex].type === "empty") {
        this.playerX = newX;
        this.playerY = newY;
      }
      this.updatePlayerPosition();
    },
    // Cuộn thanh cuộn đến hàng chứa người chơi
    updateScroll(playerIndex) {
      const playerCell = this.$refs[`cell-${playerIndex}`][0];
      if (playerCell) {
        this.$store.mapScroll = playerIndex;
        playerCell.scrollIntoView({
          block: "center",
          inline: "center",
          behavior: "smooth",
        });
      }
    },
    // Tìm và đối thoại với NPC gần đó
    talkToNpc() {
      this.npcShow = true;
      this.npcInfo = this.player.npcs.find((npc) =>
        this.nearbyIndices.includes(npc.position)
      );
    },
    // Tính xác suất
    isLucky(probability) {
      // Tạo số ngẫu nhiên từ 0 đến 100
      const randomValue = Math.random() * 100;
      // Kiểm tra xem số ngẫu nhiên có nhỏ hơn hoặc bằng xác suất không
      return randomValue < probability;
    },
    // Kiểm tra xem người chơi đã kết đạo lữ với NPC này chưa
    isHaveWife(name) {
      if (name) return this.player.wifes.some((item) => item.name === name);
    },
    // Di chuyển nút câu cá
    moveButton() {
      // Di chuyển lên mượt mà
      this.smoothMoveUp();
      // Kiểm tra va chạm
      this.checkCollision();
    },
    // Bắt đầu giữ để nâng lưỡi câu
    startFishing() {
      if (!this.holdingId) {
        this.moveButton();
        this.holdingId = setInterval(this.moveButton, 100);
      }
    },
    // Dừng nâng và bắt đầu tự động hạ lưỡi câu
    stopFishing() {
      if (this.holdingId) {
        clearInterval(this.holdingId);
        this.holdingId = null;
      }
    },
    // Di chuyển vị trí cá
    moveParentContainer() {
      if (!this.fishingShow) return;
      if (!this.$refs.movingContainer) return;
      // Tốc độ di chuyển
      const speed = 3000;
      // Phạm vi di chuyển tối đa trên trục Y
      const maxY =
        this.$refs.outerContainer.clientHeight -
        this.$refs.movingContainer.clientHeight;
      const move = () => {
        // Nếu hết thời gian, dừng di chuyển
        if (this.fishing.timeExpired) {
          // Xóa tất cả định thời
          this.clearAllTiming();
          return;
        }
        // Tạo vị trí Y ngẫu nhiên mới
        const newY = Math.random() * maxY;
        // Đặt vị trí mới
        this.$refs.movingContainer.style.transition = `top ${speed}ms ease`;
        this.$refs.movingContainer.style.top = `${newY}px`;
        // Gọi di chuyển tiếp theo sau khi hoàn thành animation
        setTimeout(() => {
          if (!this.fishing.timeExpired) {
            this.fishing.moveParentContainerId = requestAnimationFrame(move);
          }
        }, speed);
      };
      // Bắt đầu di chuyển
      move();
    },
    // Tự động hạ lưỡi câu
    autoMoveDown() {
      const step = () => {
        const outerHeight = this.$refs.outerContainer.clientHeight;
        const innerHeight = this.$refs.innerContainer.clientHeight;
        // Kiểm tra lưỡi câu có chạm đáy không
        if (this.fishing.innerPosition <= 0) {
          // Nếu chạm đáy và không chồng lấn, trừ điểm và tiến độ
          if (!this.fishing.overlap) {
            this.fishing.score = Math.max(this.fishing.score - 0.2, 0);
            this.updateProgressBar();
          }
        } else {
          // Hạ lưỡi câu
          this.fishing.innerPosition -= 1;
          this.$refs.innerContainer.style.bottom = `${this.fishing.innerPosition}px`;
          // Kiểm tra va chạm
          this.checkCollision();
        }
        // Yêu cầu khung hình tiếp theo
        this.fishing.moveDownAnimationId = requestAnimationFrame(step);
      };
      // Bắt đầu tự động hạ
      this.fishing.moveDownAnimationId = requestAnimationFrame(step);
    },
    // Di chuyển lưỡi câu lên mượt mà
    smoothMoveUp() {
      // Vị trí mục tiêu
      const targetPosition = Math.min(
        this.fishing.innerPosition + 10,
        this.$refs.outerContainer.clientHeight -
          this.$refs.innerContainer.clientHeight
      );
      const step = () => {
        if (this.fishing.innerPosition < targetPosition) {
          // Nâng lưỡi câu
          this.fishing.innerPosition += 2;
          this.$refs.innerContainer.style.bottom = `${this.fishing.innerPosition}px`;
          // Yêu cầu khung hình tiếp theo
          this.fishing.moveUpAnimationId = requestAnimationFrame(step);
        }
      };
      // Bắt đầu nâng mượt mà
      this.fishing.moveUpAnimationId = requestAnimationFrame(step);
    },
    // Kiểm tra va chạm
    checkCollision() {
      // Nếu trò chơi kết thúc hoặc hết thời gian, dừng kiểm tra
      if (this.fishing.gameOver || this.fishing.timeExpired) return;
      // Lấy vùng hình chữ nhật của cá
      const movingRect = this.$refs.movingContainer.getBoundingClientRect();
      // Lấy vùng hình chữ nhật của lưỡi câu
      const innerRect = this.$refs.innerContainer.getBoundingClientRect();
      // Kiểm tra lưỡi câu có chạm đáy không
      const isTouchingBottom = this.fishing.innerPosition <= 0;
      // Kiểm tra có chồng lấn không
      const isOverlap = !(
        (
          movingRect.bottom < innerRect.top || // Lưỡi câu dưới cá
          movingRect.top > innerRect.bottom || // Lưỡi câu trên cá
          movingRect.right < innerRect.left || // Lưỡi câu bên trái cá
          movingRect.left > innerRect.right
        ) // Lưỡi câu bên phải cá
      );
      // Cập nhật điểm dựa trên trạng thái chạm đáy và chồng lấn
      this.fishing.score = isOverlap
        ? Math.min(this.fishing.score + 0.1, 100)
        : isTouchingBottom
        ? Math.max(this.fishing.score - 0.2, 0)
        : Math.max(this.fishing.score - 0.2, 0);
      // Cập nhật thanh tiến độ sau khi cập nhật điểm
      this.updateProgressBar(this.fishing.score);
      // Cập nhật trạng thái chồng lấn
      this.fishing.overlap = isOverlap;
    },
    // Cập nhật thanh tiến độ
    updateProgressBar() {
      // Điểm tối đa
      const maxScore = 100;
      // Tính phần trăm tiến độ
      const progressPercentage = Math.min(
        (this.fishing.score / maxScore) * 100,
        100
      );
      if (this.fishing.score >= maxScore && !this.fishing.gameOver) {
        this.fishing.gameOver = true;
        const fishInfo = this.getRandomFish();
        this.$confirm(fishInfo.description, fishInfo.name, {
          center: true,
          showClose: false,
          lockScroll: false,
          showCancelButton: false,
          closeOnClickModal: false,
          confirmButtonText: "Bán con cá này",
        })
          .then(() => {
            // Kết thúc trò chơi
            this.endGame();
            // Tăng linh thạch
            this.player.props.money += fishInfo.price;
            this.$notifys({
              title: "Thông báo",
              message: `Bạn nhận được ${fishInfo.price} Linh thạch`,
              position: "top-left",
            });
          })
          .catch(() => {});
      }
      // Cập nhật văn bản thanh tiến độ
      this.fishing.progressText = Math.round(progressPercentage);
      // Cập nhật chiều cao thanh tiến độ
      this.fishing.progressPercentage = `${progressPercentage}%`;
    },
    // Bắt đầu đếm ngược
    startTimer() {
      const timer = setInterval(() => {
        this.fishing.timeLeft--;
        // Hết thời gian đếm ngược
        if (this.fishing.timeLeft == 0) {
          this.$confirm("Câu cá thất bại, con cá đã trốn thoát!", "Thông báo", {
            center: true,
            lockScroll: false,
            showCancelButton: false,
            confirmButtonText: "Xác nhận",
            dangerouslyUseHTMLString: true,
          })
            .then(() => {
              // Kết thúc trò chơi
              this.endGame();
            })
            .catch(() => {
              // Kết thúc trò chơi
              this.endGame();
            });
        }
      }, 1000);
      this.fishing.timerIds.push(timer);
    },
    // Kết thúc trò chơi câu cá
    endGame() {
      this.fishingShow = false;
      // Xóa tất cả định thời
      this.clearAllTiming();
      // Xóa điểm câu cá
      const index = this.$store.fishingMap.find((index) =>
        this.nearbyIndices.includes(index)
      );
      this.grid[index].type = "empty";
      // Kết thúc tất cả animation
      cancelAnimationFrame(this.fishing.moveUpAnimationId);
      cancelAnimationFrame(this.fishing.moveDownAnimationId);
      cancelAnimationFrame(this.fishing.moveParentContainerId);
      // Đặt lại dữ liệu câu cá
      this.resetFishingData(true);
    },
    // Bắt đầu trò chơi câu cá
    startGame() {
      this.fishingShow = true;
      this.resetFishingData(false);
      this.$nextTick(() => this.moveParentContainer());
      this.autoMoveDown();
      this.startTimer();
    },
    // Đặt lại tất cả dữ liệu câu cá
    resetFishingData(bool) {
      // Điểm số
      this.fishing.score = 0;
      // Trạng thái chồng lấn
      this.fishing.overlap = false;
      // Thời gian còn lại
      this.fishing.timeLeft = 60;
      // Trò chơi kết thúc
      this.fishing.gameOver = bool;
      // Vô hiệu hóa nút
      this.fishing.disabled = bool;
      // Hết thời gian
      this.fishing.timeExpired = bool;
      // Vị trí container bên trong
      this.fishing.innerPosition = 0;
      if (!bool) {
        // Tiến độ
        this.fishing.progressText = 0;
        // Cập nhật chiều cao thanh tiến độ
        this.fishing.progressPercentage = "0%";
      }
    },
    // Tạo thông tin cá ngẫu nhiên
    getRandomFish() {
      const random = Math.random();
      let cumulativeProbability = 0;
      const fishList = [
        {
          name: "Kim Lân Lý Ngư",
          price: 100,
          description:
            "Cá chép với vảy vàng, biểu tượng của may mắn và tài lộc.",
          probability: 0.25,
        },
        {
          name: "Thanh Đồng Cưu Ngư",
          price: 150,
          description:
            "Cá hồi thân hình khỏe khoắn, thường xuất hiện ở dòng sông mát lạnh.",
          probability: 0.2,
        },
        {
          name: "Băng Xuyên Tôn Ngư",
          price: 200,
          description: "Cá tuyết từ vùng băng giá, thịt tươi ngon.",
          probability: 0.18,
        },
        {
          name: "Hồng Vĩ Cẩm Lý",
          price: 300,
          description: "Cá chép với đuôi đỏ rực, giá trị thẩm mỹ cao.",
          probability: 0.15,
        },
        {
          name: "Ngân Kì Liên Ngư",
          price: 80,
          description:
            "Thường thấy ở hồ nước ngọt, vây bạc lấp lánh dưới nước.",
          probability: 0.3,
        },
        {
          name: "Cự Khẩu Nâm Ngư",
          price: 180,
          description:
            "Nổi tiếng với miệng lớn và lực cắn mạnh, thịt béo ngậy.",
          probability: 0.17,
        },
        {
          name: "U Lam Đăng Ngư",
          price: 250,
          description: "Cá nhỏ phát sáng màu lam huyền bí ở vùng biển sâu.",
          probability: 0.14,
        },
        {
          name: "Phỉ Thúy Kiếm Ngư",
          price: 500,
          description:
            "Mõm cá hình kiếm, vảy màu ngọc bích, là chiến binh dưới biển.",
          probability: 0.08,
        },
        {
          name: "Ban Điểm Lư Ngư",
          price: 90,
          description: "Cá vược đầy đốm, thích nghi mạnh, phân bố rộng.",
          probability: 0.28,
        },
        {
          name: "Hỏa Diệm Hồng Ngư",
          price: 400,
          description: "Cá hiếm với vảy đỏ rực như lửa, giá trị cao.",
          probability: 0.1,
        },
        {
          name: "Lôi Điện Mạn Ngư",
          price: 350,
          description:
            "Cá chình mang dòng điện yếu, có thể làm choáng con mồi.",
          probability: 0.12,
        },
        {
          name: "Hắc Giáp Sa Ngư",
          price: 600,
          description: "Cá mập với vảy đen như giáp, hung hãn.",
          probability: 0.06,
        },
        {
          name: "Thủy Tinh Lý Ngư",
          price: 120,
          description: "Cá chép với vảy trong suốt, lấp lánh dưới ánh nắng.",
          probability: 0.22,
        },
        {
          name: "Tử Kì Kim Thương Ngư",
          price: 700,
          description: "Loại cá ngừ thượng hạng với vây tím.",
          probability: 0.05,
        },
        {
          name: "Trân Châu Bối Ngư",
          price: 220,
          description: "Cá có hình dáng như vỏ sò, ánh sáng như ngọc trai.",
          probability: 0.16,
        },
        {
          name: "Lam Kình Ngư Miêu",
          price: 1000,
          description: "Cá con của cá voi xanh, tuy nhỏ nhưng tiềm năng lớn.",
          probability: 0.03,
        },
        {
          name: "Thải Hồng Tôn Ngư",
          price: 280,
          description:
            "Cá tuyết với màu sắc rực rỡ như cầu vồng, được yêu thích.",
          probability: 0.13,
        },
        {
          name: "Độc Châm Hà Ngư",
          price: 150,
          description: "Cá nóc nhỏ nhưng chứa kịch độc, cần xử lý cẩn thận.",
          probability: 0.2,
        },
        {
          name: "Hoàng Kim Hải Mã",
          price: 500,
          description: "Cá ngựa hiếm với cơ thể vàng óng ánh.",
          probability: 0.08,
        },
        {
          name: "Thâm Hải Ma Ngư",
          price: 800,
          description: "Cá khổng lồ ở biển sâu, ngoại hình đáng sợ.",
          probability: 0.04,
        },
      ];
      // Duyệt danh sách cá, chọn theo xác suất
      for (const fish of fishList) {
        // Cộng dồn xác suất
        cumulativeProbability += fish.probability;
        if (random < cumulativeProbability) {
          // Nếu số ngẫu nhiên nhỏ hơn xác suất cộng dồn, trả về cá này
          return fish;
        }
      }
      // Nếu không tìm thấy, trả về null
      return null;
    },
  },
};
// Triển khai hàng đợi ưu tiên dựa trên min heap
class MinHeap {
  constructor() {
    // Khởi tạo heap rỗng
    this.heap = [];
  }
  // Thêm node mới vào heap
  add(node, priority) {
    // Thêm node và ưu tiên vào cuối heap
    this.heap.push({ node, priority });
    // Đẩy node lên vị trí đúng để duy trì tính chất heap
    this.bubbleUp(this.heap.length - 1);
  }
  // Đẩy node lên để duy trì tính chất heap
  bubbleUp(index) {
    // Chỉ số node cha
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      // Nếu ưu tiên của cha nhỏ hơn hoặc bằng ưu tiên hiện tại, thoát
      if (this.heap[parentIndex].priority <= this.heap[index].priority) break;
      // Hoán đổi node hiện tại với node cha
      [this.heap[parentIndex], this.heap[index]] = [
        this.heap[index],
        this.heap[parentIndex],
      ];
      // Cập nhật chỉ số thành chỉ số cha
      index = parentIndex;
    }
  }
  // Xóa và trả về node nhỏ nhất (ưu tiên cao nhất)
  poll() {
    // Node nhỏ nhất ở đầu heap
    const min = this.heap[0];
    // Lấy node cuối và xóa
    const end = this.heap.pop();
    // Nếu heap còn node, di chuyển node cuối lên đầu và đẩy xuống
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this.bubbleDown(0);
    }
    // Trả về node nhỏ nhất
    return min.node;
  }
  // Đẩy node xuống để duy trì tính chất heap
  bubbleDown(index) {
    const length = this.heap.length;
    const element = this.heap[index];
    while (true) {
      // Chỉ số con trái và con phải
      let leftChildIndex = 2 * index + 1;
      let rightChildIndex = 2 * index + 2;
      let swapIndex = null;
      // Nếu con trái tồn tại và ưu tiên nhỏ hơn node hiện tại, chọn để hoán đổi
      if (leftChildIndex < length) {
        if (this.heap[leftChildIndex].priority < element.priority) {
          swapIndex = leftChildIndex;
        }
      }
      // Nếu con phải tồn tại và ưu tiên nhỏ hơn node hiện tại hoặc con trái, chọn để hoán đổi
      if (rightChildIndex < length) {
        if (
          (swapIndex === null &&
            this.heap[rightChildIndex].priority < element.priority) ||
          (swapIndex !== null &&
            this.heap[rightChildIndex].priority <
              this.heap[leftChildIndex].priority)
        )
          swapIndex = rightChildIndex;
      }
      // Nếu không có con nào để hoán đổi, thoát
      if (swapIndex === null) break;
      // Hoán đổi node hiện tại với node con được chọn
      [this.heap[index], this.heap[swapIndex]] = [
        this.heap[swapIndex],
        this.heap[index],
      ];
      // Cập nhật chỉ số thành chỉ số con
      index = swapIndex;
    }
  }
  // Kiểm tra heap có rỗng không
  isEmpty() {
    return this.heap.length === 0;
  }
}
</script>

<style scoped>
.map {
  max-width: 770px;
  height: 500px;
  overflow: auto;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(50, 12px);
  grid-template-rows: repeat(50, 12px);
  gap: 1px;
  width: fit-content;
  margin: 0 auto;
}

.grid-item {
  width: 12px;
  height: 12px;
  background-color: #ddd;
}

.player {
  background-color: var(--el-color-success);
}

.fishing {
  background-color: var(--el-color-primary);
}

.obstacle {
  background-color: var(--el-color-warning);
}

.npc {
  background-color: var(--el-color-pink-light);
}

.empty {
  background-color: var(--el-color-info-light-8);
}

.x-0.y-0 {
  border-top-left-radius: 2px;
}

.x-49.y-0 {
  border-top-right-radius: 2px;
}

.x-0.y-49 {
  border-bottom-left-radius: 2px;
}

.x-49.y-49 {
  border-bottom-right-radius: 2px;
}

.controls {
  text-align: center;
  margin-top: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto auto;
  margin: 20px auto;
}

.center-buttons {
  display: flex;
  justify-content: space-between;
  grid-column: span 3;
}

.controls > button,
.center-buttons > button {
  padding: 10px;
  margin: 5px;
  font-size: 16px;
}

.legend {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  margin: 0 10px;
}

@media only screen and (max-width: 768px) {
  .legend {
    flex-wrap: wrap;
  }

  .legend-item {
    width: 33.333%;
    margin: 10px 0 0 0;
    justify-content: center;
  }
}

.color-box {
  width: 12px;
  height: 12px;
  margin-right: 5px;
  border-radius: 2px;
}

.wife-box {
  padding: 0 5px;
}

.attribute-box {
  display: flex;
  flex-wrap: wrap;
}

.attribute {
  width: 100%;
  margin: 4px;
}

.click-box {
  padding: 0 5px;
  margin-top: 10px;
  display: flex;
}

.click-box button {
  margin-top: 10px;
  width: 100%;
}

.gift-box {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 20px;
}

.gift-item {
  width: calc(50% - 8px);
  margin-top: 10px;
  display: grid;
  padding: 0 4px;
}

/* 钓鱼 */
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time {
  font-size: 15px;
  margin-bottom: 10px;
}

.outer-wrapper {
  display: flex;
  align-items: center;
}

.progress-bar-container {
  width: 40px;
  height: 400px;
  margin-right: 10px;
  border: 2px solid var(--el-border-color);
  border-radius: 5px;
  position: relative;
  overflow: hidden;
}

.progress-bar {
  width: 100%;
  height: 0%;
  background-color: var(--el-color-success);
  position: absolute;
  bottom: 0;
  transition: height 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.progress-text {
  color: var(--el-text-color-primary);
  font-size: 13px;
  font-weight: bold;
  padding-bottom: 5px;
  position: relative;
  top: 50%;
  bottom: 0;
  text-align: center;
  transform: translateY(-50%);
}

.outer-container {
  width: 50px;
  height: 400px;
  position: relative;
  overflow: hidden;
  border: 2px solid var(--el-text-color-primary);
  border-radius: 5px;
}

.moving-container {
  width: 50px;
  height: 50px;
  /* background-color: lightblue; */
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.moving-container svg {
  width: 36px;
  height: 36px;
}

.inner-container {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  transition: bottom 0.1s ease;
}

.inner-container svg {
  width: 36px;
  height: 36px;
  transform: scaleX(-1);
}

.button {
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 16px;
  width: 100%;
}

/* Nút di chuyển */
.shortcutKeys {
  color: rgba(169, 169, 169, 0.4);
  margin-left: 2px;
}

@media only screen and (max-width: 768px) {
  .shortcutKeys {
    display: none;
  }
}
</style>

<style>
/* Hoạt hình câu cá */
@keyframes wobble {
  0% {
    transform: translateX(-50%) rotate(0);
  }

  25% {
    transform: translateX(-50%) rotate(-5deg);
  }

  50% {
    transform: translateX(-50%) rotate(0);
  }

  75% {
    transform: translateX(-50%) rotate(5deg);
  }

  100% {
    transform: translateX(-50%) rotate(0);
  }
}
</style>
