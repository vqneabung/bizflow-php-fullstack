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
  primaryUnitId: string
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

export interface SubscriptionPlan {
  id: string
  name: string
  slug: string
  monthlyPrice: number
  annualPrice: number
  currency: string
  features: string[]
  isActive: boolean
  sortOrder: number
}

export interface ReportTemplateField {
  key: string
  label: string
  type: 'text' | 'number' | 'date' | 'boolean'
  width: number | null
  alignment: 'left' | 'center' | 'right' | null
}

export interface ReportTemplate {
  id: string
  name: string
  code: string
  description: string | null
  circularRef: string
  version: string
  fields: ReportTemplateField[]
  isActive: boolean
  lastUpdatedBy: string | null
  createdAt: string | null
  updatedAt: string | null
}

export interface Announcement {
  id: string
  title: string
  message: string
  audience: 'all' | 'owners' | 'employees'
  priority: 'normal' | 'high' | 'urgent'
  isPublished: boolean
  publishedAt: string | null
  expiresAt: string | null
  createdBy: string | null
  createdAt: string | null
  updatedAt: string | null
}

export interface RevenueDailyPoint {
  date: string
  revenue: number
}

export interface RevenueReportResponse {
  points: RevenueDailyPoint[]
  total: number
  periodStart: string
  periodEnd: string
}

export interface BestSellingProduct {
  productId: string
  productName: string
  quantitySold: number
  revenue: number
}

export interface BestSellingReportResponse {
  products: BestSellingProduct[]
}

export interface LowStockProduct {
  productId: string
  productName: string
  stock: number
  minStock: number
}

export interface CategoryCount {
  categoryName: string | null
  count: number
}

export interface InventoryReportResponse {
  totalProducts: number
  totalValue: number
  lowStockProducts: LowStockProduct[]
  byCategory: CategoryCount[]
}

export interface CustomerDebt {
  customerId: string | null
  customerName: string
  totalDebt: number
  orderCount: number
}

export interface DebtReportResponse {
  totalDebt: number
  customers: CustomerDebt[]
}

export interface CreateOrderItemFormData {
  product_id: string
  quantity: number
  unit_price: number
}

export interface CreateOrderFormData {
  status: 'DRAFT' | 'CONFIRMED'
  customer_id: string | null
  notes: string
  items: CreateOrderItemFormData[]
}

export interface CategoryOption {
  id: string
  name: string
  description?: string | null
}

export interface UnitOption {
  id: string
  name: string
  description?: string | null
}
