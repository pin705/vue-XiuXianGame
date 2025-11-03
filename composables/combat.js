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

export class Combat {
  constructor(attacker, defender) {
    this.attacker = attacker;
    this.defender = defender;
    this.combatLog = [];
    this.effectsApplied = [];
  }

  // Tính toán sát thương
  calculateDamage(attacker, defender, skill = null) {
    let damage = 0;
    let isCritical = false;

    const dodgeChance = (defender.dodge || 0) / 100;
    const isHit = Math.random() > dodgeChance;
    if (!isHit)
      return { damage: 0, isCritical: false, isHit: false, effectsApplied: [] };

    if (skill) {
      damage = Math.max(0, Math.floor(attacker.attack - defender.defense));
      damage = damage <= 1 ? 1 : damage;
      damage *= 1 + skill.damage;
      // const totalAttackPower =
      //   (attacker.cultivationPath?.bonuses?.attackPower || 0) +
      //   (attacker.cultivationPath?.artifacts?.reduce(
      //     (sum, a) => sum + (a.bonus?.attackPower || 0),
      //     0
      //   ) || 0);
      // damage *= 1 + totalAttackPower / 100;

      const criticalChance = attacker.critical;
      if (Math.random() < criticalChance) {
        damage *= 1.5;
        isCritical = true;
      }

      this.setStatusEffect(skill);
    } else {
      damage = Math.max(0, Math.floor(attacker.attack - defender.defense));
      damage = damage <= 1 ? 1 : damage;
      const criticalChance = (attacker.critical || 0) / 100;
      if (Math.random() < criticalChance) {
        damage *= 1.5;
        isCritical = true;
      }
    }

    return {
      damage: Math.floor(damage),
      isCritical,
      isHit: true,
      effectsApplied: this.effectsApplied,
    };
  }

  setStatusEffect(skill) {
    if (skill.effect) {
      console.log("setStatusEffect", skill.effect);
      // for (const refEffect of skill.effect) {
      //   console.log('refEffect', refEffect)
        this.attacker.statusEffects.push({
          type: refEffect[''],
          value: refEffect,
          duration: effect.duration,
        });
      // }

     

      // if (effect.defensePower) {
      //   this.attacker.statusEffects = this.attacker.statusEffects || [];
      //   this.attacker.statusEffects.push({
      //     type: "defensePower",
      //     value: effect.defensePower,
      //     duration: effect.duration,
      //   });
      //   this.effectsApplied.push(
      //     `Tăng ${effect.defensePower}% phòng thủ trong ${effect.duration} lượt`
      //   );
      // }
      // if (effect.reflectDamage) {
      //   this.attacker.statusEffects = this.attacker.statusEffects || [];
      //   this.attacker.statusEffects.push({
      //     type: "reflectDamage",
      //     value: effect.reflectDamage,
      //     duration: effect.duration,
      //   });
      //   this.effectsApplied.push(
      //     `Phản ${effect.reflectDamage}% sát thương trong ${effect.duration} lượt`
      //   );
      // }
      // if (effect.burn) {
      //   this.defender.statusEffects = this.defender.statusEffects || [];
      //   this.defender.statusEffects.push({
      //     type: "burn",
      //     value: effect.burn,
      //     duration: effect.duration,
      //   });
      //   this.effectsApplied.push(
      //     `Gây cháy ${effect.burn} sát thương mỗi lượt trong ${effect.duration} lượt`
      //   );
      // }
      // if (effect.heal) {
      //   this.attacker.health = Math.min(
      //     this.attacker.maxHealth,
      //     this.attacker.health + this.attacker.maxHealth * (effect.heal / 100)
      //   );
      //   // this.effectsApplied.push(`Hồi ${effect.heal}% khí huyết`);
      // }
      // if (effect.criticalChance) {
      //   this.attacker.statusEffects = this.attacker.statusEffects || [];
      //   this.attacker.statusEffects.push({
      //     type: "criticalChance",
      //     value: effect.criticalChance,
      //     duration: effect.duration,
      //   });
      //   // this.effectsApplied.push({
      //   //   message: `Tăng ${effect.criticalChance}% tỷ lệ bạo kích trong ${effect.duration} lượt`,
      //   // });
      // }
    }
  }

  attackStatusEffects() {
    if (!this.attacker.statusEffects?.length) return;

    this.attacker.statusEffects.forEach((effect) => {
      if (effect.duration > 0) {
        effect.duration -= 1; // Giảm thời gian hiệu ứng

        switch (effect.type) {
          case "defensePower":
            break;
          case "reflectDamage":
            break;
          case "burn":
            break;
          case "criticalChance":
        }
      }
    });
  }

