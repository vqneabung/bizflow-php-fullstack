/**
 * Users/Edit.tsx — Edit user form (name + role).
 */
import { Head, Link, router } from '@inertiajs/react'
import type { SpringUser } from '@/types/admin'
import { useState } from 'react'

interface Props {
  user: SpringUser | null
  errors?: Record<string, string>
}

export default function UserEdit({ user, errors }: Props) {
  const [name, setName] = useState(user?.name ?? '')
  const [role, setRole] = useState(user?.role ?? 'USER')
  const [submitting, setSubmitting] = useState(false)

  if (!user) {
    return (
      <>
        <Head title="Edit User" />
        <div className="max-w-2xl space-y-6">
          <Link href="/admin/users" className="text-sm text-purple-600 hover:underline">
            &larr; Back to Users
          </Link>
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm text-center text-zinc-400">
            User not found.
          </div>
        </div>
      </>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    router.put(`/admin/users/${user.id}`, { name, role }, {
      onFinish: () => setSubmitting(false),
    })
  }

  return (
    <>
      <Head title={`Edit User #${user.id}`} />

      <div className="max-w-2xl space-y-6">
        <Link href={`/admin/users/${user.id}`} className="text-sm text-purple-600 hover:underline">
          &larr; Back to User
        </Link>

        <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900 mb-6">
            Edit User #{user.id}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-500"
              />
              <p className="mt-1 text-xs text-zinc-400">Email cannot be changed.</p>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
              {errors?.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-zinc-700 mb-1">
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              {errors?.role && (
                <p className="mt-1 text-xs text-red-600">{errors.role}</p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
              <Link
                href={`/admin/users/${user.id}`}
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
