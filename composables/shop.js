const shop = {
  // Tạo danh sách trang bị ngẫu nhiên cho cửa hàng
  drawPrize(lv) {
    const types = [
      { type: "weapon", data: this.equipWeapons() },
      { type: "armor", data: this.equipArmors() },
      { type: "accessory", data: this.equipAccessories() },
      { type: "sutra", data: this.equipSutras() },
    ];
    const genre = {
      sutra: "Pháp bảo",
      armor: "Giáp",
      weapon: "Vũ khí",
      accessory: "Linh bảo",
    };
    const getAttribute = (type, lv, attribute) => {
      // Điều chỉnh giá trị thuộc tính trang bị
      const multiplier = 15;
      const dodge = this.getRandomFloatInRange(0.02, 0.25);
      const Attack = this.getRandomInt(200, 1000) * lv;
      const Health = this.getRandomInt(2000, 10000) * lv;
      const defense = this.getRandomInt(200, 1000) * lv;
      const CriticalHitrate = this.getRandomFloatInRange(0.02, 0.25);
      const attrs = {
        score: this.calculateEquipmentScore(
          dodge,
          Attack,
          Health,
          CriticalHitrate,
          defense
        ), // Điểm số trang bị
        dodge: ["accessory", "sutra"].includes(type) ? dodge : 0,
        attack: ["weapon", "accessory", "sutra"].includes(type)
          ? Attack * multiplier
          : 0,
        health: ["armor", "accessory", "sutra"].includes(type)
          ? Health * multiplier
          : 0,
        defense: ["armor", "accessory", "sutra"].includes(type)
          ? defense * multiplier
          : 0,
        critical: ["weapon", "accessory", "sutra"].includes(type)
          ? CriticalHitrate
          : 0,
      };
      return attrs[attribute];
    };
    return types.map(({ type, data }) => ({
      type,
      name: genre[type],
      data: data.flatMap((name) => ({
        id: Date.now(),
        name,
        type,
        lock: true,
        level: lv,
        score: getAttribute(type, lv, "score"),
        dodge: getAttribute(type, lv, "dodge"),
        attack: getAttribute(type, lv, "attack"),
        health: getAttribute(type, lv, "health"),
        defense: getAttribute(type, lv, "defense"),
        critical: getAttribute(type, lv, "critical"),
        // Dữ liệu ban đầu
        initial: {
          dodge: getAttribute(type, lv, "dodge"), // Tỷ lệ né tránh
          attack: getAttribute(type, lv, "attack"), // Công kích
          health: getAttribute(type, lv, "health"), // Khí huyết
          defense: getAttribute(type, lv, "defense"), // Phòng thủ
          critical: getAttribute(type, lv, "critical"), // Tỷ lệ bạo kích
        },
        quality: "pink",
      })),
    }));
  },
  // Danh sách vũ khí trong cửa hàng
  equipWeapons() {
    return [
      "Phấn Tinh Nguyệt Nhẫn Kiếm",
      "Anh Hoa Phi Tuyết Cung",
      "Tường Vi Triền Nhiễu Tiên",
      "Mật Đào Mộng Cảnh Trượng",
      "Phấn Điệp Huyễn Quang Nhẫn",
      "Phấn Tinh Lưu Quang Phiến",
      "Ngọt Ngào Thủy Tinh Thương",
      "Phấn Anh Ma Pháp Trượng",
      "Phấn Toản Tâm Ngữ Nỗ",
      "Nhu Phấn Tường Vi Thuẫn",
    ];
  },
  // Danh sách giáp trong cửa hàng
  equipArmors() {
    return [
      "Phấn Anh Kỳ Mộng Thường",
      "Ngọt Ngào Phấn Điệp Y",
      "Mật Đào Luyến Khúc Quần",
      "Phấn Tinh Lưu Quang Khải",
      "Anh Hoa Luyến Ca Bào",
      "Nhu Phấn Tường Vi Giáp",
      "Phấn Điệp Phiêu Phiêu Tụ",
      "Ngọt Ngào Vũ Chức Y",
      "Phấn Tinh Huyễn Thải Quần",
      "Mật Đào Mộng Cảnh Bào",
    ];
  },
  // Danh sách linh bảo trong cửa hàng
  equipAccessories() {
    return [
      "Phấn Tinh Mộng Điệp Liên",
      "Anh Hoa Luyến Khúc Trâm",
      "Ngọt Ngào Tường Vi Giới",
      "Mật Đào Kỳ Mộng Hoàn",
      "Phấn Điệp Khinh Vũ Trụy",
      "Phấn Tinh Ngọt Ngào Liên",
      "Nhu Phấn Tâm Ngữ Nhĩ",
      "Anh Hoa Kỳ Mộng Trạc",
      "Mật Đào Mộng Cảnh Trâm",
      "Phấn Điệp Huyễn Thải Đái",
    ];
  },
  // Danh sách pháp bảo trong cửa hàng
  equipSutras() {
    return [
      "Phấn Anh Mộng Huyễn Địch",
      "Ngọt Tâm Phấn Điệp Hồ",
      "Mật Đào Luyến Ngữ Kính",
      "Phấn Tinh Lưu Quang Châu",
      "Nhu Phấn Kỳ Mộng Thạch",
      "Anh Hoa Phân Phi Phiến",
      "Ngọt Ngào Kỳ La Bàn",
      "Mật Đào Huyễn Ảnh Đăng",
      "Phấn Điệp Chức Mộng Cầm",
      "Phấn Anh Thủ Hộ Phù",
    ];
  },
  // Tạo số nguyên ngẫu nhiên trong khoảng [min, max]
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  // Tạo số thực ngẫu nhiên trong khoảng [min, max]
  getRandomFloatInRange(min, max) {
    return Math.random() * (max - min) + min;
  },
  // Tính điểm số trang bị
  calculateEquipmentScore(
    dodge = 0,
    attack = 0,
    health = 0,
    critical = 0,
    defense = 0
  ) {
    // Trọng số điểm số
    const weights = {
      attack: 1.5, // Công kích
      health: 1.0, // Khí huyết
      defense: 1.2, // Phòng thủ
      critRate: 1.8, // Bạo kích
      dodgeRate: 1.6, // Né tránh
    };
    // Tính điểm số
    const score =
      dodge * weights.dodgeRate +
      attack * weights.attack +
      (health / 100) * weights.health +
      defense * weights.defense +
      critical * weights.critRate;
    return Math.floor(score);
  },
};
export default shop;
