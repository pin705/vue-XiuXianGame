const All = {
  drawPrize(lv) {
    const types = [
      { type: "weapon", data: this.equipWeapons() },
      { type: "armor", data: this.equipArmors() },
      { type: "accessory", data: this.equipAccessories() },
      { type: "sutra", data: this.equipSutras() },
    ];
    const prize = {
      info: 50,
      success: 20,
      primary: 15,
      purple: 9,
      warning: 5,
      danger: 1,
      pink: 0,
    };
    const genre = {
      sutra: "Pháp bảo",
      armor: "Giáp",
      weapon: "Vũ khí",
      accessory: "Linh bảo",
    };
    const quality = Object.keys(prize);
    const getAttribute = (type, lv, attribute, quality) => {
      // Điều chỉnh giá trị thuộc tính trang bị dựa trên phẩm chất
      const qualityMultiplier = {
        info: 1.2,
        success: 2,
        primary: 3,
        purple: 5,
        warning: 7,
        danger: 10,
        pink: 15,
      };
      const multiplier = qualityMultiplier[quality];
      const Attack = 1000 * lv;
      const Health = 10000 * lv;
      const CriticalHitrate = quality == "pink" ? 0.25 : 0.1;
      const attrs = {
        score: this.calculateEquipmentScore(
          CriticalHitrate,
          Attack,
          Health,
          CriticalHitrate,
          CriticalHitrate
        ),
        dodge: ["accessory", "sutra"].includes(type)
          ? CriticalHitrate * multiplier
          : 0,
        attack: ["weapon", "accessory", "sutra"].includes(type)
          ? Math.floor(Attack * multiplier)
          : 0,
        health: ["armor", "accessory", "sutra"].includes(type)
          ? Math.floor(Health * multiplier)
          : 0,
        defense: ["armor", "accessory", "sutra"].includes(type)
          ? Math.floor(Attack * multiplier)
          : 0,
        critical: ["weapon", "accessory", "sutra"].includes(type)
          ? CriticalHitrate * multiplier
          : 0,
      };
      return attrs[attribute];
    };
    return types.map(({ type, data }) => ({
      type,
      name: genre[type],
      data: data.flatMap((subtype, kk) =>
        subtype.map((name) => ({
          name,
          type,
          level: lv,
          score: getAttribute(type, lv, "score", quality[kk]),
          prize: prize[quality[kk]],
          dodge: getAttribute(type, lv, "dodge", quality[kk]),
          attack: getAttribute(type, lv, "attack", quality[kk]),
          health: getAttribute(type, lv, "health", quality[kk]),
          defense: getAttribute(type, lv, "defense", quality[kk]),
          critical: getAttribute(type, lv, "critical", quality[kk]),
          quality: quality[kk],
        }))
      ),
    }));
  },
  equipWeapons() {
    return [
      [
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
      ],
      [
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
      ],
      [
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
      ],
      [
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
      ],
      [
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
      ],
      [
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
      ],
      [
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
      ],
    ];
  },
  equipArmors() {
    return [
      [
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
      ],
      [
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
      ],
      [
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
      ],
      [
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
      ],
      [
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
      ],
      [
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
      ],
      [
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
      ],
    ];
  },
  equipAccessories() {
    return [
      [
        "Diêu Trì Bạch Ngọc Trâm",
        "Nguyệt Hoa Lưu Quang Trụy",
        "Hàn Sương Ngưng Lộ Liên",
        "Cửu Thiên Huyền Nữ Ngọc Bội",
        "Vân Cẩm Chức Mộng Trạc",
        "Long Diên Nhuận Tuyết Hoàn",
        "Bạch Hạc Hàm Châu Bội",
        "Côn Lôn Tuyết Liên Hoa Liên",
        "Diêu Đài Tiên Lộ Nhĩ Hoàn",
        "Ngân Hà Chức Mộng Hạng Liên",
      ],
      [
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
      ],
      [
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
      ],
      [
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
      ],
      [
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
      ],
      [
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
      ],
      [
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
      ],
    ];
  },
  equipSutras() {
    return [
      [
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
      ],
      [
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
      ],
      [
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
      ],
      [
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
      ],
      [
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
      ],
      [
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
      ],
      [
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
      ],
    ];
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
export default All;
