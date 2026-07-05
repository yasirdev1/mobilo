<script setup lang="ts">
// Seasonal theme is applied once per app here (writes CSS vars to <html>).
const { banner } = useSeasonalTheme()

// Self-referencing canonical for every page (uses the request origin so it
// works across environments without a hard-coded domain).
const url = useRequestURL()
const route = useRoute()
useHead({
  link: [{ rel: 'canonical', href: () => `${url.origin}${route.path}` }],
})
</script>

<template>
  <!-- pb on mobile so the fixed BottomTabBar never covers the footer/content -->
  <div class="flex min-h-screen flex-col pb-16 md:pb-0">
    <SeasonalBanner v-if="banner" :banner="banner" />
    <AppHeader />
    <main class="w-full flex-1">
      <slot />
    </main>
    <AppFooter />
    <!-- Mobile bottom nav — hidden on md+ -->
    <BottomTabBar class="md:hidden" />
  </div>
</template>
