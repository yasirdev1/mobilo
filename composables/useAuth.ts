/**
 * Auth store — token-based (Sanctum). Exposes the current user (with roles &
 * permissions) and helpers used to gate UI, including the admin section.
 */
interface AuthUser {
  id: number
  name: string
  phone: string | null
  email: string | null
  is_verified: boolean
  roles: string[]
  permissions: string[]
}

export function useAuth() {
  const { $api } = useNuxtApp()
  const token = useCookie<string | null>('mobilo_token', { sameSite: 'lax', maxAge: 60 * 60 * 24 * 30 })
  const user = useState<AuthUser | null>('auth-user', () => null)

  const isLoggedIn = computed(() => !!user.value)
  const can = (permission: string) => !!user.value?.permissions?.includes(permission)
  const hasRole = (role: string) => !!user.value?.roles?.includes(role)
  const isAdmin = computed(() => can('dashboard.access') || hasRole('super-admin'))

  async function fetchUser() {
    if (!token.value) {
      user.value = null
      return null
    }
    try {
      user.value = await $api<AuthUser>('/user')
    } catch {
      user.value = null
      token.value = null
    }
    return user.value
  }

  async function login(phone: string, password: string) {
    const res = await $api<{ token: string; user: AuthUser }>('/auth/login', {
      method: 'POST',
      body: { phone, password },
    })
    token.value = res.token
    user.value = res.user
    return res.user
  }

  async function register(payload: Record<string, unknown>) {
    const res = await $api<{ token: string; user: AuthUser }>('/auth/register', {
      method: 'POST',
      body: payload,
    })
    token.value = res.token
    user.value = res.user
    return res.user
  }

  async function logout() {
    try {
      await $api('/auth/logout', { method: 'POST' })
    } catch {
      /* ignore */
    }
    token.value = null
    user.value = null
  }

  return { user, token, isLoggedIn, isAdmin, can, hasRole, fetchUser, login, register, logout }
}
