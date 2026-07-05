/**
 * Favorites / wishlist store — phone slugs the user saved, persisted to
 * localStorage. Same SSR-safe hydration approach as useCompare: seed empty
 * on the server, load from localStorage in onMounted so there's no hydration
 * mismatch and reloads keep the list.
 */
const KEY = 'mobilo-favorites'

export function useFavorites() {
  const favorites = useState<string[]>('favorites', () => [])
  const hydrated = useState<boolean>('favorites-hydrated', () => false)

  if (import.meta.client && getCurrentInstance()) {
    onMounted(() => {
      if (hydrated.value) return
      hydrated.value = true
      try {
        const saved = JSON.parse(localStorage.getItem(KEY) || '[]')
        if (Array.isArray(saved)) favorites.value = saved
      } catch {
        /* ignore corrupt storage */
      }
    })
  }

  function persist() {
    if (import.meta.client) localStorage.setItem(KEY, JSON.stringify(favorites.value))
  }

  function toggle(slug: string) {
    const i = favorites.value.indexOf(slug)
    if (i >= 0) favorites.value.splice(i, 1)
    else favorites.value.push(slug)
    persist()
  }

  function remove(slug: string) {
    favorites.value = favorites.value.filter((s) => s !== slug)
    persist()
  }

  return {
    favorites,
    toggle,
    remove,
    isFavorite: (slug: string) => favorites.value.includes(slug),
    count: computed(() => favorites.value.length),
  }
}
