/**
 * Users/Index.tsx — Admin user list (TanStack Table).
 */
import { useState } from 'react'
import { Head, Link } from '@inertiajs/react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table'
import type { SpringUser, AdminUser } from '@/types/admin'

interface Props {
  auth: { user: AdminUser }
  users: SpringUser[]
}

export default function UserIndex({ auth, users }: Props) {
  const [sorting, setSorting] = useState<SortingState>([])

  const columnHelper = createColumnHelper<SpringUser>()

  const columns = useMemo(() => [
    columnHelper.accessor('id', {
      header: 'ID',
      cell: (info) => <span className="text-zinc-500">#{info.getValue()}</span>,
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: (info) => (
        <Link href={`/admin/users/${info.row.original.id}`} className="text-purple-600 hover:underline font-medium">
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
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
          info.getValue() === 'ADMIN'
            ? 'bg-amber-100 text-amber-700'
            : info.getValue() === 'OWNER'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-blue-100 text-blue-700'
        }`}>
          {info.getValue()}
        </span>
      ),
    }),
  ], [columnHelper])

  const table = useReactTable({
    data: users ?? [],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <>
      <Head title="Users" />

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200">
          <h2 className="text-lg font-semibold text-zinc-900">Users</h2>
          <p className="text-sm text-zinc-500 mt-1">All registered users from the platform.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-zinc-100 bg-zinc-50">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-6 py-3 text-left font-medium text-zinc-600">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              {(users ?? []).length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-400">
                    No users found. Make sure Spring Boot is running and accessible.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
