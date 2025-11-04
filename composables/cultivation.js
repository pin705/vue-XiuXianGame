export const CULTIVATION_PATHS = {
  "Kiếm Tu": {
    name: "Kiếm Tu",
    description:
      "Lấy kiếm nhập đạo, một kiếm phá vạn pháp, tung hoành thiên hạ với kiếm khí sắc bén.",
    bonuses: {
      attackPower: 0.25, // +25% sức mạnh công kích
      defensePower: 0.1, // +10% sức mạnh phòng thủ
      criticalChance: 0.1, // +10% tỷ lệ bạo kích
      dodgeChance: 0.05, // +5% tỷ lệ né tránh
      manaGainRate: 0,
      craftingSuccessRate: 0,
    },
    skills: [
      {
        id: 1,
        name: "Vân Kiếm Phi Hồng",
        level: 1,
        description:
          "Hóa kiếm khí thành cầu vồng, chém xuống gây 60% sát thương, có 20% cơ hội gây thêm 20% sát thương phụ.",
        cost: 20, // Linh khí tiêu tốn
        damage: 0.6, // + 60%
        cooldown: 0,
        extraDamage: { chance: 0.2, value: 0.2 },
      },
      {
        id: 2,
        name: "Kiếm Ý Vô Thường",
        level: 0,
        description:
          "Triệu hồi kiếm ý hộ thể, tăng 30% sức mạnh phòng thủ trong 3 lượt, đồng thời phản lại 10% sát thương nhận được.",
        cost: 30,
        cooldown: 3,
        effect: { defensePower: 30, reflectDamage: 10, duration: 3 },
      },
      {
        id: 3,
        name: "Thiên Kiếm Vạn Lý",
        level: 0,
        description:
          "Thả vạn kiếm quang, gây 120% sát thương diện rộng, đánh tan mọi kẻ thù trong khoảnh khắc.",
        cost: 60,
        damage: 1.20, // + 120%
        aoe: true,
        cooldown: 5,
      },
    ],
    artifacts: [
      {
        id: 1,
        name: "Thanh Vân Kiếm",
        type: "weapon",
        level: 1,
        description:
          "Kiếm sắc như mây trời, tăng 15% sức mạnh công kích và 5% tỷ lệ bạo kích.",
        bonus: { attackPower: 15, criticalChance: 5 },
      },
      {
        id: 2,
        name: "Huyền Thiên Thần Kiếm",
        type: "weapon",
        level: 0,
        description:
          "Thần kiếm ẩn chứa thiên uy, tăng 25% sức mạnh công kích và 10% tốc độ thu thập linh khí.",
        bonus: { attackPower: 25, manaGainRate: 10 },
      },
    ],
    levelUpRewards: {
      2: { skill: "Kiếm Ý Vô Thường", artifact: null },
      5: { skill: "Thiên Kiếm Vạn Lý", artifact: "Huyền Thiên Thần Kiếm" },
    },
    expPerLevel: [100, 200, 300, 500, 800, 1200, 2000],
  },
  // "Đan Tu": {
  //   name: "Đan Tu",
  //   description:
  //     "Thông thạo đan đạo, luyện linh đan diệu dược, hóa giải sinh tử, trợ đạo trường sinh.",
  //   bonuses: {
  //     attackPower: 0,
  //     defensePower: 0,
  //     criticalChance: 0,
  //     dodgeChance: 0,
  //     manaGainRate: 0.2, // +20% tốc độ thu thập linh khí
  //     craftingSuccessRate: 0.35, // +35% tỷ lệ luyện đan
  //   },
  //   skills: [
  //     {
  //       id: 1,
  //       name: "Huyền Đan Tâm Pháp",
  //       level: 1,
  //       description:
  //         "Tinh luyện linh dược, tăng 25% tỷ lệ luyện đan thành công và 10% chất lượng đan dược.",
  //       cost: 15,
  //       cooldown: 0,
  //       effect: { craftingSuccessRate: 0.25, craftingQuality: 0.1 },
  //     },
  //     {
  //       id: 2,
  //       name: "Liệt Hỏa Đan Chưởng",
  //       level: 0,
  //       description:
  //         "Dẫn hỏa diệm từ đan lô, phóng ra chưởng lực thiêu đốt, gây 50% sát thương và 10% sát thương thiêu đốt mỗi lượt trong 2 lượt.",
  //       cost: 25,
  //       damage: 0.5, // + 50%
  //       cooldown: 3,
  //       effect: { burn: 0.1, duration: 2 },
  //     },
  //     {
  //       id: 3,
  //       name: "Tụ Linh Thiên Đan",
  //       level: 0,
  //       description:
  //         "Luyện chế linh đan dẫn động thiên địa linh khí, tăng 60% hồi phục năng lượng trong 5 phút.",
  //       cost: 50,
  //       cooldown: 5,
  //       effect: { manaGainRate: 0.6, duration: 300 },
  //     },
  //   ],
  //   artifacts: [
  //     {
  //       id: 1,
  //       name: "Thiên Hỏa Đan Lô",
  //       type: "accessory",
  //       level: 1,
  //       description:
  //         "Đan lô cổ xưa, tăng 20% tỷ lệ luyện đan và 10% tốc độ thu thập linh khí.",
  //       bonus: { craftingSuccessRate: 20, manaGainRate: 10 },
  //     },
  //     {
  //       id: 2,
  //       name: "Ngọc Linh Đan Đỉnh",
  //       type: "accessory",
  //       level: 0,
  //       description:
  //         "Đỉnh ngọc hội tụ linh khí, tăng 30% tỷ lệ luyện đan và 15% chất lượng đan dược.",
  //       bonus: { craftingSuccessRate: 30, craftingQuality: 15 },
  //     },
  //   ],
  //   levelUpRewards: {
  //     2: { skill: "Liệt Hỏa Đan Chưởng", artifact: null },
  //     5: { skill: "Tụ Linh Thiên Đan", artifact: "Ngọc Linh Đan Đỉnh" },
  //   },
  //   expPerLevel: [100, 200, 300, 500, 800, 1200, 2000],
  // },
  "Phù Tu": {
    name: "Phù Tu",
    description:
      "Nắm giữ phù đạo, khắc linh văn thông thiên, hóa giải vạn pháp bằng một đạo phù chú.",
    bonuses: {
      attackPower: 0.15, // +15% sức mạnh công kích
      defensePower: 0.05, // +5% sức mạnh phòng thủ
      criticalChance: 0.05, // +5% tỷ lệ bạo kích
      dodgeChance: 0.05, // +5% tỷ lệ né tránh
      manaGainRate: 0,
      craftingSuccessRate: 0.25, // +25% tỷ lệ chế phù
    },
    skills: [
      {
        id: 1,
        name: "Lôi Đình Vạn Quân",
        level: 1,
        description:
          "Kích hoạt phù chú sấm sét, gây 55% sát thương, có 15% cơ hội làm tê liệt kẻ thù 1 lượt.",
        cost: 20,
        damage: 0.55, // + 55%
        cooldown: 0,
        effect: { paralyzeChance: 0.15, duration: 1 },
      },
      {
        id: 2,
        name: "Huyền Quang Phù Trận",
        level: 0,
        description:
          "Triệu hồi phù trận bảo hộ, tăng 25% sức mạnh phòng thủ và 10% né tránh trong 3 lượt.",
        cost: 30,
        cooldown: 3,
        effect: { defensePower: 0.25, dodgeChance: 0.1, duration: 3 },
      },
      {
        id: 3,
        name: "Hỏa Long Phù Chú",
        level: 0,
        description:
          "Thả hỏa long từ phù chú, gây 80% sát thương và thiêu đốt 15 sát thương mỗi lượt trong 2 lượt.",
        cost: 40,
        damage: 0.8, // + 80%
        cooldown: 5,
        effect: { burn: 0.15, duration: 2 },
      },
    ],
    artifacts: [
      {
        id: 1,
        name: "Thiên Phù Linh Bút",
        type: "accessory",
        level: 1,
        description:
          "Bút phù dẫn đạo linh khí, tăng 15% sinh lực và 5% công kích.",
        bonus: { maxHealth: 0.15, attackPower: 5 },
      },
      {
        id: 2,
        name: "Ngọc Phù Thiên Kính",
        type: "accessory",
        level: 0,
        description:
          "Gương ngọc phản chiếu vạn pháp, tăng 20% sức mạnh công kích",
        bonus: { attackPower: 0.2 },
      },
    ],
    levelUpRewards: {
      2: { skill: "Huyền Quang Phù Trận", artifact: null },
      5: { skill: "Hỏa Long Phù Chú", artifact: "Ngọc Phù Thiên Kính" },
    },
    expPerLevel: [100, 200, 300, 500, 800, 1200, 2000],
  },
  "Thể Tu": {
    name: "Thể Tu",
    description:
      "Rèn thân như cương thép, phá sơn đoạn nhạc, một quyền định càn khôn.",
    bonuses: {
      attackPower: 0.15, // +15% sức mạnh công kích
      defensePower: 0.3, // +30% sức mạnh phòng thủ
      criticalChance: 0,
      dodgeChance: 0,
      manaGainRate: 0,
      craftingSuccessRate: 0,
    },
    skills: [
      {
        id: 1,
        name: "Cương Thể Hộ Nguyên",
        level: 1,
        description:
          "Luyện thân thành cương, tăng 25% sức mạnh phòng thủ và hồi 10% khí huyết mỗi lượt trong 3 lượt.",
        cost: 20,
        cooldown: 3,
        effect: { defensePower: 0.25, heal: 0.1, duration: 3 },
      },
      {
        id: 2,
        name: "Phá Sơn Thần Quyền",
        level: 0,
        description:
          "Tích tụ lực lượng, tung quyền phá núi, gây 65% sát thương, có 10% cơ hội làm choáng kẻ thù 1 lượt.",
        cost: 25,
        damage: 0.65, // 65%
        cooldown: 3,
        effect: { stunChance: 0.1, duration: 1 },
      },
      {
        id: 3,
        name: "Kim Cương Bất Hoại",
        level: 0,
        description:
          "Hóa thân bất hoại, tăng 50% sức mạnh phòng thủ và 20% công kích trong 3 lượt.",
        cost: 50,
        cooldown: 5,
        effect: { defensePower: 0.5, attackPower: 0.2, duration: 3 },
      },
    ],
    artifacts: [
      {
        id: 1,
        name: "Huyền Vũ Thần Giáp",
        type: "armor",
        level: 1,
        description:
          "Giáp rùa thần bảo vệ, tăng 20% sức mạnh phòng thủ và 5% khí huyết tối đa.",
        bonus: { defensePower: 0.2, maxHealth: 0.05 },
      },
      {
        id: 2,
        name: "Long Cốt Thần Quyền",
        type: "weapon",
        level: 0,
        description:
          "Quyền sáo luyện từ long cốt, tăng 25% sức mạnh công kích và 10% tỷ lệ bạo kích.",
        bonus: { attackPower: 0.25, criticalChance: 0.1 },
      },
    ],
    levelUpRewards: {
      2: { skill: "Phá Sơn Thần Quyền", artifact: null },
      5: { skill: "Kim Cương Bất Hoại", artifact: "Long Cốt Thần Quyền" },
    },
    expPerLevel: [100, 200, 300, 500, 800, 1200, 2000],
  },
  "Ma Tu": {
    name: "Ma Tu",
    description:
      "Nhập ma đạo, lấy huyết khí luyện thần thông, tung hoành vô kỵ nhưng nguy cơ phản phệ.",
    bonuses: {
      attackPower: 0.35, // +35% sức mạnh công kích
      defensePower: -0.1, // -10% sức mạnh phòng thủ
      criticalChance: 0.15, // +15% tỷ lệ bạo kích
      dodgeChance: 0,
      manaGainRate: 0, // -15% tốc độ thu thập linh khí
      craftingSuccessRate: 0,
    },
    skills: [
      {
        id: 1,
        name: "Huyết Ma Thiên Chưởng",
        level: 1,
        description:
          "Hóa huyết khí thành chưởng, gây 70% sát thương, mất 10% khí huyết bản thân nhưng tăng 10% bạo kích lượt sau.",
        cost: 25,
        damage: 0.7,
        cooldown: 0,
        effect: { criticalChance: 0.1, selfDamage: 0.1, duration: 1 },
      },
      {
        id: 2,
        name: "Ma Hồn Đoạt Linh",
        level: 0,
        description:
          "Hút 40 linh khí từ kẻ thù, có 20% cơ hội làm suy yếu kẻ thù, giảm 15% công kích của chúng trong 2 lượt.",
        cost: 35,
        cooldown: 2,
        effect: {
          stealCultivation: 0.4,
          weakenChance: 0.2,
          weakenAttack: 0.15,
          duration: 2,
        },
      },
      {
        id: 3,
        name: "Hắc Ma Vô Thượng",
        level: 0,
        description:
          "Triệu hồi ma thần, gây 150% sát thương diện rộng, nhưng có 25% nguy cơ phản phệ, mất 20% khí huyết.",
        cost: 70,
        damage: 1.50,
        aoe: true,
        backlashChance: 0.25,
        backlashDamage: 0.2,
        cooldown: 3,
      },
    ],
    artifacts: [
      {
        id: 1,
        name: "Huyết Ma Thần Châu",
        type: "accessory",
        level: 1,
        description:
          "Châu ma ngưng tụ huyết khí, tăng 15% sức mạnh công kích và 5% tỷ lệ bạo kích.",
        bonus: { attackPower: 0.15, criticalChance: 0.05 },
      },
      {
        id: 2,
        name: "Vô Thượng Ma Ấn",
        type: "accessory",
        level: 0,
        description:
          "Ấn ma chứa sức mạnh hủy diệt, tăng 30% sức mạnh công kích nhưng giảm 10% phòng thủ.",
        bonus: { attackPower: 0.3, defensePower: -0.1 },
      },
    ],
    levelUpRewards: {
      2: { skill: "Ma Hồn Đoạt Linh", artifact: null },
      5: { skill: "Hắc Ma Vô Thượng", artifact: "Vô Thượng Ma Ấn" },
    },
    expPerLevel: [100, 200, 300, 500, 800, 1200, 2000],
  },
};

