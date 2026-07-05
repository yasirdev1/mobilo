/**
 * ─── OWNER-EDITABLE SEASONAL THEMES ────────────────────────────────
 * Add/edit/remove themes here. No other code changes needed.
 *
 * A theme auto-activates when today's date falls inside start..end
 * (format "MM-DD", inclusive, year-agnostic — windows may cross the
 * new year, e.g. start "12-25", end "01-02").
 *
 * colors  → swap the site's brand color (primary buttons, links,
 *           active states). Everything else stays untouched.
 * banner  → optional slim announcement strip above the header.
 *           Omit `banner` to theme colors silently.
 */
export interface SeasonalTheme {
  id: string
  name: string
  start: string // "MM-DD"
  end: string // "MM-DD"
  colors: {
    brand: string
    brandDark: string
    brandTint: string
  }
  banner?: {
    text: string
    /** optional link target, e.g. a sale landing page */
    href?: string
    bg: string
    fg: string
  }
}

export const DEFAULT_BRAND = {
  brand: '#0b8a5c',
  brandDark: '#087a51',
  brandTint: '#e7f5ee',
}

export const seasonalThemes: SeasonalTheme[] = [
  {
    id: 'independence',
    name: 'Jashn-e-Azadi (14 August)',
    start: '08-10',
    end: '08-16',
    colors: {
      brand: '#01623c', // deeper Pakistan green
      brandDark: '#014a2d',
      brandTint: '#e4f2ea',
    },
    banner: {
      text: '🇵🇰 Jashn-e-Azadi Mubarak — Independence Day deals on mobiles all week',
      href: '/mobiles',
      bg: '#01411c',
      fg: '#ffffff',
    },
  },
  {
    id: 'eid',
    name: 'Eid Sale',
    start: '03-19', // ← owner: update to actual Eid window each year
    end: '03-24',
    colors: {
      brand: '#0b8a5c',
      brandDark: '#087a51',
      brandTint: '#e7f5ee',
    },
    banner: {
      text: '🌙 Eid Mubarak — sellers are online, best time to grab a deal',
      href: '/used',
      bg: '#0e2b1f',
      fg: '#dcebe2',
    },
  },
]
