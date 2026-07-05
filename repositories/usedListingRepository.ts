/** Used-marketplace repository — see phoneRepository.ts for the pattern. */
import type { UsedListing } from '~/data/types'
import listings from '~/data/used-listings.json'

export interface UsedListingRepository {
  all(filters?: { brand?: string; city?: string; ptaOnly?: boolean }): Promise<UsedListing[]>
  byId(id: string): Promise<UsedListing | undefined>

  // ─── The signed-in user's own listings ──────────────────────────
  /** Listings owned by the current user. */
  mine(): Promise<UsedListing[]>
  /** Patch an owned listing (price, condition, city, PTA status…). */
  update(id: string, patch: Partial<UsedListing>): Promise<UsedListing | undefined>
  /** Mark an owned listing as sold. */
  markSold(id: string): Promise<UsedListing | undefined>
}

class JsonUsedListingRepository implements UsedListingRepository {
  /**
   * In-memory working copy of the current user's listings. Seeded from the
   * dummy JSON so edits / mark-sold persist for the session. Replace this and
   * the methods below with `$fetch('/api/me/listings', …)` when the API lands.
   */
  private owned: UsedListing[] | null = null

  private ensureOwned(): UsedListing[] {
    if (!this.owned) {
      // Pretend the first few seed listings belong to the signed-in user.
      this.owned = (listings as UsedListing[])
        .slice(0, 4)
        .map((l) => ({ ...l, status: l.status ?? 'available' }))
    }
    return this.owned
  }

  async all(filters?: { brand?: string; city?: string; ptaOnly?: boolean }) {
    let out = listings as UsedListing[]
    if (filters?.brand) out = out.filter((l) => l.title.toLowerCase().includes(filters.brand!.toLowerCase()))
    if (filters?.city) out = out.filter((l) => l.city === filters.city)
    if (filters?.ptaOnly) out = out.filter((l) => l.ptaApproved)
    return out
  }
  async byId(id: string) {
    return (listings as UsedListing[]).find((l) => l.id === id)
  }

  async mine() {
    // Return a shallow copy so callers can't mutate our store directly.
    return this.ensureOwned().map((l) => ({ ...l }))
  }
  async update(id: string, patch: Partial<UsedListing>) {
    const l = this.ensureOwned().find((x) => x.id === id)
    if (l) Object.assign(l, patch)
    return l ? { ...l } : undefined
  }
  async markSold(id: string) {
    return this.update(id, { status: 'sold' })
  }
}

/* Example API-backed implementation (uncomment when backend is ready):
class ApiUsedListingRepository implements UsedListingRepository {
  all(filters) { return $fetch<UsedListing[]>('/api/listings', { query: filters }) }
  byId(id) { return $fetch<UsedListing>(`/api/listings/${id}`) }
  mine() { return $fetch<UsedListing[]>('/api/me/listings') }
  update(id, patch) { return $fetch<UsedListing>(`/api/listings/${id}`, { method: 'PATCH', body: patch }) }
  markSold(id) { return $fetch<UsedListing>(`/api/listings/${id}/sold`, { method: 'POST' }) }
}
*/

let instance: UsedListingRepository | null = null
export function useUsedListingRepository(): UsedListingRepository {
  return (instance ??= new JsonUsedListingRepository())
}
