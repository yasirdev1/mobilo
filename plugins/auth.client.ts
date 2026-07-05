/**
 * Restores the authenticated user on app start (if a token cookie exists),
 * so isLoggedIn / permissions are available for gating. Runs after api.ts.
 */
export default defineNuxtPlugin({
  name: 'auth',
  dependsOn: ['api'],
  async setup() {
    const { token, fetchUser } = useAuth()
    if (token.value) await fetchUser()
  },
})
