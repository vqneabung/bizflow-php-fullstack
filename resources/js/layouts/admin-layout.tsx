/**
 * AdminLayout.tsx — Layout cho admin dashboard (sidebar + header).
 *
 * Dùng chung style với Next.js dashboard nhưng với Inertia + React.
 *
 * Lưu ý: Không dùng 'use client' — Inertia React components mặc định
 * chạy ở client, không cần directive này (khác với Next.js).
 * Dùng usePage().url để lấy pathname thay vì window.location.
 */
import { Link, usePage } from '@inertiajs/react'
import { Toaster } from '@/components/ui/sonner'
import type { AdminUser } from '@/types/admin'

const navItems = [
  { key: 'dashboard', href: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { key: 'users', href: '/admin/users', icon: '👥', label: 'Users' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const page = usePage<{ auth: { user: AdminUser }; csrf_token: string }>()
  const { auth, csrf_token } = page.props
  const currentPath = page.url

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-zinc-900 text-white">
        <div className="flex items-center gap-2 h-16 px-6 border-b border-zinc-700">
          <span className="text-2xl">🏪</span>
          <span className="text-lg font-bold tracking-tight">Bizflow Admin</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentPath === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  isActive ? 'bg-purple-600 text-white' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="px-6 py-4 border-t border-zinc-700 text-xs text-zinc-500">
          Bizflow Admin v0.1.0
        </div>
      </aside>

      {/* Main */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-10 bg-white border-b border-zinc-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <h1 className="text-lg font-semibold text-zinc-900">Admin Panel</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-zinc-500">{auth?.user?.name ?? 'Admin'}</span>
              <form method="POST" action="/logout">
                <input type="hidden" name="_token" value={csrf_token} />
                <button type="submit" className="text-sm text-zinc-500 hover:text-red-600 transition-colors">
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      <Toaster />
    </div>
  )
}
