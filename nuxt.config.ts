export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  // Nuxt only auto-imports composables/ and utils/ by default.
  // Register repositories/ so usePhoneRepository() & useUsedListingRepository() resolve.
  imports: {
    dirs: ['repositories'],
  },
  runtimeConfig: {
    public: {
      // Laravel API base (Herd). Override in production via NUXT_PUBLIC_API_BASE.
      apiBase: 'http://mobilo-backend.test/api',
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Mobilo.pk — Find, Compare, Buy & Sell Mobiles in Pakistan',
      // Site-wide defaults; pages override title/description/og:* via useSeoMeta.
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Compare mobile specs, prices, AI recommendations, purchase links, and used mobile listings across Pakistan.',
        },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#0b8a5c' },
        { property: 'og:site_name', content: 'Mobilo.pk' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'en_PK' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Instrument+Sans:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },
})
