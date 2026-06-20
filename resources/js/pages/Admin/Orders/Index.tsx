/**
 * Orders/Index.tsx — Admin order list (TanStack Table).
 */
import { Head, Link } from '@inertiajs/react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table';
import type { SortingState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import type { OrderStatus, SpringOrder } from '@/types/admin';

interface Props {
    orders: SpringOrder[];
    total: number;
    page: number;
    status: string | null;
}

const ORDER_STATUS_OPTIONS: { value: OrderStatus | ''; label: string }[] = [
    { value: '', label: 'Tất cả' },
    { value: 'DRAFT', label: 'DRAFT' },
    { value: 'CONFIRMED', label: 'CONFIRMED' },
    { value: 'CANCELLED', label: 'CANCELLED' },
];

function formatCurrency(n: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
}

function formatDate(value: string): string {
    return new Date(value).toLocaleString('vi-VN');
}

function StatusBadge({ status }: { status: OrderStatus }) {
    const classes = {
        DRAFT: 'bg-zinc-100 text-zinc-700',
        CONFIRMED: 'bg-green-100 text-green-700',
        CANCELLED: 'bg-red-100 text-red-700',
    };

    return (
        <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${classes[status]}`}
        >
            {status}
        </span>
    );
}

export default function OrderIndex({ orders, total, page, status }: Props) {
    const [sorting, setSorting] = useState<SortingState>([]);

    const columnHelper = createColumnHelper<SpringOrder>();

    const columns = useMemo(
        () => [
            columnHelper.accessor('referenceNumber', {
                header: 'Mã đơn',
                cell: (info) => (
                    <Link
                        href={`/admin/orders/${info.row.original.id}`}
                        className="font-medium text-purple-600 hover:underline"
                    >
                        {info.getValue()}
                    </Link>
                ),
            }),
            columnHelper.accessor('createdAt', {
                header: 'Ngày tạo',
                cell: (info) => formatDate(info.getValue()),
            }),
            columnHelper.accessor('totalAmount', {
                header: 'Tổng tiền',
                cell: (info) => formatCurrency(info.getValue()),
            }),
            columnHelper.display({
                id: 'payment',
                header: 'Đã trả / Còn nợ',
                cell: (info) => {
                    const order = info.row.original;
                    return (
                        <span className="text-sm text-zinc-700">
                            {formatCurrency(order.paidAmount)} /{' '}
                            <span className="text-red-600">{formatCurrency(order.debtAmount)}</span>
                        </span>
                    );
                },
            }),
            columnHelper.accessor('itemCount', {
                header: 'Số SP',
                cell: (info) => info.getValue(),
            }),
            columnHelper.accessor('status', {
                header: 'Trạng thái',
                cell: (info) => <StatusBadge status={info.getValue()} />,
            }),
            columnHelper.display({
                id: 'actions',
                header: 'Thao tác',
                cell: (info) => {
                    const order = info.row.original;
                    return (
                        <Link
                            href={`/admin/orders/${order.id}`}
                            className="text-purple-600 hover:underline text-sm font-medium"
                        >
                            Xem
                        </Link>
                    );
                },
            }),
        ],
        [columnHelper],
    );

    const table = useReactTable({
        data: orders ?? [],
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const totalPages = Math.max(1, Math.ceil((total ?? 0) / 20));

    return (
        <>
            <Head title="Đơn hàng" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-zinc-900">Đơn hàng</h2>
                        <p className="mt-1 text-sm text-zinc-500">
                            Tổng: {total ?? 0} đơn hàng
                        </p>
                    </div>

                    <form method="GET" action="/admin/orders" className="flex items-center gap-2">
                        <select
                            name="status"
                            defaultValue={status ?? ''}
                            className="w-full sm:w-48 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        >
                            {ORDER_STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                        >
                            Lọc
                        </button>
                    </form>
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
                                {(orders ?? []).length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-6 py-12 text-center text-zinc-400"
                                        >
                                            Không tìm thấy đơn hàng. Kiểm tra Spring Boot đã chạy và kết nối được.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between border-t border-zinc-200 px-6 py-3">
                        <Link
                            href={`/admin/orders?page=${Math.max(1, page - 1)}${status ? `&status=${encodeURIComponent(status)}` : ''}`}
                            className={`text-sm font-medium ${page <= 1 ? 'pointer-events-none text-zinc-400' : 'text-purple-600 hover:underline'}`}
                        >
                            ← Trang trước
                        </Link>
                        <span className="text-sm text-zinc-600">Trang {page} / {totalPages}</span>
                        <Link
                            href={`/admin/orders?page=${page + 1}${status ? `&status=${encodeURIComponent(status)}` : ''}`}
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
