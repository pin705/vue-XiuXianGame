import { GameState } from '~/server/models/GameState'
import { createInitialGameState } from '~/server/utils/gameState'

/**
 * Create or reset game state for the current user
 */
export default defineEventHandler(async (event) => {
  try {
    // Check authentication
    const session = await getUserSession(event)
    if (!session || !session.user) {
      throw createError({
        statusCode: 401,
        message: 'Vui lòng đăng nhập',
      })
    }

    const userId = session.user.id
    const username = session.user.username || 'Người chơi'

    // Check if game state already exists
    const existingGameState = await GameState.findOne({ userId })

    if (existingGameState) {
      throw createError({
        statusCode: 409,
        message: 'Game state đã tồn tại. Sử dụng endpoint reset nếu muốn tạo lại.',
      })
    }

    // Create new game state
    const gameState = await GameState.create(
      createInitialGameState(userId, username)
    )

    return {
      success: true,
      message: 'Tạo game state thành công',
      player: gameState.player,
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Create game state error:', error)
    throw createError({
      statusCode: 500,
      message: 'Đã xảy ra lỗi khi tạo game state',
    })
  }
})
