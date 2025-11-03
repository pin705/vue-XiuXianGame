// Cấu hình ánh xạ thuộc tính
export const statNameMapping = {
  // Thuộc tính cơ bản
  health: 'Máu',
  maxHealth: 'Giới hạn máu',
  attack: 'Sát thương',
  defense: 'Phòng thủ',
  speed: 'Tốc độ',
  // Thuộc tính chiến đấu
  critRate: 'Tỷ lệ chí mạng',
  comboRate: 'Tỷ lệ liên kích',
  counterRate: 'Tỷ lệ phản kích',
  stunRate: 'Tỷ lệ choáng',
  dodgeRate: 'Tỷ lệ né tránh',
  vampireRate: 'Tỷ lệ hút máu',
  // Kháng tính chiến đấu
  critResist: 'Kháng chí mạng',
  comboResist: 'Kháng liên kích',
  counterResist: 'Kháng phản kích',
  stunResist: 'Kháng choáng',
  dodgeResist: 'Kháng né tránh',
  vampireResist: 'Kháng hút máu',
  // Thuộc tính đặc biệt
  healBoost: 'Tăng cường hồi máu',
  critDamageBoost: 'Tăng cường sát thương chí mạng',
  critDamageReduce: 'Giảm sát thương chí mạng',
  finalDamageBoost: 'Tăng sát thương cuối cùng',
  finalDamageReduce: 'Giảm sát thương cuối cùng',
  combatBoost: 'Tăng cường thuộc tính chiến đấu',
  resistanceBoost: 'Tăng cường kháng tính chiến đấu',
  // Thuộc tính khác
  cultivationRate: 'Tốc độ tu luyện',
  spiritRate: 'Tốc độ thu nhận linh lực',
  luck: 'May mắn',
  attackPower: 'Tấn công',
  defensePower: 'Phòng thủ',
  criticalChance: 'Chí mạng',
  dodgeChance: 'Né tránh',
  manaGainRate: 'Thu nhận linh lực',
  craftingSuccessRate: 'Luyện đan',
};

// Lấy tên thuộc tính bằng tiếng Việt
export function getStatName(stat) {
  return statNameMapping[stat] || stat;
}

// Định dạng giá trị thuộc tính (xử lý phần trăm và số nguyên)
export function formatStatValue(stat, value) {
  // Xử lý giá trị null hoặc undefined
  if (value === null || value === undefined) {
    return '0';
  }
  // Các thuộc tính này cần hiển thị dưới dạng phần trăm
  const percentageStats = [
    'critRate', 'comboRate', 'counterRate', 'stunRate', 'dodgeRate', 'vampireRate',
    'critResist', 'comboResist', 'counterResist', 'stunResist', 'dodgeResist', 'vampireResist',
    'healBoost', 'critDamageBoost', 'critDamageReduce', 'finalDamageBoost', 'finalDamageReduce',
    'combatBoost', 'resistanceBoost', 'cultivationRate', 'spiritRate', 'luck',
     'attackPower', 'defensePower', 'criticalChance', 'dodgeChance', 'manaGainRate', 'craftingSuccessRate'
  ];
  if (percentageStats.includes(stat)) {
    return `${(value * 100).toFixed(1)}%`;
  }
  return value.toFixed(1);
}
