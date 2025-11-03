import { GameState } from '~/server/models/GameState'

/**
 * Check if game state exists for the current user
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

    // Check if game state exists
    const gameState = await GameState.findOne({ userId })

    return {
      exists: !!gameState,
      userId,
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Check game state error:', error)
    throw createError({
      statusCode: 500,
      message: 'Đã xảy ra lỗi khi kiểm tra game state',
    })
  }
})
