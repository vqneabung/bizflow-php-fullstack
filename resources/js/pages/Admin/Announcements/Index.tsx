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
import type { Announcement } from '@/types/admin';

interface Props {
    announcements: Announcement[];
}

const audienceLabels: Record<string, string> = {
    all: 'Tất cả',
    owners: 'Chủ hộ kinh doanh',
    employees: 'Nhân viên',
};

const priorityConfig: Record<string, { label: string; class: string }> = {
    normal: { label: 'Thường', class: 'bg-zinc-100 text-zinc-600' },
    high: { label: 'Cao', class: 'bg-amber-100 text-amber-700' },
    urgent: { label: 'Khẩn cấp', class: 'bg-red-100 text-red-700' },
};

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

export default function AnnouncementIndex({ announcements }: Props) {
    const [sorting, setSorting] = useState<SortingState>([]);

    const columnHelper = createColumnHelper<Announcement>();

    const columns = useMemo(
        () => [
            columnHelper.accessor('title', {
                header: 'Tiêu đề',
                cell: (info) => (
                    <span className="font-medium text-zinc-900">
                        {info.getValue()}
                    </span>
                ),
            }),
            columnHelper.accessor('audience', {
                header: 'Đối tượng',
                cell: (info) => {
                    const val = info.getValue();
                    return (
                        <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                            {audienceLabels[val] ?? val}
                        </span>
                    );
                },
            }),
            columnHelper.accessor('priority', {
                header: 'Độ ưu tiên',
                cell: (info) => {
                    const val = info.getValue();
                    const cfg = priorityConfig[val] ?? { label: val, class: 'bg-zinc-100 text-zinc-600' };
                    return (
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cfg.class}`}>
                            {cfg.label}
                        </span>
                    );
                },
            }),
            columnHelper.accessor('isPublished', {
                header: 'Tình trạng',
                cell: (info) => {
                    const published = info.getValue();
                    return (
                        <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                published
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-zinc-100 text-zinc-500'
                            }`}
                        >
                            {published ? 'Đã gửi' : 'Bản nháp'}
                        </span>
                    );
                },
            }),
            columnHelper.accessor('createdAt', {
                header: 'Ngày tạo',
                cell: (info) => (
                    <span className="text-xs text-zinc-500">
                        {formatDate(info.getValue() ?? '')}
                    </span>
                ),
            }),
            columnHelper.display({
                id: 'actions',
                header: 'Thao tác',
                cell: (info) => {
                    const item = info.row.original;
                    return (
                        <div className="flex items-center gap-3">
                            <Link
                                href={`/admin/announcements/${item.id}/edit`}
                                className="text-amber-600 hover:underline text-sm font-medium"
                            >
                                Sửa
                            </Link>
                            <button
                                type="button"
                                onClick={() => {
                                    if (confirm('Bạn có chắc muốn xóa thông báo này?')) {
                                        router.delete(`/admin/announcements/${item.id}`);
                                    }
                                }}
                                className="text-red-600 hover:underline text-sm font-medium"
                            >
                                Xóa
                            </button>
                        </div>
                    );
                },
            }),
        ],
        [columnHelper],
    );

    const table = useReactTable({
        data: announcements ?? [],
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <>
            <Head title="Thông báo hệ thống" />

            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-zinc-900">
                            Thông báo hệ thống
                        </h2>
                        <p className="mt-1 text-sm text-zinc-500">
                            Quản lý thông báo gửi đến người dùng.
                        </p>
                    </div>
                    <Link
                        href="/admin/announcements/create"
                        className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                    >
                        Tạo thông báo mới
                    </Link>
                </div>

                <div className="flex items-center gap-2 border-b border-zinc-100 px-6 py-3">
                    {[
                        { key: '', label: 'Tất cả' },
                        { key: 'published', label: 'Đã gửi' },
                        { key: 'draft', label: 'Bản nháp' },
                    ].map((tab) => {
                        const isActive =
                            (tab.key === '' && !new URL(window.location.href).searchParams.get('status')) ||
                            new URL(window.location.href).searchParams.get('status') === tab.key;
                        return (
                            <Link
                                key={tab.key}
                                href={tab.key ? `/admin/announcements?status=${tab.key}` : '/admin/announcements'}
                                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'text-zinc-500 hover:bg-zinc-100'
                                }`}
                            >
                                {tab.label}
                            </Link>
                        );
                    })}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className="border-b border-zinc-100 bg-zinc-50">
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-6 py-3 text-left font-medium text-zinc-600"
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
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
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {(announcements ?? []).length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-400">
                                        Chưa có thông báo nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="border-t border-zinc-100 px-6 py-3 text-xs text-zinc-500">
                    Tổng cộng {announcements.length} thông báo
                </div>
            </div>
        </>
    );
}
