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
import type { ReportTemplate } from '@/types/admin';

interface Props {
    templates: ReportTemplate[];
}

function formatDate(dateString: string): string {
    const d = new Date(dateString);
    return d.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function ReportTemplateIndex({ templates }: Props) {
    const [sorting, setSorting] = useState<SortingState>([]);

    const columnHelper = createColumnHelper<ReportTemplate>();

    const columns = useMemo(
        () => [
            columnHelper.accessor('name', {
                header: 'Tên báo cáo',
                cell: (info) => (
                    <span className="font-medium text-zinc-900">
                        {info.getValue()}
                    </span>
                ),
            }),
            columnHelper.accessor('code', {
                header: 'Mã',
                cell: (info) => (
                    <code className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                        {info.getValue()}
                    </code>
                ),
            }),
            columnHelper.accessor('circularRef', {
                header: 'Thông tư',
                cell: (info) => (
                    <span className="text-zinc-500">{info.getValue()}</span>
                ),
            }),
            columnHelper.accessor('version', {
                header: 'Version',
                cell: (info) => (
                    <span className="text-zinc-500">v{info.getValue()}</span>
                ),
            }),
            columnHelper.accessor('updatedAt', {
                header: 'Cập nhật lần cuối',
                cell: (info) => (
                    <span className="text-zinc-500 text-xs">
                        {formatDate(info.getValue() ?? '')}
                    </span>
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
                            {active ? 'Đang dùng' : 'Ngừng dùng'}
                        </span>
                    );
                },
            }),
            columnHelper.display({
                id: 'actions',
                header: 'Thao tác',
                cell: (info) => {
                    const template = info.row.original;
                    return (
                        <div className="flex items-center gap-3">
                            <Link
                                href={`/admin/report-templates/${template.id}`}
                                className="text-purple-600 hover:underline text-sm font-medium"
                            >
                                Xem
                            </Link>
                            <Link
                                href={`/admin/report-templates/${template.id}/edit`}
                                className="text-amber-600 hover:underline text-sm font-medium"
                            >
                                Sửa
                            </Link>
                        </div>
                    );
                },
            }),
        ],
        [columnHelper],
    );

    const table = useReactTable({
        data: templates ?? [],
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <>
            <Head title="Mẫu báo cáo tài chính" />

            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                <div className="border-b border-zinc-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-zinc-900">
                        Mẫu báo cáo tài chính
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">
                        Quản lý các mẫu báo cáo theo Thông tư 88/2021/TT-BTC.
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
                            {(templates ?? []).length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-12 text-center text-zinc-400"
                                    >
                                        Chưa có mẫu báo cáo nào.
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
