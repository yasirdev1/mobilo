/** Mobilo.pk domain models — keep field names in sync with the API contract. */

export interface Phone {
  slug: string
  name: string
  brand: string
  price: number
  specsLine: string // e.g. "Exynos 1480 · 8/256GB · 5000mAh"
  badge?: string // e.g. "Value Pick", "Best Gaming"
  image?: string
  launched?: string
  scores?: { performance: number; camera: number; battery: number; value: number }
  specs?: Record<string, Record<string, string>> // section → { label: value }
}

export interface RetailerPrice {
  retailer: string
  price: number
  inStock: boolean
  lowest?: boolean
  url: string
}

export type ListingStatus = 'available' | 'sold'

export interface UsedListing {
  id: string
  title: string
  price: number
  ptaApproved: boolean
  condition: 'Like New' | 'Excellent' | 'Good' | 'Fair'
  city: string
  posted: string
  image?: string
  seller?: Seller
  /** Marketplace status. Absent = treated as 'available'. */
  status?: ListingStatus
}

export interface Seller {
  name: string
  verified: boolean
  memberSince: string
  city: string
  sold: number
  rating: number
  replyTime: string
}

export interface Brand {
  name: string
  initial: string
  count: number
}