export class CultivationPath {
  constructor(player) {
    this.player = player;
  }

  // Hàm áp dụng bonuses
  applyBonuses() {
    const {
      attackPower,
      defensePower,
      criticalChance,
      dodgeChance,
      craftingSuccessRate,
      manaGainRate,
    } = this.player.cultivationPath.bonuses;

    // Lưu bonuses đã áp dụng
    this.player.cultivationPath.appliedBonuses = {
      attackPower,
      defensePower,
      criticalChance,
      dodgeChance,
      craftingSuccessRate,
      manaGainRate,
    };

    // Áp dụng bonuses vào player
    this.player.attack *= 1 + attackPower;
    this.player.defense *= 1 + defensePower;
    this.player.critical += criticalChance;
    this.player.dodge += dodgeChance;
    this.player.manaGainRate += manaGainRate;
    this.player.craftingSuccessRate += craftingSuccessRate;

    // Đảm bảo không âm
    this.player.attack = Math.max(0, this.player.attack);
    this.player.defense = Math.max(0, this.player.defense);
    this.player.critical = Math.max(0, this.player.critical);
    this.player.dodge = Math.max(0, this.player.dodge);
    this.player.craftingSuccessRate = Math.max(
      0,
      this.player.craftingSuccessRate
    );
    this.player.manaGainRate = Math.max(0, this.player.manaGainRate);
  }

