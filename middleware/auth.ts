export default defineNuxtRouteMiddleware(async (to, from) => {
  const { data: session } = await useFetch('/api/auth/session')

  if (!session.value || !session.value.user) {
    return navigateTo('/login')
  }
})
