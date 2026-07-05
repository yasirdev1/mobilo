<script setup lang="ts">
import type { Seller } from '~/data/types'
defineProps<{ seller: Seller }>()
</script>

<template>
  <div class="flex flex-col gap-3.5 rounded-card border border-line bg-white p-[18px]">
    <div class="flex items-center gap-3">
      <div class="grid h-12 w-12 place-items-center rounded-full bg-mist font-display text-[17px] font-bold text-slate">
        {{ seller.name.charAt(0) }}
      </div>
      <div>
        <div class="font-display text-[14.5px] font-bold">
          {{ seller.name }} <span v-if="seller.verified" class="text-[13px] text-brand">✓</span>
        </div>
        <div class="text-[11.5px] text-slate">Member since {{ seller.memberSince }} · {{ seller.city }}</div>
      </div>
    </div>
    <div class="flex flex-wrap gap-1.5">
      <span v-if="seller.verified" class="rounded-full bg-winner-tint px-2 py-1 text-[10.5px] font-semibold text-winner">✓ Verified Seller</span>
      <span class="rounded-full bg-mist px-2 py-1 text-[10.5px] font-semibold text-ink">⚡ Responds fast</span>
    </div>
    <div class="grid grid-cols-3 gap-2 border-y border-mist py-2.5 text-center">
      <div>
        <div class="font-display text-[15px] font-bold">{{ seller.sold }}</div>
        <div class="mt-0.5 text-[10.5px] text-muted">Sold</div>
      </div>
      <div>
        <div class="font-display text-[15px] font-bold">{{ seller.rating }}★</div>
        <div class="mt-0.5 text-[10.5px] text-muted">Rating</div>
      </div>
      <div>
        <div class="font-display text-[15px] font-bold">{{ seller.replyTime }}</div>
        <div class="mt-0.5 text-[10.5px] text-muted">Reply time</div>
      </div>
    </div>
    <div class="flex gap-2">
      <button class="h-11 flex-1 rounded-btn bg-mist text-[13px] font-semibold text-ink">Call</button>
      <button class="h-11 flex-[1.3] rounded-btn bg-whatsapp text-[13px] font-semibold text-white hover:bg-whatsapp-dark">WhatsApp</button>
    </div>
  </div>
</template>