  // Hàm xóa bonuses đã áp dụng
  removeApplyBonuses() {
    const {
      attackPower,
      defensePower,
      criticalChance,
      dodgeChance,
      manaGainRate,
      craftingSuccessRate,
    } = this.player.cultivationPath.appliedBonuses;

    // Đảo ngược bonuses
    if (attackPower) this.player.attack /= 1 + attackPower;
    if (defensePower) this.player.defense /= 1 + defensePower;
    this.player.critical -= criticalChance;
    this.player.dodge -= dodgeChance;
    this.player.manaGainRate += manaGainRate;
    this.player.craftingSuccessRate += craftingSuccessRate;

    // Đảm bảo không âm
    this.player.attack = Math.max(0, this.player.attack);
    this.player.defense = Math.max(0, this.player.defense);
    this.player.critical = Math.max(0, this.player.critical);
    this.player.dodge = Math.max(0, this.player.dodge);
    this.player.craftingSuccessRate = Math.max(
      0,
      this.player.craftingSuccessRate
    );
    this.player.manaGainRate = Math.max(0, this.player.manaGainRate);

    // Reset appliedBonuses
    this.player.cultivationPath.appliedBonuses = {
      attackPower: 0,
      defensePower: 0,
      criticalChance: 0,
      dodgeChance: 0,
      craftingSuccessRate: 0,
      manaGainRate: 0,
    };
  }

  choosePath(path) {
    const pathData = CULTIVATION_PATHS[path];
    this.player.cultivationPath = {
      path,
      pathLevel: 1,
      pathExp: 0,
      maxPathExp: pathData.expPerLevel[0],
      skills: pathData.skills.filter((s) => s.level > 0),
      artifacts: pathData.artifacts.filter((a) => a.level > 0),
      bonuses: { ...pathData.bonuses },
    };
    // Tích hợp pháp bảo vào equipment
    const artifact = this.player.cultivationPath.artifacts[0];
    if (artifact) {
      this.player.equipment[artifact.type] = artifact;
    }

    this.applyBonuses();
  }
}
