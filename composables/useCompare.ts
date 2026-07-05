/**
 * Compare selection store (max 4 phones), persisted to localStorage.
 * Cards call toggle(slug); CompareBar renders the floating dark bar;
 * "Compare Now" navigates to /compare?phones=a,b,c
 */
const MAX = 4
const KEY = 'mobilo-compare'

export function useCompare() {
  // SSR renders an empty list; the real value is loaded from localStorage
  // AFTER hydration (in onMounted) to avoid an SSR/client markup mismatch.
  // Reading localStorage in the useState initializer does NOT work: on the
  // client, useState hydrates from the server payload and the initializer
  // never re-runs — so persisted selections were silently lost on reload.
  const selected = useState<string[]>('compare-selected', () => [])
  const hydrated = useState<boolean>('compare-hydrated', () => false)

  if (import.meta.client && getCurrentInstance()) {
    onMounted(() => {
      if (hydrated.value) return
      hydrated.value = true
      try {
        const saved = JSON.parse(localStorage.getItem(KEY) || '[]')
        if (Array.isArray(saved)) selected.value = saved.slice(0, MAX)
      } catch {
        /* ignore corrupt storage */
      }
    })
  }

  function persist() {
    if (import.meta.client) localStorage.setItem(KEY, JSON.stringify(selected.value))
  }

  function toggle(slug: string) {
    const i = selected.value.indexOf(slug)
    if (i >= 0) selected.value.splice(i, 1)
    else if (selected.value.length < MAX) selected.value.push(slug)
    persist()
  }

  function remove(slug: string) {
    selected.value = selected.value.filter((s) => s !== slug)
    persist()
  }

  function clear() {
    selected.value = []
    persist()
  }

  return {
    selected,
    max: MAX,
    toggle,
    remove,
    clear,
    isSelected: (slug: string) => selected.value.includes(slug),
    compareUrl: computed(() => `/compare?phones=${selected.value.join(',')}`),
  }
}