  // Thực hiện một hiệp chiến đấu
  executeCombatRound(attacker, defender, skill = null) {
    const logEntry = {
      turn: this.combatLog.length + 1,
      skillName: skill ? skill.name : "Đòn cơ bản",
      messages: [],
      attackerHealth: attacker.health,
      defenderHealth: defender.health,
      attackerMana: attacker.mana,
    };

    // Tăng linh khí
    const manaGainRate =
      (attacker.cultivationPath?.bonuses?.manaGainRate || 0) +
      (attacker.cultivationPath?.artifacts?.reduce(
        (sum, a) => sum + (a.bonus?.manaGainRate || 0),
        0
      ) || 0);

    const manaGain = 10 + 10 * manaGainRate; // 10 + % nhận mana
    attacker.mana += manaGain;
    logEntry.messages.push({
      message: `${attacker.name} Hồi phục ${manaGain.toFixed(1)} năng lượng`,
      time: new Date().toLocaleTimeString(),
    });

    // Giảm hồi chiêu
    if (attacker.cultivationPath?.skills) {
      attacker.cultivationPath.skills.forEach((s) => {
        s.currentCooldown = Math.max(0, (s.currentCooldown || 0) - 1);
      });
    }

    // Xử lý hiệu ứng hiện có
    let effectDamage = 0;
    let effectMessages = [];
    // if (defender.statusEffects?.length) {
    //   defender.statusEffects = defender.statusEffects.filter(
    //     (effect) => effect.duration > 0
    //   );
    //   defender.statusEffects.forEach((effect) => {
    //     if (effect.type === "burn") {
    //       const burnDamage = effect.value;
    //       defender.health = Math.max(0, defender.health - burnDamage);
    //       effectMessages.push({
    //         message: `${attacker.name} Gây ${burnDamage} sát thương cháy`,
    //         time: new Date().toLocaleTimeString()
    //       });
    //       effectDamage += burnDamage;
    //       effect.duration -= 1;
    //     }
    //   });
    // }
    // if (attacker.statusEffects?.length) {
    //   attacker.statusEffects = attacker.statusEffects.filter(
    //     (effect) => effect.duration > 0
    //   );
    //   attacker.statusEffects.forEach((effect) => {
    //     if (effect.type === "defensePower") {
    //       attacker.defense = attacker.defense || 0;
    //       attacker.defense *= 1 + effect.value / 100;
    //       effectMessages.push({
    //         message: `${attacker.name} Tăng ${effect.value}% phòng thủ`
    //       });
    //       effect.duration -= 1;
    //     }
    //     if (effect.type === "reflectDamage" && skill?.damage) {
    //       const reflectDamage = Math.floor(skill.damage * (effect.value / 100));
    //       defender.health = Math.max(0, defender.health - reflectDamage);
    //       effectMessages.push(`Phản ${reflectDamage} sát thương`);
    //       effectDamage += reflectDamage;
    //       effect.duration -= 1;
    //     }
    //   });
    // }

    // Tính toán sát thương
    const attackResult = this.calculateDamage(attacker, defender, skill);
    if (attackResult.isHit) {
      defender.health = Math.max(0, defender.health - attackResult.damage);
      logEntry.messages.push({
        message: `${attacker.name} sử dụng ${logEntry.skillName} Gây ${
          attackResult.damage
        } sát thương${attackResult.isCritical ? " (bạo kích)" : ""}`,
        time: new Date().toLocaleTimeString(),
      });
    } else {
      logEntry.messages.push({
        message: `${attacker.name} sử dụng ${logEntry.skillName} nhung đã bị ${defender.name} né tránh`,
        time: new Date().toLocaleTimeString(),
      });
    }

    // Xử lý sát thương tự chịu và chi phí linh khí
    let selfDamage = 0;
    if (skill) {
      const skillEffect = skill.effect;
      if (skillEffect) {
        if (skillEffect.selfDamage) {
          selfDamage = Math.floor(attacker.maxHealth * (1 + skill.selfDamage));
          attacker.health = Math.max(0, attacker.health - selfDamage);
          logEntry.messages.push({
            message: `${attacker.name} sử dụng kỹ năng ${skill.name} khiến bản thân ự chịu ${selfDamage} sát thương`,
          });
        }
      }
      attacker.mana -= skill.cost || 0;
      skill.currentCooldown = skill.cooldown || 0; // Áp dụng hồi chiêu
    }

    // Thêm hiệu ứng vào log
    // if (attackResult.effectsApplied.length) {
    //   logEntry.messages.push(...attackResult.effectsApplied);
    // }
    // if (effectMessages.length) {
    //   logEntry.messages.push(...effectMessages);
    // }

    // Cập nhật trạng thái
    logEntry.attackerHealth = attacker.health;
    logEntry.defenderHealth = defender.health;
    logEntry.attackerMana = attacker.mana;

    // Lưu log
    // this.combatLog.push(logEntry);

    // Trả về kết quả
    return {
      damage: attackResult.damage, // / trạng thái bạo kích
      isCritical: attackResult.isCritical, // / trạng thái bạo kích
      isHit: attackResult.isHit, // để xác định xem đòn tấn công có trúng hay không
      remainingHealth: defender.health, // cập nhật lượng khí huyết còn lại của mục tiêu
      attackerHealth: attacker.health, //     defenderHealth: defender.health,
      selfDamage,
      effectDamage,
      effectMessages: [...effectMessages, ...attackResult.effectsApplied],
      message: logEntry.messages,
    };
  }

  // Chọn kỹ năng tự động
  selectAutoSkill(attacker) {
    const availableSkills = attacker.cultivationPath?.skills?.filter(
      (skill) =>
        skill.level > 0 &&
        (skill.currentCooldown || 0) === 0 &&
        (attacker.mana || 0) >= (skill.cost || 0)
    );
    if (!availableSkills?.length) return null;
    // Ưu tiên kỹ năng có sát thương cao nhất
    return availableSkills.reduce((best, skill) =>
      (skill.damage || 0) > (best.damage || 0) ? skill : best
    );
  }

  // Thực hiện lượt chiến đấu tự động
  autoCombatRound() {
    const skill = this.selectAutoSkill(this.attacker);
    return this.executeCombatRound(this.attacker, this.defender, skill);
  }

  getCombatLog() {
    return this.combatLog;
  }

  clearCombatLog() {
    this.combatLog = [];
  }
}
