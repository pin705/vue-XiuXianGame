export default {
  // Tính toán sát thương
  calculateDamage(attacker, defender) {
    // Tính sát thương cơ bản
    let damage = Math.max(0, Math.floor(attacker.attack - defender.defense));
    damage = damage <= 1 ? 1 : damage; // Sát thương tối thiểu là 1
    // Xác định né tránh
    const isHit = Math.random() > defender.dodge;
    if (!isHit) return { damage: 0, isCritical: false, isHit: false };
    // Xác định bạo kích
    let isCritical = false;
    if (Math.random() < attacker.critical) {
      damage *= 1.5;
      isCritical = true;
    }
    // Trả về kết quả tính toán, bao gồm giá trị sát thương, trạng thái bạo kích và trạng thái trúng
    return { damage, isCritical, isHit: true };
  },
  // Thực hiện một hiệp chiến đấu
  executeCombatRound(attacker, defender) {
    const attackResult = this.calculateDamage(attacker, defender);
    if (attackResult.isHit)
      defender.health = Math.max(0, defender.health - attackResult.damage);
    // Trả về kết quả của hiệp tấn công này, bao gồm giá trị sát thương, trạng thái bạo kích, trạng thái trúng và lượng khí huyết còn lại của mục tiêu
    return {
      damage: attackResult.damage,
      isCritical: attackResult.isCritical,
      isHit: attackResult.isHit,
      remainingHealth: defender.health,
    };
  },
};
