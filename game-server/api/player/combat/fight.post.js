import { connectDB } from '../../../utils/db';
import Player from '../../../models/Player';
import { requireAuth } from '../../../utils/auth';
import { defineEventHandler, readBody, createError } from "nitro/h3";

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    
    const userId = await requireAuth(event);
    const body = await readBody(event);
    const { monsterId, monsterData } = body;

    const player = await Player.findOne({ userId });

    if (!player) {
      throw createError({
        statusCode: 404,
        message: 'Không tìm thấy dữ liệu người chơi'
      });
    }

    // Logic chiến đấu
    const combatResult = processCombat(player, monsterData);

    if (combatResult.victory) {
      // Thắng - tăng tu vi và phần thưởng
      player.cultivation += combatResult.rewards.cultivation;
      player.props.money += combatResult.rewards.money;
      player.score += combatResult.rewards.score;
      
      // Thêm vật phẩm vào túi đồ
      if (combatResult.rewards.items) {
        player.inventory.push(...combatResult.rewards.items);
      }
      
      await player.save();
    }

    return {
      success: true,
      data: {
        result: combatResult,
        player
      }
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    
    console.error('Combat error:', error);
    throw createError({
      statusCode: 500,
      message: 'Lỗi server'
    });
  }
});

// Logic chiến đấu
function processCombat(player, monster) {
  const combatLog = [];
  let playerHealth = player.health;
  let monsterHealth = monster.health;
  let round = 0;

  while (playerHealth > 0 && monsterHealth > 0 && round < 100) {
    round++;
    
    // Player attack
    const playerDamage = calculateDamage(
      { attack: player.attack, critical: player.critical / 100 },
      { defense: monster.defense, dodge: monster.dodge / 100 }
    );
    
    if (playerDamage.isHit) {
      monsterHealth -= playerDamage.damage;
      combatLog.push({
        round,
        attacker: 'player',
        damage: playerDamage.damage,
        isCritical: playerDamage.isCritical
      });
    }

    if (monsterHealth <= 0) break;

    // Monster attack
    const monsterDamage = calculateDamage(
      { attack: monster.attack, critical: monster.critical / 100 },
      { defense: player.defense, dodge: player.dodge / 100 }
    );
    
    if (monsterDamage.isHit) {
      playerHealth -= monsterDamage.damage;
      combatLog.push({
        round,
        attacker: 'monster',
        damage: monsterDamage.damage,
        isCritical: monsterDamage.isCritical
      });
    }
  }

  const victory = monsterHealth <= 0;
  
  return {
    victory,
    combatLog,
    rewards: victory ? calculateRewards(monster, player.level) : null
  };
}

function calculateDamage(attacker, defender) {
  const isHit = Math.random() > defender.dodge;
  if (!isHit) return { damage: 0, isCritical: false, isHit: false };
  
  let damage = Math.max(1, attacker.attack - defender.defense);
  let isCritical = false;
  
  if (Math.random() < attacker.critical) {
    damage *= 1.5;
    isCritical = true;
  }
  
  return { damage: Math.floor(damage), isCritical, isHit: true };
}

function calculateRewards(monster, playerLevel) {
  return {
    cultivation: Math.floor(monster.health * 0.1),
    money: Math.floor(monster.attack * 5),
    score: Math.floor((monster.health + monster.attack) * 0.5),
    items: []
  };
}
