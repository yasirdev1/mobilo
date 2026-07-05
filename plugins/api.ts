/**
 * Provides `$api` — a configured $fetch instance pointed at the Laravel API,
 * attaching the bearer token (from a cookie) and JSON headers automatically.
 * Use via: const { $api } = useNuxtApp()
 */
export default defineNuxtPlugin({
  name: 'api',
  setup() {
    const config = useRuntimeConfig()
    const token = useCookie<string | null>('mobilo_token', {
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    })

    const api = $fetch.create({
      baseURL: config.public.apiBase,
      onRequest({ options }) {
        const headers = new Headers(options.headers as HeadersInit)
        headers.set('Accept', 'application/json')
        if (token.value) headers.set('Authorization', `Bearer ${token.value}`)
        options.headers = headers
      },
      onResponseError({ response }) {
        // On 401, clear the stale token.
        if (response.status === 401) token.value = null
      },
    })

    return { provide: { api } }
  },
})
