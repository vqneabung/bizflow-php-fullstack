<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Services\SpringOAuthService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

/**
 * AuthController — Xử lý OIDC login flow cho admin.
 *
 * Routes:
 * - GET /admin/login      → Tạo PKCE + redirect Spring Boot OIDC
 * - GET /admin/callback   → Nhận code → exchange → lưu JWT → dashboard
 */
class AuthController extends Controller
{
    public function __construct(
        private SpringOAuthService $oauth
    ) {}

    /**
     * Bước 1: Tạo PKCE params + redirect đến Spring Boot /oauth2/authorize.
     *
     * Nếu có query param `?error=` (từ callback khi role check fail) → render error page
     * thay vì auto-redirect (tránh loop vô hạn).
     */
    public function login(Request $request): RedirectResponse|Response
    {
        // Nếu callback trả về lỗi → render error page, không loop
        $error = $request->query('error');
        if ($error) {
            $reason = $request->query('reason');

            return Inertia::render('Admin/LoginError', [
                'error' => match ($error) {
                    'access_denied' => __('messages.auth.access_denied'),
                    'missing_code' => __('messages.auth.missing_code'),
                    'exchange_failed' => __('messages.auth.exchange_failed'),
                    default => __('messages.auth.auth_failed'),
                },
                'reason' => $reason,
                'role' => $request->query('role'),
                'email' => $request->query('email'),
            ]);
        }

        $pkce = $this->oauth->generatePkce();

        // Lưu code_verifier vào session — callback sẽ đọc để exchange code
        session(['code_verifier' => $pkce['verifier']]);

        $authorizeUrl = $this->oauth->getAuthorizeUrl($pkce['challenge']);

        // from_spring=1: user vừa login ở Spring Boot form.
        // Spring session valid → skip clear-session để auto-authorize.
        if ($request->query('from_spring') === '1') {
            return redirect()->away($authorizeUrl);
        }

        // Hai-bước redirect cho direct PHP admin access:
        // 1. Clear Spring Boot session (JSESSIONID) để tránh auto-authorize với wrong user
        // 2. Sau đó redirect đến /oauth2/authorize để bắt đầu OIDC flow
        // Thay vì dùng prompt=login (gây exchange_failed), clear session trước.
        $clearUrl = $this->oauth->getClearSessionUrl($authorizeUrl);

        return redirect()->away($clearUrl);
    }

    /**
     * Bước 2: Nhận authorization_code từ Spring Boot → exchange → lưu JWT.
     */
    public function callback(Request $request): RedirectResponse
    {
        $code = $request->query('code');
        $error = $request->query('error');

        if ($error || ! $code) {
            return redirect('/login?error='.($error ? 'auth_failed' : 'missing_code'));
        }

        $codeVerifier = session('code_verifier');
        if (! $codeVerifier) {
            return redirect('/login?error=expired_session');
        }

        // === Bước 1: Exchange code → JWT ===
        try {
            $tokens = $this->oauth->exchangeCode($code, $codeVerifier);
        } catch (\Exception $e) {
            Log::error(__('messages.log.token_exchange_failed'), [
                'error' => $e->getMessage(),
                'code_prefix' => substr($code, 0, 8).'...',
            ]);

            return redirect('/login?error=exchange_failed&reason='.urlencode($e->getMessage()));
        }

        $jwt = $tokens['access_token'] ?? null;
        if (! $jwt) {
            Log::error(__('messages.log.missing_access_token'), ['tokens' => array_keys($tokens)]);

            return redirect('/login?error=exchange_failed&reason='.urlencode(__('messages.auth.no_access_token')));
        }

        // === Bước 2: Validate JWT signature + decode payload ===
        try {
            $payload = $this->oauth->validateJwt($jwt);
        } catch (\Exception $e) {
            Log::error(__('messages.log.jwt_validation_failed'), [
                'error' => $e->getMessage(),
                'token_prefix' => substr($jwt, 0, 16).'...',
            ]);

            return redirect('/login?error=exchange_failed&reason='.urlencode(__('messages.error.jwt_validation', ['message' => $e->getMessage()])));
        }

        // === Bước 3: Kiểm tra role ADMIN ===
        if (! isset($payload->role) || $payload->role !== 'ADMIN') {
            session()->forget('code_verifier');

            return redirect("/login?error=access_denied&role={$payload->role}&email=".urlencode($payload->email ?? ''));
        }

        // === Bước 4: Lưu session thành công ===
        session([
            'admin_jwt' => $jwt,
            'admin_user' => [
                'id' => $payload->sub,
                'email' => $payload->email ?? '',
                'name' => $payload->name ?? 'Admin',
                'role' => $payload->role,
            ],
        ]);

        // Xóa code_verifier (dùng 1 lần)
        session()->forget('code_verifier');

        return redirect()->route('admin.dashboard');
    }

    /**
     * Logout — xóa session admin.
     */
    public function logout(): RedirectResponse
    {
        session()->forget(['admin_jwt', 'admin_user']);

        return redirect()->route('admin.login');
    }
}
