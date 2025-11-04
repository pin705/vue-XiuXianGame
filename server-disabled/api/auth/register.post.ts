import { User } from '~/server/models/User'
import { GameState } from '~/server/models/GameState'
import { createInitialGameState } from '~/server/utils/gameState'

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
    await GameState.create(createInitialGameState(user._id.toString(), username))

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
