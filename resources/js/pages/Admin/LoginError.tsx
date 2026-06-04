/**
 * LoginError.tsx — Hiển thị lỗi khi OIDC callback fail (role check, exchange, etc.).
 *
 * Xuất hiện khi callback redirect về /login?error=...
 * Thay vì auto-redirect OIDC (gây loop), render page với thông báo lỗi + nút retry.
 *
 * app.tsx layout resolver tự động wrap AdminLayout → không cần trong component này.
 */
import { Head } from '@inertiajs/react'

interface Props {
  error: string
  reason?: string
  role?: string
  email?: string
}

export default function LoginError({ error, reason, role, email }: Props) {
  return (
    <>
      <Head title="Authentication Error" />

      <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          {/* Error icon */}
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          <h1 className="text-xl font-bold text-zinc-900 mb-2">Access Denied</h1>
          <p className="text-zinc-600 mb-4">{error}</p>

          {reason && (
            <p className="text-xs text-zinc-400 font-mono bg-zinc-100 rounded px-2 py-1 mb-4 break-all">
              {reason}
            </p>
          )}

          {email && role && (
            <div className="bg-zinc-50 rounded-lg px-4 py-3 mb-6 text-sm text-zinc-500">
              <p>Logged in as: <span className="font-medium text-zinc-700">{email}</span></p>
              <p>Role: <span className="font-medium text-zinc-700">{role}</span></p>
            </div>
          )}

          <a
            href="/login"
            className="inline-flex items-center justify-center w-full px-6 py-3 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors"
          >
            Try Again
          </a>
        </div>
      </div>
    </>
  )
}
