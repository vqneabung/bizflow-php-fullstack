<?php

namespace App\Http\Controllers\Admin;

use App\Services\SpringOAuthService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
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
     */
    public function login(): RedirectResponse
    {
        $pkce = $this->oauth->generatePkce();

        // Lưu code_verifier vào session — callback sẽ đọc để exchange code
        session(['code_verifier' => $pkce['verifier']]);

        return redirect()->away($this->oauth->getAuthorizeUrl($pkce['challenge']));
    }

    /**
     * Bước 2: Nhận authorization_code từ Spring Boot → exchange → lưu JWT.
     */
    public function callback(Request $request): RedirectResponse
    {
        $code = $request->query('code');
        $error = $request->query('error');

        if ($error || ! $code) {
            return redirect()->route('admin.login')
                ->withErrors(['error' => 'Authentication failed: ' . ($error ?? 'No code')]);
        }

        $codeVerifier = session('code_verifier');
        if (! $codeVerifier) {
            return redirect()->route('admin.login')
                ->withErrors(['error' => 'Session expired, please try again']);
        }

        try {
            // Exchange code + code_verifier + client_secret → JWT
            $tokens = $this->oauth->exchangeCode($code, $codeVerifier);
            $jwt = $tokens['access_token'];

            // Validate JWT signature + decode payload
            $payload = $this->oauth->validateJwt($jwt);

            // Kiểm tra role ADMIN
            if (! isset($payload->role) || $payload->role !== 'ADMIN') {
                return redirect()->route('admin.login')
                    ->withErrors(['error' => 'Access denied: Admin role required']);
            }

            // Lưu JWT + user info vào session
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
        } catch (\Exception $e) {
            return redirect()->route('admin.login')
                ->withErrors(['error' => 'Authentication error: ' . $e->getMessage()]);
        }
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
