export default defineEventHandler(async (event) => {
  try {
    // Clear session using nuxt-auth-utils
    await clearUserSession(event)

    return {
      success: true,
      message: 'Đăng xuất thành công',
    }
  } catch (error) {
    console.error('Logout error:', error)
    throw createError({
      statusCode: 500,
      message: 'Đã xảy ra lỗi khi đăng xuất',
    })
  }
})
