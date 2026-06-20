/**
 * Products/Show.tsx — Product detail page.
 */
import { Head, Link } from '@inertiajs/react'
import type { SpringProduct } from '@/types/admin'

interface Props {
  product: SpringProduct | null
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        isActive ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-600'
      }`}
    >
      {isActive ? 'Active' : 'Inactive'}
    </span>
  )
}

export default function ProductShow({ product }: Props) {
  if (!product) {
    return (
      <>
        <Head title="Sản phẩm" />
        <div className="max-w-2xl space-y-6">
          <Link href="/admin/products" className="text-sm text-purple-600 hover:underline">
            ← Quay lại danh sách
          </Link>
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm text-center text-zinc-400">
            Không tìm thấy sản phẩm.
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head title={product.name} />

      <div className="max-w-3xl space-y-6">
        <Link href="/admin/products" className="text-sm text-purple-600 hover:underline">
          ← Quay lại danh sách
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-zinc-900">{product.name}</h2>
            <p className="mt-1 text-sm text-zinc-500">#{product.id}</p>
          </div>
          <StatusBadge isActive={product.isActive} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Thông tin cơ bản */}
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-medium text-zinc-900">Thông tin chung</h3>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-xs text-zinc-400">Tên</p>
                <p className="text-sm font-medium text-zinc-900">{product.name}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-400">Danh mục</p>
                <p className="text-sm font-medium text-zinc-900">{product.categoryName ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-400">Đơn vị tính</p>
                <p className="text-sm font-medium text-zinc-900">{product.primaryUnitName}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-400">Barcode</p>
                <p className="text-sm font-medium text-zinc-900">{product.barcode ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-400">Created at</p>
                <p className="text-sm font-medium text-zinc-900">{product.createdAt}</p>
              </div>
            </div>
          </div>

          {/* Giá & tồn kho */}
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-medium text-zinc-900">Giá & tồn kho</h3>

            <div>
              <p className="text-xs text-zinc-400">Giá bán</p>
              <p className="text-2xl font-bold text-zinc-900">{formatCurrency(product.price)}</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-xs text-zinc-400">Giá vốn</p>
                <p className="text-sm font-medium text-zinc-900">
                  {product.costPrice !== null ? formatCurrency(product.costPrice) : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-400">Tồn kho</p>
                <p className={`text-sm font-medium ${product.isLowStock ? 'text-red-600' : 'text-zinc-900'}`}>
                  {product.stock}
                  {product.isLowStock && (
                    <span className="ml-2 text-xs font-normal text-red-500">(sắp hết hàng)</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-400">Min stock</p>
                <p className="text-sm font-medium text-zinc-900">{product.minStock}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hình ảnh */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-900 mb-4">Hình ảnh</h3>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-48 w-full rounded-lg object-contain bg-zinc-50"
            />
          ) : (
            <div className="flex h-48 w-full items-center justify-center rounded-lg bg-zinc-100 text-zinc-400 text-sm">
              Không có hình ảnh
            </div>
          )}
        </div>
      </div>
    </>
  )
}
