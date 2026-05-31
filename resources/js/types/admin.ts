/**
 * Admin TypeScript types.
 */

export interface AdminUser {
  id: string
  email: string
  name: string
  role: string
}

export interface SpringUser {
  id: number
  email: string
  name?: string | null
  role: string
  phone?: string
  createdAt?: string
  storeName?: string | null
}
