/**
 * Users/Show.tsx — User detail page.
 */
import { Head, Link } from '@inertiajs/react'
import type { SpringUser, AdminUser } from '@/types/admin'

interface Props {
  auth: { user: AdminUser }
  user: SpringUser | null
}

export default function UserShow({ auth, user }: Props) {
  return (
    <>
      <Head title={user ? `User #${user.id}` : 'User'} />

      <div className="max-w-2xl space-y-6">
        <Link href="/admin/users" className="text-sm text-purple-600 hover:underline">
          &larr; Back to Users
        </Link>

        {user ? (
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {(user.name ?? user.email).charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-zinc-900">{user.name ?? 'No name'}</h2>
                <p className="text-sm text-zinc-500">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-100">
              <div>
                <p className="text-xs text-zinc-400">ID</p>
                <p className="text-sm font-medium text-zinc-900">#{user.id}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-400">Role</p>
                <p className="text-sm font-medium text-zinc-900">{user.role}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-400">Phone</p>
                <p className="text-sm font-medium text-zinc-900">{user.phone ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-400">Store</p>
                <p className="text-sm font-medium text-zinc-900">{user.storeName ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-400">Created At</p>
                <p className="text-sm font-medium text-zinc-900">{user.createdAt ?? '—'}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm text-center text-zinc-400">
            User not found.
          </div>
        )}
      </div>
    </>
  )
}
