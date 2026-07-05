/**
 * Route middleware guarding the admin section. Requires an authenticated user
 * with `dashboard.access` (or the super-admin role). Attach via:
 *   definePageMeta({ layout: 'admin', middleware: 'admin' })
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const { user, token, isAdmin, fetchUser } = useAuth()

  if (!user.value && token.value) {
    await fetchUser()
  }

  if (!isAdmin.value) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
