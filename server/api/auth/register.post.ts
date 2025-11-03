import { User } from '~/server/models/User'
import { GameState } from '~/server/models/GameState'
import { hashPassword } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const { username, email, password } = await readBody(event)

    // Validation
    if (!username || !email || !password) {
      throw createError({
        statusCode: 400,
        message: 'Vui lòng điền đầy đủ thông tin',
      })
    }

    if (username.length < 3 || username.length > 20) {
      throw createError({
        statusCode: 400,
        message: 'Tên người dùng phải từ 3-20 ký tự',
      })
    }

    if (password.length < 6) {
      throw createError({
        statusCode: 400,
        message: 'Mật khẩu phải có ít nhất 6 ký tự',
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    })

    if (existingUser) {
      throw createError({
        statusCode: 409,
        message: 'Tên người dùng hoặc email đã tồn tại',
      })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    })

    // Create initial game state for user
    await GameState.create({
      userId: user._id,
      player: {
        id: user._id.toString(),
        name: username,
        time: Date.now(),
        age: 1,
        level: 0,
        score: 0,
        attack: 10,
        defense: 10,
        health: 100,
        maxHealth: 100,
        dodge: 0,
        critical: 0,
        mana: 0,
        points: 0,
        cultivation: 0,
        maxCultivation: 100,
        reincarnation: 0,
        version: 1.0,
        isNewbie: true,
        dark: false,
        zc: false,
        taskNum: 0,
        backpackCapacity: 50,
        highestTowerFloor: 1,
        gameWins: 0,
        gameLosses: 0,
        checkinDays: 0,
        checkinStreak: 0,
        currentTitle: null,
        script: '',
        pet: {},
        wife: {},
        pets: [],
        wifes: [],
        npcs: [],
        inventory: [],
        shopData: [],
        sellingEquipmentData: [],
        rewardedTowerFloors: [],
        props: {
          money: 0,
          flying: 0,
          qingyuan: 0,
          rootBone: 0,
          currency: 0,
          cultivateDan: 0,
          strengtheningStone: 0,
        },
        equipment: {
          sutra: {},
          armor: {},
          weapon: {},
          accessory: {},
        },
        achievement: {
          pet: [],
          monster: [],
          equipment: [],
        },
        nextGameTimes: {
          rps: null,
          dice: null,
          fortune: null,
          secretrealm: 0,
          gamblingStone: null,
        },
        lastCheckinDate: null,
        fortuneTellingDate: null,
      },
      boss: {
        name: '',
        text: '',
        desc: '',
        time: 0,
        level: 0,
        attack: 0,
        defense: 0,
        health: 0,
        maxhealth: 0,
        dodge: 0,
        critical: 0,
        conquer: false,
      },
    })

    return {
      success: true,
      message: 'Đăng ký thành công',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Register error:', error)
    throw createError({
      statusCode: 500,
      message: 'Đã xảy ra lỗi khi đăng ký',
    })
  }
})
