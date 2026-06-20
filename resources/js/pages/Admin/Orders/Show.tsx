/**
 * Orders/Show.tsx — Order detail page.
 */
import { Head, Link, router } from '@inertiajs/react'
import type { OrderStatus, SpringOrder } from '@/types/admin'

interface Props {
  order: SpringOrder | null
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString('vi-VN')
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const classes = {
    DRAFT: 'bg-zinc-100 text-zinc-700',
    CONFIRMED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${classes[status]}`}
    >
      {status}
    </span>
  )
}

function isCancellable(status: OrderStatus): boolean {
  return status === 'DRAFT' || status === 'CONFIRMED'
}

export default function OrderShow({ order }: Props) {
  const handleCancel = () => {
    if (!order) return
    if (!confirm('Hủy đơn hàng này? Hành động không thể hoàn tác.')) return
    router.patch(`/admin/orders/${order.id}/cancel`)
  }

  if (!order) {
    return (
      <>
        <Head title="Đơn hàng" />
        <div className="max-w-2xl space-y-6">
          <Link href="/admin/orders" className="text-sm text-purple-600 hover:underline">
            ← Quay lại danh sách
          </Link>
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm text-center text-zinc-400">
            Không tìm thấy đơn hàng.
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head title={`Đơn ${order.referenceNumber}`} />

      <div className="max-w-4xl space-y-6">
        <Link href="/admin/orders" className="text-sm text-purple-600 hover:underline">
          ← Quay lại danh sách
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-zinc-900">
              Đơn hàng {order.referenceNumber}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">#{order.id}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />
            {isCancellable(order.status) && (
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
              >
                Hủy đơn
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-medium text-zinc-900">Thông tin chung</h3>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-xs text-zinc-400">Mã đơn</p>
                <p className="text-sm font-medium text-zinc-900">{order.referenceNumber}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-400">Ngày tạo</p>
                <p className="text-sm font-medium text-zinc-900">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-400">Khách hàng</p>
                <p className="text-sm font-medium text-zinc-900">{order.customerId ?? '—'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-medium text-zinc-900">Thanh toán</h3>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-xs text-zinc-400">Tổng tiền</p>
                <p className="text-2xl font-bold text-zinc-900">{formatCurrency(order.totalAmount)}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-zinc-400">Đã trả</p>
                  <p className="text-sm font-medium text-zinc-900">{formatCurrency(order.paidAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Còn nợ</p>
                  <p className="text-sm font-medium text-red-600">{formatCurrency(order.debtAmount)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-900 mb-4">
            Sản phẩm ({order.itemCount})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50">
                  <th className="px-4 py-3 text-left font-medium text-zinc-600">Tên SP</th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-600">Số lượng</th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-600">Đơn giá</th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-600">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {(order.items ?? []).map((item) => (
                  <tr key={item.id} className="border-b border-zinc-100">
                    <td className="px-4 py-3 font-medium text-zinc-900">{item.productName}</td>
                    <td className="px-4 py-3 text-zinc-700">{item.quantity}</td>
                    <td className="px-4 py-3 text-zinc-700">{formatCurrency(item.unitPrice)}</td>
                    <td className="px-4 py-3 text-zinc-700">{formatCurrency(item.subtotal)}</td>
                  </tr>
                ))}
                {(order.items ?? []).length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-zinc-400">
                      Không có sản phẩm trong đơn hàng.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {order.notes && (
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <h3 className="text-sm font-medium text-zinc-900 mb-2">Ghi chú</h3>
            <p className="text-sm text-zinc-700 whitespace-pre-wrap">{order.notes}</p>
          </div>
        )}
      </div>
    </>
  )
}
