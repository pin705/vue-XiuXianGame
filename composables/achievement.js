const achievement = {
    // Tất cả thành tựu
    all() {
      return [
        {
          name: "Thành tựu linh thú",
          type: "pet",
          data: this.pet(),
        },
        {
          name: "Thành tựu thám hiểm",
          type: "monster",
          data: this.monster(),
        },
        {
          name: "Thành tựu trang bị",
          type: "equipment",
          data: this.equipment(),
        },
      ];
    },
    // Thành tựu liên quan đến linh thú
    pet() {
      return [
        {
          // ID thành tựu
          id: 1,
          // Tên thành tựu
          name: "Thần thú khí huyết",
          // Phần thưởng thành tựu
          award: 1000,
          // Bonus khi đeo danh hiệu
          titleBonus: {
            health: 5000,
          },
          // Điều kiện đạt được
          condition: {
            dodge: 0,
            health: 23500,
            attack: 0,
            defense: 0,
            critical: 0,
          },
        },
        {
          id: 2,
          name: "Thần thú tấn công",
          award: 1000,
          titleBonus: {
            attack: 1000,
          },
          condition: {
            dodge: 0,
            health: 0,
            attack: 7050,
            defense: 0,
            critical: 0,
          },
        },
        {
          id: 3,
          name: "Thần thú phòng thủ",
          award: 1000,
          titleBonus: {
            defense: 100,
          },
          condition: {
            dodge: 0,
            health: 0,
            attack: 0,
            defense: 705,
            critical: 0,
          },
        },
        {
          id: 4,
          name: "Thần thú né tránh",
          award: 1000,
          titleBonus: {
            dodge: 0.1,
          },
          condition: {
            dodge: 0.47,
            health: 0,
            attack: 0,
            defense: 0,
            critical: 0,
          },
        },
        {
          id: 5,
          name: "Thần thú chí mạng",
          award: 1000,
          titleBonus: {
            critical: 0.1,
          },
          condition: {
            dodge: 0,
            health: 0,
            attack: 0,
            defense: 0,
            critical: 0.47,
          },
        },
        {
          id: 6,
          name: "Đỉnh cao linh thú",
          titleBonus: {
            attack: 2500,
          },
          award: 10000,
          condition: {
            dodge: 0.47,
            health: 23500,
            attack: 7050,
            defense: 705,
            critical: 0.47,
          },
        },
      ];
    },
    // Thành tựu liên quan đến trang bị
    equipment() {
      return [];
    },
    // Thành tựu liên quan đến đánh quái
    monster() {
      return [
        {
          id: 7,
          name: "Người thách thức",
          desc: "Thông quan Tháp Vô Tận tầng 100",
          titleBonus: {
            critical: 0.05,
          },
          award: 10000,
          condition: {
            highestTowerFloor: 100,
          },
        },
        {
          id: 8,
          name: "Kẻ chinh phục",
          desc: "Thông quan Tháp Vô Tận tầng 1000",
          titleBonus: {
            critical: 0.1,
          },
          award: 10000,
          condition: {
            highestTowerFloor: 1000,
          },
        },
        {
          id: 8,
          name: "Trường sinh giả",
          desc: "Tuổi thọ đạt 1000 năm",
          titleBonus: {
            health: 10000,
          },
          award: 10000,
          condition: {
            age: 1000,
          },
        },
        {
          id: 9,
          name: "Ngôi sao may mắn",
          desc: "Chiến thắng mini game hơn 10 lần",
          titleBonus: {
            defense: 0.01,
          },
          award: 10000,
          condition: {
            gameWins: 10,
          },
        },
        {
          id: 10,
          name: "Con trời",
          desc: "Chiến thắng mini game hơn 100 lần",
          titleBonus: {
            defense: 0.1,
          },
          award: 10000,
          condition: {
            gameWins: 100,
          },
        },
      ];
    },
  };
  
  export default achievement;
