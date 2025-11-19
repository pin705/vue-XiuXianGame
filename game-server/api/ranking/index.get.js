import { connectDB } from '../../utils/db';
import Player from '../../models/Player';
import { defineEventHandler, createError, getQuery } from 'nitro/h3'

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    
    const query = getQuery(event);
    const { sortBy = 'score', limit = 100 } = query;

    let sortOptions = {};
    
    switch (sortBy) {
      case 'level':
        sortOptions = { level: -1, cultivation: -1 };
        break;
      case 'score':
        sortOptions = { score: -1, level: -1 };
        break;
      case 'reincarnation':
        sortOptions = { reincarnation: -1, level: -1 };
        break;
      default:
        sortOptions = { score: -1 };
    }

    const players = await Player.find()
      .select('name level score reincarnation attack defense cultivationPath.path userId')
      .sort(sortOptions)
      .limit(parseInt(limit))
      .populate('userId', 'username');

    const ranking = players.map((player, index) => ({
      rank: index + 1,
      name: player.name,
      username: player.userId?.username || 'Unknown',
      level: player.level,
      score: player.score,
      reincarnation: player.reincarnation,
      attack: player.attack,
      defense: player.defense,
      path: player.cultivationPath?.path || 'Chưa chọn'
    }));

    return {
      success: true,
      data: {
        ranking,
        total: ranking.length
      }
    };
  } catch (error) {
    console.error('Ranking error:', error);
    throw createError({
      statusCode: 500,
      message: 'Lỗi server'
    });
  }
});
