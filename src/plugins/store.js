import crypto from "@/plugins/crypto";
import {
  auth,
  db,
  onAuthStateChanged,
  signInAnonymously,
} from "@/plugins/firebase";
import { saveAs } from "file-saver";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
  state: () => ({
    isReady: false, // Trạng thái sẵn sàng
    // Thuộc tính của boss
    boss: {
      name: "",
      text: "",
      time: 0,
      desc: "",
      level: 0,
      dodge: 0,
      attack: 0,
      health: 0,
      conquer: false,
      defense: 0,
      critical: 0,
      maxhealth: 0,
    },
    // Thuộc tính của người chơi
    player: {
      id: null, // ID người chơi
      zc: false, // Trạng thái chưa rõ (có thể là trạng thái đặc biệt)
      age: 1, // Tuổi
      pet: {}, // Thú cưng hiện tại
      time: 0, // Thời gian chơi
      name: "Người chơi", // Tên người chơi
      dark: false, // Chế độ tối
      npcs: [], // Danh sách NPC
      wife: {}, // Vợ hiện tại
      pets: [], // Danh sách thú cưng
      wifes: [], // Danh sách vợ
      props: {
        money: 0, // Linh thạch
        flying: 0, // Phi hành (có thể là điểm phi hành)
        qingyuan: 0, // Tình duyên
        rootBone: 0, // Căn cốt
        currency: 0, // Tiền tệ
        cultivateDan: 0, // Đan dược tu luyện
        strengtheningStone: 0, // Thạch cường hóa
      },
      score: 0, // Điểm số
      level: 0, // Cảnh giới
      dodge: 0, // Tỷ lệ né tránh
      points: 0, // Điểm thuộc tính
      attack: 10, // Công kích
      health: 100, // Khí huyết
      critical: 0, // Tỷ lệ bạo kích
      defense: 10, // Phòng thủ
      mana: 0, // Năng lượng
      taskNum: 0, // Số lượng nhiệm vụ
      version: 0.8, // Phiên bản trò chơi
      currency: 0, // Tiền tệ (trùng lặp với props.currency, có thể là lỗi)
      maxHealth: 100, // Khí huyết tối đa
      inventory: [], // Túi đồ
      isNewbie: false, // Trạng thái tân thủ
      shopData: [], // Dữ liệu cửa hàng
      equipment: {
        sutra: {}, // Pháp bảo
        armor: {}, // Giáp
        weapon: {}, // Vũ khí
        accessory: {}, // Linh bảo
      },
      achievement: {
        pet: [], // Thành tựu thú cưng
        monster: [], // Thành tựu quái vật
        equipment: [], // Thành tựu trang bị
      },
      script: "", // Kịch bản (có thể là cốt truyện)
      cultivation: 0, // Độ tu luyện
      currentTitle: null, // Danh hiệu hiện tại
      reincarnation: 0, // Số lần luân hồi
      maxCultivation: 100, // Độ tu luyện tối đa
      backpackCapacity: 50, // Dung lượng túi đồ
      sellingEquipmentData: [], // Dữ liệu trang bị đang bán
      highestTowerFloor: 1, // Tầng cao nhất của Vô Tận Tháp
      rewardedTowerFloors: [], // Danh sách tầng đã nhận thưởng
      nextGameTimes: {
        rps: null, // Thời gian chơi oẳn tù tì tiếp theo
        dice: null, // Thời gian chơi xúc xắc tiếp theo
        fortune: null, // Thời gian xem bói tiếp theo
        secretrealm: 0, // Bí cảnh
        gamblingStone: null, // Thời gian đánh cược đá tiếp theo
      },
      gameWins: 0, // Số lần thắng trò chơi
      gameLosses: 0, // Số lần thua trò chơi
      checkinDays: 0, // Số ngày điểm danh
      checkinStreak: 0, // Chuỗi điểm danh liên tục
      lastCheckinDate: null, // Ngày điểm danh cuối cùng
      fortuneTellingDate: null, // Ngày xem bói cuối cùng
      statusEffects: [], // 
      cultivationPath: {
        // Tiên đạo
        path: null,
        pathLevel: 0,
        pathExp: 0,
        maxPathExp: 100,
        skills: [],
        artifacts: [],
        bonuses: {
          attackPower: 0,
          defensePower: 0,
          criticalChance: 0,
          dodgeChance: 0,
          manaGainRate: 0,
          craftingSuccessRate: 0,
        },
      },
      map: {
        currentArea: null,
        playerPosition: { x: 50, y: 50 },
        beasts: [],
        path: [],
        detectionRadius: 5,
        baseMovementSpeed: 10,
        maxMovementSpeed: 15,
        autoBattle: {
          isActive: false,
          lastMoveTime: null,
          lastPathUpdate: null,
          accumulatedRewards: { spiritualEnergy: 0, money: 0, items: [] },
        },
        visualEffects: { auraOpacity: 0, glow: false },
      },
    },
    // Thông tin quái vật
    monster: {
      name: "", // Tên quái vật
      health: 0, // Khí huyết
      attack: 0, // Công kích
      defense: 0, // Phòng thủ
      dodge: 0, // Tỷ lệ né tránh
      critical: 0, // Tỷ lệ bạo kích
    },
    mapData: {
      y: 0, // Tọa độ y
      x: 0, // Tọa độ x
      map: [], // Dữ liệu bản đồ
    },
    mapScroll: 0, // Vị trí cuộn bản đồ
    fishingMap: [], // Bản đồ câu cá
  }),
  actions: {
    async init() {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            this.player.id = user.uid;
          } else {
            const result = await signInAnonymously(auth);
            this.player.id = result.user.uid;
          }
          this.isReady = true;
          resolve();
        });
      });
    },
    // Nhập lưu trữ từ máy tính
    importData(data) {
      const file = data.file;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          // Nhập lưu trữ
          localStorage.setItem("vuex", e.target.result);
          // Làm mới trang
          location.reload(1);
        } catch (err) {
          this.err = err;
          this.errBox = true;
          this.$notifys({
            title: "Nhập script thất bại",
            message: "Sao chép thông tin lỗi vào nhóm hỗ trợ để được giúp đỡ",
          });
        }
      };
      reader.readAsText(file);
    },
    exportData() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const hours = String(today.getHours()).padStart(2, "0");
      const minutes = String(today.getMinutes()).padStart(2, "0");
      const seconds = String(today.getSeconds()).padStart(2, "0");
      const blob = new Blob([localStorage.getItem("vuex")], {
        type: "application/json;charset=utf-8",
      });
      const name = `Tu Tiên Văn Tự Của Tôi Toàn Dựa Vào Cày-[Thời gian xuất lưu trữ ${year}${month}${day}${hours}${minutes}${seconds}]-[Phiên bản trò chơi ${this.ver}].json`;
      saveAs(blob, name);
    },
    async savePlayerData() {
      if (!this.isReady) return;
      try {
        await setDoc(doc(db, "players", this.player.id), {
          data: crypto.encryption(this.player), // Mã hóa dữ liệu người chơi
        });
      } catch (error) {
        console.error("Lỗi khi lưu:", error);
      }
    },
    async getAllPlayerItems() {
      try {
        const colRef = collection(db, "players");
        const querySnapshot = await getDocs(colRef);
        const items = [];

        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });

        const players = items.map((item) => {
          const decryptedData = crypto.decryption(item.data);
          return { id: item.id, ...decryptedData };
        });

        return players;
      } catch (error) {
        console.error("Error fetching items:", error);
        return [];
      }
    },

  },
  persist: {
    key: "vuex", // Khóa lưu trữ
    paths: ["boss", "player"], // Các thuộc tính được lưu trữ
    storage: localStorage, // Nơi lưu trữ
    serializer: {
      serialize: (state) => {
        return JSON.stringify({
          boss: crypto.encryption(state.boss), // Mã hóa dữ liệu boss
          player: crypto.encryption(state.player), // Mã hóa dữ liệu người chơi
        });
      },
      deserialize: (value) => {
        const state = JSON.parse(value);
        return {
          boss: crypto.decryption(state.boss), // Giải mã dữ liệu boss
          player: crypto.decryption(state.player), // Giải mã dữ liệu người chơi
        };
      },
    },
  },
});
