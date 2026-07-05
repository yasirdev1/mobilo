/**
 * ─── REPOSITORY LAYER ──────────────────────────────────────────────
 * Now API-backed (Laravel). Pages/components are unchanged — they call the
 * same methods; only this file knows about HTTP. Responses already match the
 * frontend types (the API returns unwrapped arrays/objects).
 */
import type { Phone, RetailerPrice, Brand } from '~/data/types'

export interface PhoneRepository {
  all(): Promise<Phone[]>
  bySlug(slug: string): Promise<Phone | undefined>
  search(query: string): Promise<Phone[]>
  brands(): Promise<Brand[]>
  retailerPrices(slug: string): Promise<RetailerPrice[]>
}

export function usePhoneRepository(): PhoneRepository {
  const { $api } = useNuxtApp()

  return {
    all: () => $api<Phone[]>('/phones'),
    bySlug: (slug: string) => $api<Phone>(`/phones/${slug}`),
    search: (query: string) =>
      query.trim() ? $api<Phone[]>('/phones/search', { query: { q: query } }) : Promise.resolve([]),
    brands: () => $api<Brand[]>('/brands'),
    retailerPrices: (slug: string) => $api<RetailerPrice[]>(`/phones/${slug}/offers`),
  }
}
