const equips = {
  drawPrize(
    lv,
    type,
    names_a,
    names_b,
    names_c,
    names_d,
    names_e,
    names_f,
    isNewbie
  ) {
    // Nếu cấp độ người chơi là 0, cấp độ trang bị tối thiểu là 1; nếu cấp độ dưới 40, tạo ngẫu nhiên trang bị ở cấp độ hiện tại hoặc thấp hơn
    lv = lv == 0 ? 1 : lv;
    // Nếu đã nhận gói quà tân thủ
    if (isNewbie) lv = this.getRandomInt(1, lv);
    // Xác suất nhận được các phẩm chất trang bị
    const weaponTypes = {
      info: { names: names_a, probability: 50 }, // Trang bị trắng
      success: { names: names_b, probability: 20 }, // Trang bị xanh lá
      primary: { names: names_c, probability: 15 }, // Trang bị xanh dương
      purple: { names: names_d, probability: 9 }, // Trang bị tím
      warning: { names: names_e, probability: 5 }, // Trang bị vàng
      danger: { names: names_f, probability: 1 }, // Trang bị đỏ
    };
    const totalProbability = Object.values(weaponTypes).reduce(
      (acc, { probability }) => acc + probability,
      0
    );
    const random = Math.floor(Math.random() * totalProbability);
    let cumulativeProbability = 0;
    for (const [quality, { names, probability }] of Object.entries(
      weaponTypes
    )) {
      cumulativeProbability += probability;
      if (random < cumulativeProbability) {
        // Điều chỉnh giá trị thuộc tính trang bị dựa trên phẩm chất
        const qualityMultiplier = {
          info: 1.2,
          success: 2,
          primary: 3,
          purple: 5,
          warning: 7,
          danger: 10,
        };
        const multiplier = qualityMultiplier[quality];
        const dodge = ["accessory", "sutra"].includes(type)
          ? this.equip_Criticalhitrate(lv)
          : 0;
        const attack = ["weapon", "accessory", "sutra"].includes(type)
          ? Math.floor(this.equip_Attack(lv) * multiplier)
          : 0;
        const health = ["armor", "accessory", "sutra"].includes(type)
          ? Math.floor(this.equip_Health(lv) * multiplier)
          : 0;
        const defense = ["armor", "accessory", "sutra"].includes(type)
          ? Math.floor(this.equip_Attack(lv) * multiplier)
          : 0;
        const critical = ["weapon", "accessory", "sutra"].includes(type)
          ? this.equip_Criticalhitrate(lv)
          : 0;
        const baseEquip = {
          id: Date.now(), // ID trang bị
          name: names[Math.floor(Math.random() * names.length)], // Tên trang bị
          type, // Loại trang bị
          lock: false,
          level: lv, // Cấp độ trang bị
          score: this.calculateEquipmentScore(
            dodge,
            attack,
            health,
            critical,
            defense
          ), // Điểm số trang bị
          dodge, // Tỷ lệ né tránh
          attack, // Công kích
          health, // Khí huyết
          defense, // Phòng thủ
          critical, // Tỷ lệ bạo kích
          // Dữ liệu ban đầu
          initial: {
            dodge, // Tỷ lệ né tránh
            attack, // Công kích
            health, // Khí huyết
            defense, // Phòng thủ trang bị
            critical, // Tỷ lệ bạo kích
          },
          quality,
          strengthen: 0, // Cấp độ luyện khí
        };
        return baseEquip;
      }
    }
  },
  equip_Weapons(lv, isNewbie = false) {
    const names_a = [
      "Bạch Ngọc Tịnh Trần Kiếm",
      "Tuyết Phách Hàn Băng Thương",
      "Bạch Long Ngâm Phong Cung",
      "Nguyệt Hoa Lưu Quang Phiến",
      "Bạch Ngọc Huyền Linh Địch",
      "Sương Tuyết Vô Ngân Tiên",
      "Vân Ẩn Bạch Hoàng Nhẫn",
      "Tịnh Thế Bạch Liên Trượng",
      "Băng Phách Hàn Quang Luân",
      "Bạch Ngọc Linh Lung Tháp",
    ];
    const names_b = [
      "Thúy Ngọc Thanh Đằng Kiếm",
      "Bích Ảnh Linh Xà Tiên",
      "Lục Diệp Phong Bạo Cung",
      "Thanh Mộc Trường Sinh Trượng",
      "Phỉ Thúy Linh Tê Nhẫn",
      "Đằng Mạn Triền Nhiễu Tác",
      "Thúy Trúc Thanh Phong Phiến",
      "Sinh Mệnh Chi Tuyền Hồ",
      "Lục Dã Tiên Tung Địch",
      "Tâm La Vạn Tượng Luân",
    ];
    const names_c = [
      "Hàn Băng Phá Hiểu Kiếm",
      "Bích Hải Triều Sinh Địch",
      "Lam Ngọc Băng Phách Cung",
      "Thương Khung Lam Long Thương",
      "Băng Phách Hàn Quang Kiếm",
      "Giao Nhân Chức Mộng Phiến",
      "Thâm Hải Chi Nộ Kích",
      "Bích Ba Lăng Tiêu Trượng",
      "U Lam Điệp Vũ Tiên",
      "Ngân Hà Lạc Sương Nhẫn",
    ];
    const names_d = [
      "Tử Tiêu Long Ngâm Kiếm",
      "U Minh Tử Điệp Nhẫn",
      "Tinh Hà Tử Điện Thương",
      "Tử Ngọc Hàn Băng Cung",
      "Tử Diệm Phượng Hoàng Cầm",
      "Thương Khung Tử Lôi Chùy",
      "Tử Liên U Quang Phiến",
      "Tử Tinh Phá Hiểu Kích",
      "U Minh Tử Ảnh Tiên",
      "Tử Tiêu Lăng Hư Trượng",
    ];
    const names_e = [
      "Kim Hoàng Kiếm",
      "Xích Diệm Trường Thương",
      "Hổ Phách Lưu Quang Cung",
      "Long Lân Kim Phủ",
      "Phá Hiểu Hoàng Ngọc Chùy",
      "Viêm Dương Tiên",
      "Lưu Quang Phiến",
      "Chiến Thần Kim Kích",
      "Hoàng Mang Thiểm Điện Nhẫn",
      "Nhật Diệu Càn Khôn Luân",
    ];
    const names_f = [
      "Xích Diệm Phượng Hoàng Kiếm",
      "Huyết Ngọc Hồng Liên Thương",
      "Liệt Diệm Phần Thiên Cung",
      "Xích Tiêu Thần Hỏa Kích",
      "Hỏa Vũ Lưu Vân Phiến",
      "Chu Tước Viêm Dực Tiên",
      "Xích Long Phần Thế Nhẫn",
      "Viêm Ngục Ma Đồng Liêm",
      "Xích Huyết Tinh Thần Trượng",
      "Hồng Liên Nghiệp Hỏa Luân",
    ];
    return this.drawPrize(
      lv,
      "weapon",
      names_a,
      names_b,
      names_c,
      names_d,
      names_e,
      names_f,
      isNewbie
    );
  },
  equip_Armors(lv, isNewbie = false) {
    const names_a = [
      "Diêu Trì Tiên Tiêu Vũ Y",
      "Quảng Hàn Ngọc Thố Sương Giáp",
      "Côn Lôn Ngọc Bích Chiến Bào",
      "Bạch Long Thổ Châu Vân Thường",
      "Cửu Thiên Huyền Nữ Tố Lăng",
      "Diêu Quang Tinh Thần Chức Cẩm",
      "Băng Phách Ngân Ti Chiến Y",
      "Lăng Tiêu Quỳnh Hoa Bảo Y",
      "Tuyết Vực Thần Nữ Tuyết Nhung",
      "Vân Ẩn Long Lân Khinh Giáp",
    ];
    const names_b = [
      "Thúy Trúc U Lan Khinh Sam",
      "Bích Lạc Thanh Đằng Vân Thường",
      "Bích Nhãn Kỳ Lân Chiến Y",
      "Thanh Loan Tường Dực Chức Cẩm",
      "Thương Ngô Cổ Mộc Linh Bào",
      "Lục Dã Tiên Tung Vũ Y",
      "Linh Xà Thúy Mạn Nhu Giáp",
      "Phỉ Thúy Lưu Ly Trường Quần",
      "Tùng Phong Trúc Ảnh Khinh Cừu",
      "Xuân Thủy Bích Vu Thiên Y",
    ];
    const names_c = [
      "Hàn Băng Hộ Giáp Y",
      "Bích Ba Thủ Hộ Khải",
      "Lam Ngọc Băng Tâm Liên Giáp",
      "Thương Khung Lam Linh Phi Phong",
      "Thâm Hải Giao Long Lân Giáp",
      "Băng Phách U Quang Chiến Khải",
      "Lam Điệp Khinh Vũ Hộ Uyển",
      "Ngân Hà Chi Thuẫn Hung Giáp",
      "Giao Nhân Chức Mộng Hộ Thối",
      "Bích Ba Lăng Ba Ngoa",
    ];
    const names_d = [
      "Tử Vân Chức Cẩm Bào",
      "U Minh Tử Sương Giáp",
      "Tinh Hà Tử Hà Y",
      "Tử Ngọc Băng Tâm Liên Giáp",
      "Tử Diệm Phượng Hoàng Phi Phong",
      "Thương Khung Tử Lôi Chiến Khải",
      "Tử Liên U Quang Hộ Uyển",
      "Tử Tinh Lăng Tiêu Chiến Quần",
      "U Minh Tử Ảnh Hộ Thối",
      "Tử Tiêu Trục Phong Ngoa",
    ];
    const names_e = [
      "Kim Huy Lưu Quang Cẩm Bào",
      "Hổ Phách Lưu Quang Chiến Y",
      "Hoàng Thổ Long Văn Trường Bào",
      "Nhật Viêm Kim Lân Khải Giáp",
      "Thu Cúc Kim Toạn Hoa Phục",
      "Mật Sáp Hoàng Tù Vân Thường",
      "Phượng Hoàng Niết Bàn Hoàng Sam",
      "Hoàng Sa Mạn Thiên Phi Phong",
      "Kim Tuy Lưu Quang Sa Quần",
      "Huy Hoàng Kim Vũ Chiến Bào",
    ];
    const names_f = [
      "Liệt Diệm Hồng Liên Chiến Giáp",
      "Xích Tiêu Hỏa Phượng Vân Thường",
      "Chu Tước Phần Thiên Chức Cẩm",
      "Xích Diệm Long Lân Bảo Y",
      "Huyết Sắc Tường Vi Hoa Phục",
      "Đan Hà Lưu Quang Trường Bào",
      "Viêm Dương Xích Liệt Chiến Bào",
      "Xích Hỏa Hồng Liên Phi Phong",
      "Hỏa Vũ Phượng Hoàng Vũ Y",
      "Hồng Liên Nghiệp Hỏa Cẩm Y",
    ];
    return this.drawPrize(
      lv,
      "armor",
      names_a,
      names_b,
      names_c,
      names_d,
      names_e,
      names_f,
      isNewbie
    );
  },
  equip_Accessorys(lv, isNewbie = false) {
    const names_a = [
      "Diêu Trì Bạch Ngọc Trâm",
      "Nguyệt Hoa Lưu Quang Trụy",
      "Hàn Sương Ngưng Lộ Liên",
      "Cửu Thiên Huyền Nữ Ngọc Bội",
      "Vân Cẩm Chức Mộng Trạc",
      "Long Diên Nhuận Tuyết Hoàn",
      "Bạch Hạc Hàm Châu Bội",
      "Tiên Sơn Tuyết Liên Hoa Liên",
      "Diêu Đài Tiên Lộ Nhĩ Hoàn",
      "Ngân Hà Chức Mộng Hạng Liên",
    ];
    const names_b = [
      "Thúy Trúc Ngưng Lộ Trâm",
      "Bích Tuyền U Lan Liên",
      "Thanh Đằng Nhiễu Mộng Trạc",
      "Phỉ Thúy Linh Diệp Nhĩ Hoàn",
      "Linh Sơn Tiên Thảo Ngọc Bội",
      "Tùng Bách Trường Thanh Giới",
      "Thúy Ảnh Khinh Vũ Hạng Liên",
      "Lục Dã Tiên Tung Thủ Hoàn",
      "Bích Ba Đãng Dạng Châu Liên",
      "Xuân Hồi Đại Địa Ngọc Bội",
    ];
    const names_c = [
      "Bích Hải San Hô Trâm",
      "Băng Phách U Lam Liên",
      "Thâm Hải Trân Châu Nhĩ Hoàn",
      "Lam Điền Ngọc Tủy Trạc",
      "Thương Khung Lam Bảo Trụy",
      "Giao Nhân Lệ Tích Châu",
      "Bích Ba Đãng Dạng Giới",
      "Ngân Hà Chi Tâm Hạng Liên",
      "Lam Điệp Phi Vũ Thủ Hoàn",
      "Thâm Hải Long Lân Bội",
    ];
    const names_d = [
      "Tử Tiêu Lưu Quang Giới",
      "U Minh Tử Điệp Hạng Liên",
      "Tinh Hà Tử Ngọc Nhĩ Hoàn",
      "Tử Ngọc Băng Tâm Thủ Liên",
      "Tử Diệm Phượng Hoàng Trâm",
      "Thương Khung Tử Lôi Điếu Trụy",
      "Tử Liên U Quang Phát Đái",
      "Tử Tinh Phá Hiểu Hộ Phù",
      "U Minh Tử Ảnh Chỉ Hoàn",
      "Tử Tiêu Lăng Hư Ngọc Bội",
    ];
    const names_e = [
      "Kim Huy Nhật Miện Trâm",
      "Hổ Phách Lưu Quang Liên",
      "Hoàng Lương Nhất Mộng Trạc",
      "Hoàng Thiên Hậu Thổ Ngọc Bội",
      "Mật Sáp Phúc Thụy Giới",
      "Thu Thâu Vạn Hạt Hạng Liên",
      "Noãn Dương Chiếu Diệu Nhĩ Hoàn",
      "Viêm Hoàng Tử Tôn Ngọc Bội",
      "Kim Sắc Mạch Điền Thủ Hoàn",
      "Thịnh Thế Phồn Hoa Châu Liên",
    ];
    const names_f = [
      "Xích Diệm Phượng Hoàng Linh",
      "Huyết Phách Lưu Ly Trụy",
      "Liệt Diệm Hồng Bảo Thạch Liên",
      "Chu Tước Chi Dực Nhĩ Hoàn",
      "Hồng Liên Nghiệp Hỏa Trạc",
      "Đan Tiêu Hỏa Phượng Giới",
      "Mã Não Xích Diệm Hạng Liên",
      "Xích Thiên Sứ Chi Lệ Bội",
      "Phỉ Hồng Chức Cẩm Thủ Hoàn",
      "Hỏa Phượng Niết Bàn Châu Liên",
    ];
    return this.drawPrize(
      lv,
      "accessory",
      names_a,
      names_b,
      names_c,
      names_d,
      names_e,
      names_f,
      isNewbie
    );
  },
  equip_Sutras(lv, isNewbie = false) {
    const names_a = [
      "Bạch Ngọc Tịnh Bình",
      "Hàn Sương Lưu Ly Kính",
      "Diêu Trì Tuyết Liên Châu",
      "Cửu Thiên Huyền Băng Xích",
      "Nguyệt Hoa Bảo Liên Đăng",
      "Bạch Vân Ẩn Long Địch",
      "Ngọc Thanh Côn Lôn Phiến",
      "Tịnh Thế Bạch Liên Tọa",
      "Ngân Hà Lạc Tuyết Cầm",
      "Bích Lạc Diêu Quang Bàn",
    ];
    const names_b = [
      "Thúy Ngọc Hồ Lô",
      "Thanh Mộc Trường Sinh Trượng",
      "Bích Lạc Linh Châu",
      "U Minh Quỷ Đằng Tiên",
      "Vạn Mộc Hồi Xuân Đồ",
      "Lục Kỳ Cầm Âm Địch",
      "Thanh Loan Hỏa Phượng Vũ Phiến",
      "Thúy Ảnh Truy Hồn Kiếm",
      "Thảo Mộc Giai Binh Phù",
      "Bích Tuyền Linh Tuyền Hồ",
    ];
    const names_c = [
      "Bích Ba Thần Châu",
      "Băng Phách Hàn Ngọc Hồ",
      "Thâm Hải Long Tức Châu",
      "Thương Khung Lam Linh Châu",
      "Giao Nhân Chức Mộng Đăng",
      "Ngân Hà Lạc Sương Bình",
      "Lam Ngọc Băng Tâm Kính",
      "Hàn Băng Tịnh Thế Liên",
      "Bích Ba U Lan Địch",
      "Thâm Hải Long Ngâm Bội",
    ];
    const names_d = [
      "Tử Tiêu Thần Lôi Châu",
      "U Minh Tử Điệp Dực",
      "Tinh Hà Tử Ngọc Hồ",
      "Tử Ngọc Băng Tâm Kính",
      "Tử Diệm Phượng Hoàng Linh",
      "Thương Khung Tử Lôi Đỉnh",
      "Tử Liên U Quang Luân",
      "Tử Tinh Phá Hiểu Cầm",
      "U Minh Tử Ảnh Phiên",
      "Tử Tiêu Lăng Hư Ấn",
    ];
    const names_e = [
      "Kim Giao Tiễn",
      "Càn Khôn Quyển",
      "Hoàng Kim Linh Lung Tháp",
      "Mậu Kỷ Hạnh Hoàng Kỳ",
      "Hiên Viên Hoàng Đế Đỉnh",
      "Trấn Yêu Phục Ma Kính",
      "Lạc Nhật Dung Kim Luân",
      "Vạn Thọ Vô Cương Hồ Lô",
      "Kim Sí Đại Bằng Vũ Phiến",
      "Địa Hoàng Huyền Ngọc Châu",
    ];
    const names_f = [
      "Xích Diệm Linh Châu Trận Đồ",
      "Hỏa Phượng Niết Bàn Lô Đỉnh",
      "Hồng Liên Nghiệp Hỏa Tịnh Thế Bi",
      "Huyết Ngọc Luân Hồi Bàn",
      "Chu Tước Tường Thiên Dực",
      "Liệt Diệm Phần Thiên Lô",
      "Đan Tiêu Hỏa Vực Đồ",
      "Xích Long Luyện Hồn Châu",
      "Hỏa Linh Xích Tâm Kính",
      "Cửu Chuyển Viêm Linh Tế Đàn",
    ];
    return this.drawPrize(
      lv,
      "sutra",
      names_a,
      names_b,
      names_c,
      names_d,
      names_e,
      names_f,
      isNewbie
    );
  },
  equip_Attack(lv) {
    return this.getRandomInt(10, 50) * lv;
  },
  equip_Health(lv) {
    return this.getRandomInt(100, 500) * lv;
  },
  equip_Criticalhitrate() {
    return this.getRandomFloatInRange(0.01, 0.05);
  },
  // equip_Defense(lv, isNewbie = true) {
  //     if (lv >= 1 && lv <= 5) {
  //         return this.getRandomInt(15, 150) * lv;
  //     } else if (lv >= 6 && lv <= 10) {
  //         return this.getRandomInt(150, 300) * lv;
  //     } else {
  //         return this.getRandomInt(300, 500) * lv;
  //     }
  // },
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
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
      dodge * weights.dodgeRate * 100 +
      attack * weights.attack +
      (health / 100) * weights.health +
      defense * weights.defense +
      critical * weights.critRate * 100;
    return Math.floor(score);
  },
};
export default equips;
