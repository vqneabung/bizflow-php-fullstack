/**
 * Dashboard.tsx — Admin dashboard home.
 *
 * AdminLayout được áp dụng tự động từ app.tsx layout resolver.
 */
import { Head } from '@inertiajs/react'
import type {
  AdminUser,
  SpringOverview,
  RevenueReportResponse,
  BestSellingReportResponse,
  InventoryReportResponse,
  DebtReportResponse,
} from '@/types/admin'

interface Props {
  auth: { user: AdminUser }
  overview?: SpringOverview | null
  revenue?: RevenueReportResponse | null
  bestSelling?: BestSellingReportResponse | null
  inventory?: InventoryReportResponse | null
  debt?: DebtReportResponse | null
  totalUsers?: number | null
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(n)
}

function MaxRevenue({ points }: { points: RevenueReportResponse['points'] }): number {
  let max = 0
  for (const p of points) {
    if (p.revenue > max) {
      max = p.revenue
    }
  }
  return max
}

export default function AdminDashboard({
  auth,
  overview,
  revenue,
  bestSelling,
  inventory,
  debt,
  totalUsers,
}: Props) {
  const revenuePoints = revenue?.points ?? []
  const maxRevenue = MaxRevenue({ points: revenuePoints })

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

        <div className="bg-white rounded-lg border border-zinc-200 p-4 shadow-sm">
          <div className="flex items-end justify-between mb-4">
            <h3 className="text-lg font-semibold text-zinc-900">Doanh thu 30 ngày</h3>
            {revenue ? (
              <p className="text-xl font-bold text-zinc-900">
                {formatCurrency(revenue.total)}
              </p>
            ) : null}
          </div>

          {revenuePoints.length > 0 ? (
            <div className="flex h-40 items-end gap-1">
              {revenuePoints.map((p) => {
                const heightPct = maxRevenue > 0 ? Math.max(2, (p.revenue / maxRevenue) * 100) : 2
                return (
                  <div
                    key={p.date}
                    className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                    style={{ height: `${heightPct}%` }}
                    title={`${p.date}: ${formatCurrency(p.revenue)}`}
                  />
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">Không có dữ liệu</p>
          )}
        </div>

        <div className="bg-white rounded-lg border border-zinc-200 p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-zinc-900 mb-4">Sản phẩm bán chạy</h3>
          {bestSelling?.products && bestSelling.products.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-500 border-b border-zinc-200">
                  <th className="py-2 pr-2">#</th>
                  <th className="py-2 pr-2">Sản phẩm</th>
                  <th className="py-2 pr-2 text-right">Số lượng bán</th>
                  <th className="py-2 pr-2 text-right">Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {bestSelling.products.map((p, idx) => (
                  <tr key={p.productId} className="border-b border-zinc-100">
                    <td className="py-2 pr-2">{idx + 1}</td>
                    <td className="py-2 pr-2">{p.productName}</td>
                    <td className="py-2 pr-2 text-right">{formatNumber(p.quantitySold)}</td>
                    <td className="py-2 pr-2 text-right">{formatCurrency(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-zinc-500">Chưa có dữ liệu</p>
          )}
        </div>

        <div className="bg-white rounded-lg border border-zinc-200 p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-zinc-900 mb-4">Tồn kho</h3>
          {inventory ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="rounded-lg border border-zinc-200 p-4">
                  <p className="text-sm text-zinc-500">Tổng giá trị kho</p>
                  <p className="text-2xl font-bold text-zinc-900">{formatCurrency(inventory.totalValue)}</p>
                </div>
                <div className="rounded-lg border border-zinc-200 p-4">
                  <p className="text-sm text-zinc-500">Sản phẩm sắp hết</p>
                  <p className="text-2xl font-bold text-zinc-900">{inventory.lowStockProducts.length}</p>
                </div>
              </div>
              {inventory.lowStockProducts.length > 0 ? (
                <ul className="divide-y divide-zinc-100">
                  {inventory.lowStockProducts.slice(0, 5).map((p) => (
                    <li key={p.productId} className="py-2 flex items-center justify-between text-sm">
                      <span className="text-zinc-900">{p.productName}</span>
                      <span className="text-zinc-500">
                        Còn {formatNumber(p.stock)} / tối thiểu {formatNumber(p.minStock)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-zinc-500">Không có sản phẩm sắp hết</p>
              )}
            </>
          ) : (
            <p className="text-sm text-zinc-500">Không có dữ liệu</p>
          )}
        </div>

        <div className="bg-white rounded-lg border border-zinc-200 p-4 shadow-sm">
          <div className="flex items-end justify-between mb-4">
            <h3 className="text-lg font-semibold text-zinc-900">Công nợ khách hàng</h3>
            {debt ? (
              <p className="text-xl font-bold text-zinc-900">{formatCurrency(debt.totalDebt)}</p>
            ) : null}
          </div>
          {debt?.customers && debt.customers.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-500 border-b border-zinc-200">
                  <th className="py-2 pr-2">Khách hàng</th>
                  <th className="py-2 pr-2 text-right">Số đơn</th>
                  <th className="py-2 pr-2 text-right">Tổng nợ</th>
                </tr>
              </thead>
              <tbody>
                {debt.customers.slice(0, 5).map((c, idx) => (
                  <tr key={`${c.customerId ?? 'unknown'}-${idx}`} className="border-b border-zinc-100">
                    <td className="py-2 pr-2">{c.customerName}</td>
                    <td className="py-2 pr-2 text-right">{formatNumber(c.orderCount)}</td>
                    <td className="py-2 pr-2 text-right">{formatCurrency(c.totalDebt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-zinc-500">Không có dữ liệu</p>
          )}
        </div>
      </div>
    </>
  )
}
