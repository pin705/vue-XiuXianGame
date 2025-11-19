export default defineEventHandler(async (event) => {
  try {
    const session = await getUserSession(event)

    if (!session) {
      return {
        user: null,
      }
    }

    return {
      user: session.user,
    }
  } catch (error) {
    console.error('Session error:', error)
    return {
      user: null,
    }
  }
})
