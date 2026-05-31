/**
 * Dashboard.tsx — Admin dashboard home.
 *
 * AdminLayout được áp dụng tự động từ app.tsx layout resolver.
 */
import { Head } from '@inertiajs/react'
import type { AdminUser } from '@/types/admin'

interface Props {
  auth: { user: AdminUser }
}

export default function AdminDashboard({ auth }: Props) {
  return (
    <>
      <Head title="Dashboard" />

      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-zinc-900 mb-2">
            Welcome, {auth.user.name}
          </h2>
          <p className="text-sm text-zinc-500">
            Email: {auth.user.email} &middot; Role: {auth.user.role}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: '—', icon: '👥' },
            { label: 'Active Stores', value: '—', icon: '🏪' },
            { label: 'Revenue', value: '—', icon: '💰' },
            { label: 'Reports', value: '—', icon: '📊' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-zinc-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
                </div>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
