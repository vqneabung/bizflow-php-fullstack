/**
 * api.ts — Ky HTTP client cho Laravel frontend (giống Next.js).
 *
 * Dùng để gọi Laravel backend từ Inertia pages.
 * Nếu cần gọi Spring Boot trực tiếp thì qua server-side (controller), không qua client.
 */
import ky from 'ky'

export const api = ky.create({
  prefix: '/api',
  timeout: 10000,
  retry: {
    limit: 2,
    methods: ['get', 'post'],
    statusCodes: [408, 413, 429],
  },
})
