const monsters = {
  monster_Names(lv) {
    const names_a = [
      "Ảnh Mị Ly Nô",
      "U Cốc Linh Xà",
      "Vụ Ẩn Hồ Tiên",
      "Tùng Gian Linh Hầu",
      "Nguyệt Ảnh Phức Yêu",
      "Sơn Giản Giao Đồng",
      "Lâm Giản Lộc Linh",
      "Nham Khích Thạch Tinh",
      "Phong Minh Hạc Quái",
      "Thúy Trúc Oa Tiên",
    ];
    const names_b = [
      "Thanh Long Khiếu Thiên",
      "Bạch Hổ Phá Hiểu",
      "Chu Tước Phần Dực",
      "Huyền Vũ Trấn Hải",
      "Kỳ Lân Đạp Thụy",
      "Phượng Hoàng Niết Bàn",
      "Tất Phương Xích Diệm",
      "Tì Hưu Thôn Kim",
      "Bạch Trạch Tri Thế",
      "Toan Nghê Ngự Hỏa",
    ];
    const names_c = [
      "Phục Hy Thiên Đế",
      "Nữ Oa Thánh Mẫu",
      "Hạo Thiên Ngọc Hoàng",
      "Thái Thượng Lão Quân",
      "Đông Hoa Đế Quân",
      "Tây Vương Mẫu Hậu",
      "Thần Nông Viêm Đế",
      "Hiên Viên Hoàng Đế",
      "Diêu Cơ Tiên Tử",
      "Chân Vũ Đại Đế",
    ];
    const names_d = [
      "Hỗn Độn Thủy Nguyên Tôn",
      "Càn Khôn Tạo Vật Chủ",
      "Vũ Trụ Sáng Tạo Thần",
      "Vạn Linh Thủy Tổ Hoàng",
      "Hồng Mông Sáng Thế Giả",
      "Vô Cực Tạo Hóa Quân",
      "Thái Hư Diễn Hóa Thần",
      "Nguyên Thủy Thiên Tôn Tổ",
      "Hư Không Tạo Vật Thánh",
      "Giới Vực Khai Tích Giả",
    ];
    if (lv >= 1 && lv <= 19) {
      return names_a[Math.floor(Math.random() * names_a.length)];
    } else if (lv >= 20 && lv <= 49) {
      return names_b[Math.floor(Math.random() * names_b.length)];
    } else if (lv >= 50 && lv <= 100) {
      return names_c[Math.floor(Math.random() * names_c.length)];
    } else {
      return names_d[Math.floor(Math.random() * names_d.length)]; // Sửa lỗi từ names_c thành names_d
    }
  },
  // Tính công kích của quái vật
  monster_Attack(lv) {
    if (lv <= 144) {
      return this.getRandomInt(50, 150) * lv;
    } else {
      return this.getRandomInt(10000, 50000) * lv;
    }
  },
  // Tính khí huyết của quái vật
  monster_Health(lv) {
    if (lv <= 144) {
      return this.getRandomInt(100, 500) * lv;
    } else {
      return this.getRandomInt(10000, 50000) * lv;
    }
  },
  // Tính phòng thủ của quái vật
  monster_Defense(lv) {
    if (lv <= 144) {
      return this.getRandomInt(1, 15) * lv;
    } else {
      return this.getRandomInt(500, 1000) * lv;
    }
  },
  // Tính tỷ lệ bạo kích của quái vật
  monster_Criticalhitrate(lv) {
    if (lv <= 144) {
      return this.getRandomFloatInRange(0.001, 0.01);
    } else {
      return this.getRandomFloatInRange(0.1, 0.75);
    }
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
};
export default monsters;
