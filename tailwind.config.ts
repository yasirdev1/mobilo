import type { Config } from 'tailwindcss'

/**
 * Mobilo.pk design tokens — single source of truth.
 * Derived from "Design System.dc.html".
 *
 * `brand*` colors resolve to CSS variables so the seasonal theming
 * system (composables/useSeasonalTheme.ts) can swap them at runtime.
 * Literal colors (emerald, winner, …) never change with the season.
 */
export default <Partial<Config>>{
  content: [
    './components/**/*.vue',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#14201b',
        slate: '#5b6b64',
        canvas: '#f6f8f7',
        mist: '#eef1ef',
        line: '#e3e8e5',
        hairline: '#f4f7f5',
        muted: '#6a7770', // darkened from #8a968f to meet WCAG AA (4.5:1) on white/light bg
        deep: '#0e2b1f',
        whatsapp: { DEFAULT: '#1da851', dark: '#178f44' },
        emerald: { DEFAULT: '#0b8a5c', dark: '#087a51', tint: '#e7f5ee' },
        winner: { DEFAULT: '#0a7a45', tint: '#e8f7ed' },
        sponsor: { DEFAULT: '#9a6b1f', tint: '#fdf3e2', border: '#f0dcb4' },
        alert: { DEFAULT: '#b42318', tint: '#fdecea', deep: '#7a1a12' },
        // Seasonal-swappable brand colors (CSS vars set in main.css / useSeasonalTheme)
        brand: {
          DEFAULT: 'var(--brand)',
          dark: 'var(--brand-dark)',
          tint: 'var(--brand-tint)',
        },
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        input: '8px',
        btn: '10px',
        card: '16px',
      },
      boxShadow: {
        resting: '0 1px 2px rgba(16,32,24,0.05)',
        raised: '0 6px 20px rgba(16,32,24,0.10)',
        overlay: '0 14px 32px rgba(16,32,24,0.14)',
      },
    },
  },
}
