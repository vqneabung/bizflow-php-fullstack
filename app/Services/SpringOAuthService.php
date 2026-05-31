<?php

namespace App\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\JWK;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\Http;

/**
 * SpringOAuthService — Xử lý OIDC flow với Spring Boot Authorization Server.
 *
 * Cung cấp:
 * - generatePkce(): tạo code_verifier + code_challenge cho PKCE
 * - getAuthorizeUrl(): build URL redirect đến Spring Boot
 * - exchangeCode(): đổi authorization_code lấy JWT
 * - validateJwt(): verify chữ ký RSA của JWT qua JWKS endpoint
 * - callApi(): gọi Spring Boot API với Bearer token
 */
class SpringOAuthService
{
    /** URL của Spring Boot Auth Server (ví dụ: http://localhost:8080) */
    private string $baseUrl;

    /** Client ID đăng ký trong Spring Boot DataInitializer */
    private string $clientId;

    /** Client Secret — lưu trong .env, không hardcode */
    private string $clientSecret;

    /** Redirect URI — khớp với đăng ký trong DataInitializer */
    private string $redirectUri;

    /** Cache JWKS keys để tránh gọi lại mỗi lần validate */
    private ?array $jwkKeys = null;

    public function __construct()
    {
        $this->baseUrl = config('services.spring.base_url', 'http://localhost:8080');
        $this->clientId = config('services.spring.client_id', 'laravel-admin-client');
        $this->clientSecret = config('services.spring.client_secret', 'admin-secret');
        $this->redirectUri = config('services.spring.redirect_uri', 'http://localhost:8000/admin/callback');
    }

    /**
     * Tạo cặp PKCE: code_verifier (random) + code_challenge (sha256).
     *
     * @return array{verifier: string, challenge: string}
     */
    public function generatePkce(): array
    {
        $verifier = $this->base64urlEncode(random_bytes(32));
        $challenge = $this->base64urlEncode(hash('sha256', $verifier, true));

        return ['verifier' => $verifier, 'challenge' => $challenge];
    }

    /** Encode bytes thành base64url (thay +/ bằng -_) */
    private function base64urlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    /**
     * Build URL để redirect user đến Spring Boot /oauth2/authorize.
     *
     * @param string $codeChallenge code_challenge từ generatePkce()
     * @return string URL redirect
     */
    public function getAuthorizeUrl(string $codeChallenge): string
    {
        $params = http_build_query([
            'response_type' => 'code',
            'client_id' => $this->clientId,
            'redirect_uri' => $this->redirectUri,
            'scope' => 'openid email profile',
            'code_challenge' => $codeChallenge,
            'code_challenge_method' => 'S256',
        ]);

        return "{$this->baseUrl}/oauth2/authorize?{$params}";
    }

    /**
     * Exchange authorization_code lấy JWT access_token.
     *
     * @param string $code Authorization code từ callback
     * @param string $codeVerifier Code verifier từ generatePkce()
     * @return array{access_token: string, refresh_token?: string, ...}
     *
     * @throws \RuntimeException Nếu Spring Boot trả lỗi
     */
    public function exchangeCode(string $code, string $codeVerifier): array
    {
        $response = Http::asForm()->post("{$this->baseUrl}/oauth2/token", [
            'grant_type' => 'authorization_code',
            'code' => $code,
            'redirect_uri' => $this->redirectUri,
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
            'code_verifier' => $codeVerifier,
        ]);

        if (! $response->successful()) {
            throw new \RuntimeException(
                'Token exchange failed: ' . $response->body(),
                $response->status()
            );
        }

        return $response->json();
    }

    /**
     * Validate JWT signature dùng RSA public key từ Spring Boot JWKS endpoint.
     *
     * @param string $jwt JWT access_token
     * @return object Decoded payload (chứa sub, email, role, ...)
     *
     * @throws \RuntimeException Nếu JWT không hợp lệ
     */
    public function validateJwt(string $jwt): object
    {
        try {
            $keys = $this->getJwksKeys();

            return JWT::decode($jwt, $keys);
        } catch (\Exception $e) {
            throw new \RuntimeException('JWT validation failed: ' . $e->getMessage());
        }
    }

    /**
     * Gọi Spring Boot API với Bearer token.
     *
     * @param string $method HTTP method (GET, POST, PUT, DELETE)
     * @param string $path API path (ví dụ: /api/admin/users)
     * @param array $data Request body (cho POST/PUT)
     * @param string|null $jwt JWT access_token (nếu null, lấy từ session)
     * @return array Response từ Spring Boot
     */
    public function callApi(string $method, string $path, array $data = [], ?string $jwt = null): array
    {
        $jwt ??= session('admin_jwt');

        $response = Http::withToken($jwt)->send($method, "{$this->baseUrl}{$path}", [
            'json' => $data,
        ]);

        if (! $response->successful()) {
            throw new \RuntimeException(
                'Spring API error: ' . $response->body(),
                $response->status()
            );
        }

        return $response->json() ?? [];
    }

    /**
     * Lấy danh sách users từ Spring Boot (/api/admin/users).
     *
     * @return array Danh sách users
     */
    public function getUsers(): array
    {
        return $this->callApi('GET', '/api/admin/users');
    }

    /**
     * Fetch JWKS keys từ Spring Boot, cache trong request.
     *
     * @return Key
     */
    private function getJwksKeys(): Key
    {
        if ($this->jwkKeys === null) {
            $response = Http::get("{$this->baseUrl}/oauth2/jwks");
            $jwks = $response->json();
            $this->jwkKeys = JWK::parseKeySet($jwks);
        }

        $key = reset($this->jwkKeys);

        return new Key($key->getKeyMaterial(), 'RS256');
    }
}
