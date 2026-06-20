/**
 * Dashboard.tsx — Admin dashboard home.
 *
 * AdminLayout được áp dụng tự động từ app.tsx layout resolver.
 */
import { Head } from '@inertiajs/react'
import type { AdminUser, SpringOverview } from '@/types/admin'

interface Props {
  auth: { user: AdminUser }
  overview?: SpringOverview | null
  totalUsers?: number | null
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}

export default function AdminDashboard({ auth, overview, totalUsers }: Props) {
  return (
    <>
      <Head title="Dashboard" />

      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-zinc-900 mb-2">
            Welcome, {auth.user.name}
          </h2>
          <p className="text-sm text-zinc-500">
            Email: {auth.user.email} &middot; Role: {auth.user.role}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Tổng người dùng', value: totalUsers ?? '—', icon: '👥' },
            { label: 'Khách hàng', value: overview?.totalCustomers ?? '—', icon: '🏪' },
            { label: 'Doanh thu tháng', value: overview?.revenueThisMonth != null ? formatCurrency(overview.revenueThisMonth) : '—', icon: '💰' },
            { label: 'Đơn hàng tháng', value: overview?.ordersThisMonth ?? '—', icon: '📊' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-zinc-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
                </div>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
