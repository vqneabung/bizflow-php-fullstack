<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * AdminMiddleware — Kiểm tra admin đã login qua Spring Boot OIDC.
 *
 * Kiểm tra session có admin_jwt không.
 * Nếu không có → redirect về /admin/login (OIDC flow).
 */
class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! session()->has('admin_jwt')) {
            return redirect()->route('admin.login');
        }

        return $next($request);
    }
}
