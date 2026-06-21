import { Head, Link } from '@inertiajs/react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table';
import type { SortingState } from '@tanstack/react-table';
import { useState, useMemo } from 'react';
import type { SubscriptionPlan } from '@/types/admin';

interface Props {
    plans: SubscriptionPlan[];
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
}

export default function SubscriptionIndex({ plans }: Props) {
    const [sorting, setSorting] = useState<SortingState>([]);

    const columnHelper = createColumnHelper<SubscriptionPlan>();

    const columns = useMemo(
        () => [
            columnHelper.accessor('name', {
                header: 'Tên gói',
                cell: (info) => (
                    <span className="font-medium text-zinc-900">
                        {info.getValue()}
                    </span>
                ),
            }),
            columnHelper.accessor('monthlyPrice', {
                header: 'Giá tháng',
                cell: (info) => formatCurrency(info.getValue()),
            }),
            columnHelper.accessor('annualPrice', {
                header: 'Giá năm',
                cell: (info) => formatCurrency(info.getValue()),
            }),
            columnHelper.accessor('currency', {
                header: 'Tiền tệ',
                cell: (info) => (
                    <span className="text-zinc-500">{info.getValue()}</span>
                ),
            }),
            columnHelper.accessor('isActive', {
                header: 'Tình trạng',
                cell: (info) => {
                    const active = info.getValue();
                    return (
                        <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                active
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                            }`}
                        >
                            {active ? 'Hoạt động' : 'Tạm khóa'}
                        </span>
                    );
                },
            }),
            columnHelper.display({
                id: 'actions',
                header: 'Thao tác',
                cell: (info) => {
                    const plan = info.row.original;
                    return (
                        <Link
                            href={`/admin/subscriptions/${plan.id}/edit`}
                            className="text-amber-600 hover:underline text-sm font-medium"
                        >
                            Sửa
                        </Link>
                    );
                },
            }),
        ],
        [columnHelper],
    );

    const table = useReactTable({
        data: plans ?? [],
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <>
            <Head title="Gói đăng ký" />

            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                <div className="border-b border-zinc-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-zinc-900">
                        Gói đăng ký
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">
                        Quản lý các gói đăng ký cho cửa hàng.
                    </p>
                </div>

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
                            {(plans ?? []).length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-12 text-center text-zinc-400"
                                    >
                                        Chưa có gói đăng ký nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
