import { User } from '~/server/models/User'

export default defineEventHandler(async (event) => {
  try {
    const { username, password } = await readBody(event)

    // Validation
    if (!username || !password) {
      throw createError({
        statusCode: 400,
        message: 'Vui lòng điền đầy đủ thông tin',
      })
    }

    // Find user
    const user = await User.findOne({ username })

    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Tên người dùng hoặc mật khẩu không đúng',
      })
    }

    // Verify password
    // const isValid = await verifyPassword(password, user.password)

    // if (!isValid) {
    //   throw createError({
    //     statusCode: 401,
    //     message: 'Tên người dùng hoặc mật khẩu không đúng',
    //   })
    // }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Set session using nuxt-auth-utils
    await setUserSession(event, {
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
      },
      loggedInAt: Date.now(),
    })

    return {
      success: true,
      message: 'Đăng nhập thành công',
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
    
    console.error('Login error:', error)
    throw createError({
      statusCode: 500,
      message: 'Đã xảy ra lỗi khi đăng nhập',
    })
  }
})
