/** Used-marketplace repository — API-backed (see phoneRepository.ts). */
import type { UsedListing } from '~/data/types'

export interface UsedListingRepository {
  all(filters?: { city?: string; ptaOnly?: boolean }): Promise<UsedListing[]>
  byId(id: string): Promise<UsedListing | undefined>
  mine(): Promise<UsedListing[]>
  update(id: string, patch: Partial<UsedListing>): Promise<UsedListing | undefined>
  markSold(id: string): Promise<UsedListing | undefined>
  create(payload: Record<string, unknown>): Promise<UsedListing>
}

export function useUsedListingRepository(): UsedListingRepository {
  const { $api } = useNuxtApp()

  return {
    all: (filters) =>
      $api<UsedListing[]>('/listings', {
        query: { city: filters?.city, ptaOnly: filters?.ptaOnly ? 1 : undefined },
      }),
    byId: (id: string) => $api<UsedListing>(`/listings/${id}`),
    mine: () => $api<UsedListing[]>('/me/listings'),
    update: (id: string, patch) => $api<UsedListing>(`/listings/${id}`, { method: 'PATCH', body: patch }),
    markSold: (id: string) => $api<UsedListing>(`/listings/${id}/sold`, { method: 'POST' }),
    create: (payload) => $api<UsedListing>('/listings', { method: 'POST', body: payload }),
  }
}
