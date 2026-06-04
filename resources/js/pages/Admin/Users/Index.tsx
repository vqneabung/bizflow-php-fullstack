/**
 * Users/Index.tsx — Admin user list (TanStack Table).
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
import { useState, useMemo } from 'react';
import type { SpringUser } from '@/types/admin';

interface Props {
    users: SpringUser[];
}

export default function UserIndex({ users }: Props) {
    const [sorting, setSorting] = useState<SortingState>([]);

    const columnHelper = createColumnHelper<SpringUser>();

    const columns = useMemo(
        () => [
            columnHelper.accessor('id', {
                header: 'ID',
                cell: (info) => (
                    <span className="text-zinc-500">#{info.getValue()}</span>
                ),
            }),
            columnHelper.accessor('email', {
                header: 'Email',
                cell: (info) => (
                    <Link
                        href={`/admin/users/${info.row.original.id}`}
                        className="font-medium text-purple-600 hover:underline"
                    >
                        {info.getValue()}
                    </Link>
                ),
            }),
            columnHelper.accessor('name', {
                header: 'Name',
                cell: (info) => info.getValue() ?? '—',
            }),
            columnHelper.accessor('role', {
                header: 'Role',
                cell: (info) => (
                    <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            info.getValue() === 'ADMIN'
                                ? 'bg-amber-100 text-amber-700'
                                : info.getValue() === 'OWNER'
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-blue-100 text-blue-700'
                        }`}
                    >
                        {info.getValue()}
                    </span>
                ),
            }),
        ],
        [columnHelper],
    );

    const table = useReactTable({
        data: users ?? [],
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <>
            <Head title="Users" />

            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                <div className="border-b border-zinc-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-zinc-900">
                        Users
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">
                        All registered users from the platform.
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
                            {(users ?? []).length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-6 py-12 text-center text-zinc-400"
                                    >
                                        No users found. Make sure Spring Boot is
                                        running and accessible.
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
