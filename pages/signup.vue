<script setup lang="ts">
const form = reactive({ name: '', phone: '', city: '', password: '' })
const submitting = ref(false)
const errorMsg = ref('')

async function submit() {
  errorMsg.value = ''
  submitting.value = true
  try {
    // TODO: POST to Laravel API — /api/auth/register
    // await $fetch('/api/auth/register', { method: 'POST', body: { ...form } })
    // await navigateTo('/')
    await new Promise((r) => setTimeout(r, 400)) // placeholder until the API is wired
  } catch (e: any) {
    errorMsg.value = e?.data?.message || 'Could not create your account. Please try again.'
  } finally {
    submitting.value = false
  }
}

useHead({ title: 'Create account — Mobilo.pk' })
</script>

<template>
  <div class="mx-auto w-full max-w-[420px] px-4 py-12">
    <BackLink class="mb-4" fallback="/" />
    <h1 class="m-0 mb-1.5 text-center font-display text-[26px] font-extrabold tracking-tight">Create your account</h1>
    <p class="m-0 mb-6 text-center text-sm text-slate">Buy and sell with a verified profile</p>
    <form class="flex flex-col gap-4 rounded-card border border-line bg-white p-6" @submit.prevent="submit">
      <div class="flex flex-col gap-[7px]">
        <label for="signup-name" class="text-[12.5px] font-semibold">Full name</label>
        <input id="signup-name" v-model="form.name" autocomplete="name" required class="h-12 rounded-btn border-[1.5px] border-line px-3.5 text-sm font-medium outline-none focus:border-brand" />
      </div>
      <div class="flex flex-col gap-[7px]">
        <label for="signup-phone" class="text-[12.5px] font-semibold">Phone number</label>
        <input id="signup-phone" v-model="form.phone" type="tel" autocomplete="tel" placeholder="03XX-XXXXXXX" required class="h-12 rounded-btn border-[1.5px] border-line px-3.5 text-sm font-medium outline-none focus:border-brand" />
      </div>
      <div class="flex flex-col gap-[7px]">
        <label for="signup-city" class="text-[12.5px] font-semibold">City</label>
        <select id="signup-city" v-model="form.city" class="h-12 rounded-btn border-[1.5px] border-line bg-white px-3 text-sm font-medium outline-none">
          <option value="" disabled>Select…</option>
          <option>Karachi</option><option>Lahore</option><option>Islamabad</option><option>Rawalpindi</option><option>Faisalabad</option>
        </select>
      </div>
      <div class="flex flex-col gap-[7px]">
        <label for="signup-password" class="text-[12.5px] font-semibold">Password</label>
        <input id="signup-password" v-model="form.password" type="password" autocomplete="new-password" required class="h-12 rounded-btn border-[1.5px] border-line px-3.5 text-sm font-medium outline-none focus:border-brand" />
      </div>
      <p v-if="errorMsg" class="m-0 rounded-btn bg-alert-tint px-3 py-2 text-[12.5px] font-medium text-alert-deep">{{ errorMsg }}</p>
      <button
        type="submit"
        :disabled="submitting"
        class="h-12 rounded-btn bg-brand text-sm font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {{ submitting ? 'Creating account…' : 'Create account' }}
      </button>
      <div class="text-center text-[13px] text-slate">
        Already have an account?
        <NuxtLink to="/login" class="font-semibold text-brand no-underline">Login</NuxtLink>
      </div>
    </form>
  </div>
</template>
