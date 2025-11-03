import { GameState } from '~/server/models/GameState'

/**
 * Main game action endpoint
 * All game actions are routed through this single endpoint
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
    const { action, payload } = await readBody(event)

    if (!action) {
      throw createError({
        statusCode: 400,
        message: 'Action is required',
      })
    }

    // Get user's game state
    let gameState = await GameState.findOne({ userId })
    
    if (!gameState) {
      throw createError({
        statusCode: 404,
        message: 'Game state not found',
      })
    }

    // Handle different actions
    let result
    switch (action) {
      case 'getState':
        result = {
          player: gameState.player,
          boss: gameState.boss,
        }
        break

      case 'cultivate':
        result = await handleCultivate(gameState, payload)
        break

      case 'explore':
        result = await handleExplore(gameState, payload)
        break

      case 'fight':
        result = await handleFight(gameState, payload)
        break

      case 'equipItem':
        result = await handleEquipItem(gameState, payload)
        break

      case 'unequipItem':
        result = await handleUnequipItem(gameState, payload)
        break

      case 'buyItem':
        result = await handleBuyItem(gameState, payload)
        break

      case 'sellItem':
        result = await handleSellItem(gameState, payload)
        break

      case 'useItem':
        result = await handleUseItem(gameState, payload)
        break

      case 'checkin':
        result = await handleCheckin(gameState, payload)
        break

      case 'playMiniGame':
        result = await handleMiniGame(gameState, payload)
        break

      case 'updateSettings':
        result = await handleUpdateSettings(gameState, payload)
        break

      default:
        throw createError({
          statusCode: 400,
          message: `Unknown action: ${action}`,
        })
    }

    // Save the updated game state
    await gameState.save()

    return {
      success: true,
      data: result,
      player: gameState.player,
      boss: gameState.boss,
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Action error:', error)
    throw createError({
      statusCode: 500,
      message: 'Đã xảy ra lỗi khi thực hiện hành động',
    })
  }
})

// Action handlers (to be implemented with actual game logic)

async function handleCultivate(gameState: any, payload: any) {
  // Implement cultivation logic
  const cultivationGain = Math.floor(Math.random() * 10) + 5
  gameState.player.cultivation = Math.min(
    gameState.player.cultivation + cultivationGain,
    gameState.player.maxCultivation
  )

  // Check for level up
  if (gameState.player.cultivation >= gameState.player.maxCultivation) {
    gameState.player.level += 1
    gameState.player.cultivation = 0
    gameState.player.maxCultivation = Math.floor(gameState.player.maxCultivation * 1.5)
    gameState.player.points += 5
    
    return {
      message: 'Đột phá thành công!',
      levelUp: true,
      newLevel: gameState.player.level,
    }
  }

  return {
    message: 'Tu luyện thành công',
    cultivationGain,
  }
}

async function handleExplore(gameState: any, payload: any) {
  // Implement exploration logic
  const discoveries = ['equipment', 'resource', 'monster', 'nothing']
  const discovery = discoveries[Math.floor(Math.random() * discoveries.length)]

  return {
    message: 'Thám hiểm hoàn thành',
    discovery,
  }
}

async function handleFight(gameState: any, payload: any) {
  // Implement combat logic
  const { enemyId } = payload
  
  return {
    message: 'Chiến đấu hoàn thành',
    victory: true,
  }
}

async function handleEquipItem(gameState: any, payload: any) {
  const { itemId, slot } = payload
  
  // Find item in inventory
  const itemIndex = gameState.player.inventory.findIndex((item: any) => item.id === itemId)
  if (itemIndex === -1) {
    throw createError({
      statusCode: 404,
      message: 'Item not found in inventory',
    })
  }

  const item = gameState.player.inventory[itemIndex]
  
  // Unequip current item in slot if exists
  if (gameState.player.equipment[slot] && Object.keys(gameState.player.equipment[slot]).length > 0) {
    gameState.player.inventory.push(gameState.player.equipment[slot])
  }

  // Equip new item
  gameState.player.equipment[slot] = item
  gameState.player.inventory.splice(itemIndex, 1)

  return {
    message: 'Trang bị thành công',
  }
}

async function handleUnequipItem(gameState: any, payload: any) {
  const { slot } = payload
  
  if (!gameState.player.equipment[slot] || Object.keys(gameState.player.equipment[slot]).length === 0) {
    throw createError({
      statusCode: 400,
      message: 'No item equipped in this slot',
    })
  }

  // Move to inventory
  gameState.player.inventory.push(gameState.player.equipment[slot])
  gameState.player.equipment[slot] = {}

  return {
    message: 'Gỡ trang bị thành công',
  }
}

async function handleBuyItem(gameState: any, payload: any) {
  const { itemId, price } = payload
  
  if (gameState.player.props.money < price) {
    throw createError({
      statusCode: 400,
      message: 'Không đủ Linh Thạch',
    })
  }

  gameState.player.props.money -= price

  return {
    message: 'Mua thành công',
  }
}

async function handleSellItem(gameState: any, payload: any) {
  const { itemId, price } = payload
  
  const itemIndex = gameState.player.inventory.findIndex((item: any) => item.id === itemId)
  if (itemIndex === -1) {
    throw createError({
      statusCode: 404,
      message: 'Item not found',
    })
  }

  gameState.player.inventory.splice(itemIndex, 1)
  gameState.player.props.money += price

  return {
    message: 'Bán thành công',
  }
}

async function handleUseItem(gameState: any, payload: any) {
  const { itemId } = payload
  
  return {
    message: 'Sử dụng vật phẩm thành công',
  }
}

async function handleCheckin(gameState: any, payload: any) {
  const today = new Date().toDateString()
  const lastCheckin = gameState.player.lastCheckinDate 
    ? new Date(gameState.player.lastCheckinDate).toDateString() 
    : null

  if (lastCheckin === today) {
    throw createError({
      statusCode: 400,
      message: 'Hôm nay bạn đã điểm danh rồi',
    })
  }

  const yesterday = new Date(Date.now() - 86400000).toDateString()
  if (lastCheckin === yesterday) {
    gameState.player.checkinStreak += 1
  } else {
    gameState.player.checkinStreak = 1
  }

  gameState.player.checkinDays += 1
  gameState.player.lastCheckinDate = new Date()

  // Grant rewards
  const reward = gameState.player.checkinStreak * 100
  gameState.player.props.money += reward

  return {
    message: 'Điểm danh thành công',
    reward,
    streak: gameState.player.checkinStreak,
  }
}

async function handleMiniGame(gameState: any, payload: any) {
  const { gameType, playerChoice } = payload
  
  return {
    message: 'Game completed',
  }
}

async function handleUpdateSettings(gameState: any, payload: any) {
  const { dark, name } = payload
  
  if (dark !== undefined) {
    gameState.player.dark = dark
  }
  
  if (name !== undefined) {
    gameState.player.name = name
  }

  return {
    message: 'Cập nhật cài đặt thành công',
  }
}
