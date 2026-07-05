<script setup lang="ts">
/**
 * Sell flow — supports ?preset=Brand%20Model to preselect the phone
 * (used by "Sell this phone" buttons site-wide).
 */
const route = useRoute()
const repo = usePhoneRepository()
const { data: phones } = await useAsyncData('phones-sell', () => repo.all())

const form = reactive({
  phone: String(route.query.preset ?? ''),
  storage: '',
  condition: '',
  pta: true,
  price: '',
  city: '',
  description: '',
})
const conditions = ['Like New', 'Excellent', 'Good', 'Fair']
const submitted = ref(false)
const submitting = ref(false)
const submitError = ref('')
const errors = reactive<{ condition?: string; price?: string }>({})

function validate() {
  errors.condition = form.condition ? undefined : 'Please select a condition.'
  const price = Number(form.price)
  errors.price =
    form.price !== '' && Number.isFinite(price) && price > 0
      ? undefined
      : 'Enter a valid asking price.'
  return !errors.condition && !errors.price
}

useSeoMeta({
  title: 'Sell Your Mobile in Pakistan — Free Listing | Mobilo.pk',
  description:
    'Sell your used mobile phone in Pakistan for free. List your phone in minutes and reach buyers browsing that exact model.',
  ogTitle: 'Sell Your Mobile in Pakistan — Free Listing',
  ogDescription: 'List your used phone for free and reach buyers across Pakistan.',
})

function resetForm() {
  Object.assign(form, { phone: '', storage: '', condition: '', pta: true, price: '', city: '', description: '' })
  errors.condition = undefined
  errors.price = undefined
  submitError.value = ''
  submitted.value = false
}

async function submit() {
  // Native `required` covers phone; enforce the chip-based & numeric fields here.
  if (!validate()) return
  submitError.value = ''
  submitting.value = true
  try {
    // TODO: POST to Laravel API — /api/listings
    // await $fetch('/api/listings', { method: 'POST', body: { ...form } })
    await new Promise((r) => setTimeout(r, 400)) // placeholder until the API is wired
    submitted.value = true
  } catch (e: any) {
    submitError.value = e?.data?.message || 'Could not submit your listing. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="mx-auto w-full max-w-[640px] px-4 py-8">
    <BackLink class="mb-3" fallback="/used" />
    <template v-if="!submitted">
      <h1 class="m-0 mb-1.5 font-display text-[clamp(22px,3.5vw,30px)] font-bold tracking-tight">Sell Your Mobile</h1>
      <p class="m-0 mb-6 text-[14px] leading-relaxed text-slate">Free listing · Reaches buyers on the phone's own page</p>

      <form class="flex flex-col gap-5 rounded-card border border-line bg-white p-6" @submit.prevent="submit">
        <div class="flex flex-col gap-[7px]">
          <label for="sell-phone" class="text-[12.5px] font-semibold">Which phone? <span class="text-alert">*</span></label>
          <input id="sell-phone" v-model="form.phone" list="phone-list" required placeholder="e.g. Samsung Galaxy A55" class="h-12 rounded-btn border-[1.5px] border-line px-3.5 text-sm font-medium outline-none focus:border-brand" />
          <datalist id="phone-list">
            <option v-for="p in phones ?? []" :key="p.slug" :value="p.name" />
          </datalist>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-[7px]">
            <label for="sell-storage" class="text-[12.5px] font-semibold">Storage</label>
            <select id="sell-storage" v-model="form.storage" class="h-12 rounded-btn border-[1.5px] border-line bg-white px-3 text-sm font-medium outline-none">
              <option value="" disabled>Select…</option>
              <option>64GB</option><option>128GB</option><option>256GB</option><option>512GB</option>
            </select>
          </div>
          <div class="flex flex-col gap-[7px]">
            <label for="sell-city" class="text-[12.5px] font-semibold">City</label>
            <select id="sell-city" v-model="form.city" class="h-12 rounded-btn border-[1.5px] border-line bg-white px-3 text-sm font-medium outline-none">
              <option value="" disabled>Select…</option>
              <option>Karachi</option><option>Lahore</option><option>Islamabad</option><option>Rawalpindi</option><option>Faisalabad</option>
            </select>
          </div>
        </div>

        <div class="flex flex-col gap-2" role="group" aria-labelledby="sell-condition-label">
          <span id="sell-condition-label" class="text-[12.5px] font-semibold">Condition <span class="text-alert">*</span></span>
          <div class="flex flex-wrap gap-1.5">
            <FilterChip v-for="c in conditions" :key="c" :label="c" :active="form.condition === c" @toggle="form.condition = c; errors.condition = undefined" />
          </div>
          <p v-if="errors.condition" class="m-0 text-[12px] font-medium text-alert">{{ errors.condition }}</p>
        </div>

        <ToggleSwitch v-model="form.pta" label="PTA Approved" />

        <div class="flex flex-col gap-[7px]">
          <label for="sell-price" class="text-[12.5px] font-semibold">Asking price (Rs.) <span class="text-alert">*</span></label>
          <input id="sell-price" v-model="form.price" type="number" min="1" step="1" inputmode="numeric" required placeholder="e.g. 145000" class="h-12 rounded-btn border-[1.5px] border-line px-3.5 text-sm font-medium outline-none focus:border-brand" @input="errors.price = undefined" />
          <p v-if="errors.price" class="m-0 text-[12px] font-medium text-alert">{{ errors.price }}</p>
        </div>

        <div class="flex flex-col gap-[7px]">
          <label for="sell-description" class="text-[12.5px] font-semibold">Description</label>
          <textarea id="sell-description" v-model="form.description" rows="3" placeholder="Mention warranty, repairs, battery health…" class="rounded-btn border-[1.5px] border-line px-3.5 py-3 text-sm outline-none focus:border-brand" />
        </div>

        <p v-if="submitError" class="m-0 rounded-btn bg-alert-tint px-3 py-2 text-[12.5px] font-medium text-alert-deep">{{ submitError }}</p>
        <div class="flex flex-col-reverse gap-2.5 sm:flex-row">
          <NuxtLink
            to="/used"
            class="grid h-[52px] flex-1 place-items-center rounded-xl border border-line bg-white text-[15px] font-semibold text-ink no-underline hover:bg-mist"
          >
            Cancel
          </NuxtLink>
          <button
            type="submit"
            :disabled="submitting"
            class="h-[52px] flex-1 rounded-xl bg-brand text-[15px] font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{ submitting ? 'Submitting…' : 'Submit listing for review' }}
          </button>
        </div>
      </form>
    </template>

    <!-- Success state -->
    <div v-else class="flex flex-col items-center gap-2 rounded-card border border-line bg-white px-5 py-10 text-center">
      <div class="grid h-12 w-12 place-items-center rounded-full bg-winner-tint font-display text-xl font-bold text-winner">✓</div>
      <div class="font-display text-[17px] font-semibold">Listing submitted for review</div>
      <div class="max-w-[360px] text-[13px] leading-relaxed text-slate">
        Appears on the phone's page after approval, usually within 24 hours.
      </div>
      <div class="mt-2 flex flex-wrap justify-center gap-2.5">
        <NuxtLink to="/used" class="inline-flex h-[42px] items-center rounded-btn bg-brand-tint px-[18px] text-[13px] font-semibold text-brand no-underline">
          Browse used mobiles
        </NuxtLink>
        <button
          type="button"
          class="inline-flex h-[42px] items-center rounded-btn border border-line bg-white px-[18px] text-[13px] font-semibold text-ink hover:bg-mist"
          @click="resetForm"
        >
          List another phone
        </button>
      </div>
    </div>
  </div>
</template>
