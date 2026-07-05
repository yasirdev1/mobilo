/**
 * ─── REPOSITORY LAYER ──────────────────────────────────────────────
 * Same idea as Laravel's service/repository pattern: pages and
 * components NEVER touch data sources directly — they go through a
 * repository interface. Today the implementation reads bundled JSON;
 * swap `JsonPhoneRepository` for an API-backed implementation
 * (useFetch / $fetch) without changing a single component.
 */
import type { Phone, RetailerPrice, Brand } from '~/data/types'
import phones from '~/data/phones.json'
import brands from '~/data/brands.json'
import retailers from '~/data/retailers.json'

export interface PhoneRepository {
  all(): Promise<Phone[]>
  bySlug(slug: string): Promise<Phone | undefined>
  search(query: string): Promise<Phone[]>
  brands(): Promise<Brand[]>
  retailerPrices(slug: string): Promise<RetailerPrice[]>
}

class JsonPhoneRepository implements PhoneRepository {
  async all(): Promise<Phone[]> {
    return phones as Phone[]
  }
  async bySlug(slug: string) {
    return (phones as Phone[]).find((p) => p.slug === slug)
  }
  async search(query: string) {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return (phones as Phone[]).filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q),
    )
  }
  async brands(): Promise<Brand[]> {
    return brands as Brand[]
  }
  async retailerPrices(_slug: string): Promise<RetailerPrice[]> {
    // Dummy data returns the same offers for every phone.
    return retailers as RetailerPrice[]
  }
}

/* Example API-backed implementation (uncomment when backend is ready):
class ApiPhoneRepository implements PhoneRepository {
  all() { return $fetch<Phone[]>('/api/phones') }
  bySlug(slug: string) { return $fetch<Phone>(`/api/phones/${slug}`) }
  search(q: string) { return $fetch<Phone[]>('/api/phones/search', { query: { q } }) }
  brands() { return $fetch<Brand[]>('/api/brands') }
  retailerPrices(slug: string) { return $fetch<RetailerPrice[]>(`/api/phones/${slug}/prices`) }
}
*/

let instance: PhoneRepository | null = null
export function usePhoneRepository(): PhoneRepository {
  return (instance ??= new JsonPhoneRepository())
}
