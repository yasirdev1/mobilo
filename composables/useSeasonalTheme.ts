import { seasonalThemes, DEFAULT_BRAND, type SeasonalTheme } from '~/config/seasonal-themes'

/** Is `date` inside the MM-DD window (inclusive)? Handles windows crossing new year. */
function inWindow(date: Date, start: string, end: string): boolean {
  const mmdd = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  return start <= end ? mmdd >= start && mmdd <= end : mmdd >= start || mmdd <= end
}

export function resolveActiveTheme(date = new Date(), preview?: string): SeasonalTheme | null {
  if (preview) return seasonalThemes.find((t) => t.id === preview) ?? null
  return seasonalThemes.find((t) => inWindow(date, t.start, t.end)) ?? null
}

/**
 * Applies the active seasonal theme (or the default brand) as CSS
 * variables on <html>, and returns the banner to render, if any.
 *
 * Call once in the default layout. Pass { preview: 'independence' }
 * to force a theme for QA.
 */
export function useSeasonalTheme(opts: { preview?: string } = {}) {
  const theme = computed(() => resolveActiveTheme(new Date(), opts.preview))

  const vars = computed(() => {
    const c = theme.value?.colors ?? DEFAULT_BRAND
    return {
      '--brand': c.brand,
      '--brand-dark': c.brandDark,
      '--brand-tint': c.brandTint,
    }
  })

  // SSR-safe: htmlAttrs style carries the vars into the first paint.
  useHead({
    htmlAttrs: {
      style: computed(() =>
        Object.entries(vars.value)
          .map(([k, v]) => `${k}: ${v}`)
          .join('; '),
      ),
    },
  })

  return {
    theme,
    banner: computed(() => theme.value?.banner ?? null),
  }
}
