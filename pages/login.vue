<script setup lang="ts">
const { login } = useAuth()
const route = useRoute()
const form = reactive({ phone: '', password: '' })
const submitting = ref(false)
const errorMsg = ref('')

async function submit() {
  errorMsg.value = ''
  submitting.value = true
  try {
    await login(form.phone, form.password)
    await navigateTo((route.query.redirect as string) || '/')
  } catch (e: any) {
    errorMsg.value = e?.data?.message || 'Login failed. Please check your details and try again.'
  } finally {
    submitting.value = false
  }
}

useHead({ title: 'Login — Mobilo.pk' })
</script>

<template>
  <div class="mx-auto w-full max-w-[420px] px-4 py-12">
    <BackLink class="mb-4" fallback="/" />
    <h1 class="m-0 mb-1.5 text-center font-display text-[26px] font-extrabold tracking-tight">Welcome back</h1>
    <p class="m-0 mb-6 text-center text-sm text-slate">Login to manage your listings</p>
    <form class="flex flex-col gap-4 rounded-card border border-line bg-white p-6" @submit.prevent="submit">
      <div class="flex flex-col gap-[7px]">
        <label for="login-phone" class="text-[12.5px] font-semibold">Phone number</label>
        <input id="login-phone" v-model="form.phone" type="tel" autocomplete="tel" placeholder="03XX-XXXXXXX" required class="h-12 rounded-btn border-[1.5px] border-line px-3.5 text-sm font-medium outline-none focus:border-brand" />
      </div>
      <div class="flex flex-col gap-[7px]">
        <label for="login-password" class="text-[12.5px] font-semibold">Password</label>
        <input id="login-password" v-model="form.password" type="password" autocomplete="current-password" required class="h-12 rounded-btn border-[1.5px] border-line px-3.5 text-sm font-medium outline-none focus:border-brand" />
      </div>
      <p v-if="errorMsg" class="m-0 rounded-btn bg-alert-tint px-3 py-2 text-[12.5px] font-medium text-alert-deep">{{ errorMsg }}</p>
      <button
        type="submit"
        :disabled="submitting"
        class="h-12 rounded-btn bg-brand text-sm font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {{ submitting ? 'Logging in…' : 'Login' }}
      </button>
      <div class="text-center text-[13px] text-slate">
        New here?
        <NuxtLink to="/signup" class="font-semibold text-brand no-underline">Create an account</NuxtLink>
      </div>
    </form>
  </div>
</template>
