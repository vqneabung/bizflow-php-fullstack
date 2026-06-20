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
  isActive?: boolean
}

export interface SpringOverview {
  totalProducts: number
  ordersThisMonth: number
  revenueThisMonth: number
  totalCustomers: number
  lowStockCount: number
}

export interface SpringProduct {
  id: string
  name: string
  categoryId: string | null
  categoryName: string | null
  primaryUnitName: string
  price: number
  costPrice: number | null
  stock: number
  minStock: number
  imageUrl: string | null
  imageKeys: string[]
  barcode: string | null
  isActive: boolean
  isLowStock: boolean
  createdAt: string
  updatedAt: string | null
}

export type OrderStatus = 'DRAFT' | 'CONFIRMED' | 'CANCELLED'

export interface SpringOrder {
  id: string
  customerId: string | null
  referenceNumber: string
  totalAmount: number
  paidAmount: number
  debtAmount: number
  status: OrderStatus
  notes: string | null
  itemCount: number
  items: SpringOrderItem[]
  createdAt: string
  updatedAt: string | null
}

export interface SpringOrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}
