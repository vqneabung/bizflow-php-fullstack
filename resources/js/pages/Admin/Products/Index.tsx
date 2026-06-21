/**
 * Products/Index.tsx — Admin product list (TanStack Table).
 */
import { Head, Link, router } from '@inertiajs/react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table';
import type { SortingState } from '@tanstack/react-table';
import { useState, useMemo } from 'react';
import type { SpringProduct } from '@/types/admin';

interface Props {
    products: SpringProduct[];
    total: number;
    page: number;
    search: string | null;
}

function formatCurrency(n: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
}

export default function ProductIndex({ products, total, page, search }: Props) {
    const [sorting, setSorting] = useState<SortingState>([]);

    const columnHelper = createColumnHelper<SpringProduct>();

    const columns = useMemo(
        () => [
            columnHelper.accessor('name', {
                header: 'Tên',
                cell: (info) => (
                    <Link
                        href={`/admin/products/${info.row.original.id}`}
                        className="font-medium text-purple-600 hover:underline"
                    >
                        {info.getValue()}
                    </Link>
                ),
            }),
            columnHelper.accessor('categoryName', {
                header: 'Danh mục',
                cell: (info) => info.getValue() ?? '—',
            }),
            columnHelper.accessor('price', {
                header: 'Giá bán',
                cell: (info) => formatCurrency(info.getValue()),
            }),
            columnHelper.accessor('stock', {
                header: 'Tồn kho',
                cell: (info) => {
                    const product = info.row.original;
                    return (
                        <span className={product.isLowStock ? 'font-medium text-red-600' : ''}>
                            {info.getValue()}
                        </span>
                    );
                },
            }),
            columnHelper.accessor('isActive', {
                header: 'Trạng thái',
                cell: (info) => {
                    const isActive = info.getValue();
                    return (
                        <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                isActive
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-zinc-100 text-zinc-600'
                            }`}
                        >
                            {isActive ? 'Active' : 'Inactive'}
                        </span>
                    );
                },
            }),
            columnHelper.display({
                id: 'actions',
                header: 'Thao tác',
                cell: (info) => {
                    const product = info.row.original;
                    const handleDeactivate = (): void => {
                        if (confirm(`Tạm ngưng sản phẩm "${product.name}"?`)) {
                            router.patch(`/admin/products/${product.id}/deactivate`);
                        }
                    };
                    return (
                        <div className="flex items-center gap-3">
                            <Link
                                href={`/admin/products/${product.id}`}
                                className="text-purple-600 hover:underline text-sm font-medium"
                            >
                                Xem
                            </Link>
                            <Link
                                href={`/admin/products/${product.id}/edit`}
                                className="text-purple-600 hover:underline text-sm font-medium"
                            >
                                Sửa
                            </Link>
                            {product.isActive && (
                                <button
                                    type="button"
                                    onClick={handleDeactivate}
                                    className="text-red-600 hover:underline text-sm font-medium"
                                >
                                    Tạm ngưng
                                </button>
                            )}
                        </div>
                    );
                },
            }),
        ],
        [columnHelper],
    );

    const table = useReactTable({
        data: products ?? [],
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const totalPages = Math.max(1, Math.ceil((total ?? 0) / 20));

    return (
        <>
            <Head title="Sản phẩm" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-zinc-900">Sản phẩm</h2>
                        <p className="mt-1 text-sm text-zinc-500">
                            Tổng: {total ?? 0} sản phẩm
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <form method="GET" action="/admin/products" className="flex items-center gap-2">
                            <input
                                type="text"
                                name="search"
                                defaultValue={search ?? ''}
                                placeholder="Tìm kiếm sản phẩm..."
                                className="w-full sm:w-72 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                            />
                            <button
                                type="submit"
                                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                            >
                                Tìm
                            </button>
                        </form>
                        <Link
                            href="/admin/products/create"
                            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                        >
                            Tạo sản phẩm
                        </Link>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr
                                        key={headerGroup.id}
                                        className="border-b border-zinc-100 bg-zinc-50"
                                    >
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                className="px-6 py-3 text-left font-medium text-zinc-600"
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext(),
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {table.getRowModel().rows.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="border-b border-zinc-100 transition-colors hover:bg-zinc-50"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="px-6 py-3">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                {(products ?? []).length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-12 text-center text-zinc-400"
                                        >
                                            Không tìm thấy sản phẩm. Kiểm tra Spring Boot đã chạy và kết nối được.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between border-t border-zinc-200 px-6 py-3">
                        <Link
                            href={`/admin/products?page=${Math.max(1, page - 1)}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
                            className={`text-sm font-medium ${page <= 1 ? 'pointer-events-none text-zinc-400' : 'text-purple-600 hover:underline'}`}
                        >
                            ← Trang trước
                        </Link>
                        <span className="text-sm text-zinc-600">Trang {page} / {totalPages}</span>
                        <Link
                            href={`/admin/products?page=${page + 1}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
                            className={`text-sm font-medium ${page >= totalPages ? 'pointer-events-none text-zinc-400' : 'text-purple-600 hover:underline'}`}
                        >
                            Trang sau →
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
