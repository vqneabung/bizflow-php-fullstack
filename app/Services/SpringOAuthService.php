<?php

declare(strict_types=1);

namespace App\Services;

use Firebase\JWT\JWK;
use Firebase\JWT\JWT;
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
    /** Cache JWKS keys để tránh gọi lại mỗi lần validate */
    private ?array $jwkKeys = null;

    public function __construct(
        private string $baseUrl = 'http://localhost:8080',
        private string $clientId = 'laravel-admin-client',
        private string $clientSecret = 'admin-secret',
        private string $redirectUri = 'http://localhost:8000/admin/callback',
    ) {
        $this->baseUrl = config('services.spring.base_url', $this->baseUrl);
        $this->clientId = config('services.spring.client_id', $this->clientId);
        $this->clientSecret = config('services.spring.client_secret', $this->clientSecret);
        $this->redirectUri = config('services.spring.redirect_uri', $this->redirectUri);
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
     * @param  string  $codeChallenge  code_challenge từ generatePkce()
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
     * Build URL xóa JSESSIONID trước khi bắt đầu OIDC flow.
     *
     * Trước khi redirect user đến /oauth2/authorize, redirect đến endpoint này
     * để clear session cũ (từ Next.js login). Tránh auto-authorize với wrong user.
     *
     * @param  string  $authorizeUrl  URL đầy đủ đến /oauth2/authorize (từ getAuthorizeUrl)
     * @return string URL redirect
     */
    public function getClearSessionUrl(string $authorizeUrl): string
    {
        return "{$this->baseUrl}/api/auth/session/clear-session?redirect=".urlencode($authorizeUrl);
    }

    /**
     * Exchange authorization_code lấy JWT access_token.
     *
     * @param  string  $code  Authorization code từ callback
     * @param  string  $codeVerifier  Code verifier từ generatePkce()
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
                __('messages.error.token_exchange', ['message' => $response->body()]),
                $response->status()
            );
        }

        return $response->json();
    }

    /**
     * Validate JWT signature dùng RSA public key từ Spring Boot JWKS endpoint.
     *
     * @param  string  $jwt  JWT access_token
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
            throw new \RuntimeException(__('messages.error.jwt_validation', ['message' => $e->getMessage()]));
        }
    }

    /**
     * Gọi Spring Boot API với Bearer token.
     *
     * @param  string  $method  HTTP method (GET, POST, PUT, DELETE)
     * @param  string  $path  API path (ví dụ: /api/admin/users)
     * @param  array  $data  Request body (cho POST/PUT)
     * @param  array|null  $query  Query string params (cho GET). Xung đột với $data.
     * @param  string|null  $jwt  JWT access_token (nếu null, lấy từ session)
     * @return array Response từ Spring Boot (đã unwrap ApiResponse.data)
     */
    public function callApi(string $method, string $path, array $data = [], ?array $query = null, ?string $jwt = null): array
    {
        if ($data !== [] && $query !== null) {
            throw new \RuntimeException('Cannot provide both request body and query parameters.');
        }

        $jwt ??= session('admin_jwt');

        $url = "{$this->baseUrl}{$path}";
        if ($query !== null) {
            $url .= '?'.http_build_query($query);
        }

        $response = Http::withToken($jwt)->send($method, $url, [
            'json' => $data,
        ]);

        if (! $response->successful()) {
            throw new \RuntimeException(
                __('messages.error.spring_api', ['message' => $response->body()]),
                $response->status()
            );
        }

        $body = $response->json() ?? [];
        // ApiResponse<T> wrapper: { success, message, data } — unwrap to data
        // PaginationResponse<T>: { success, message, data, pagination } — keep whole body (caller reads data + pagination)
        if (
            is_array($body)
            && array_key_exists('data', $body)
            && array_key_exists('success', $body)
            && array_key_exists('message', $body)
            && ! array_key_exists('pagination', $body)
        ) {
            return $body['data'] ?? [];
        }

        return $body;
    }

    /**
     * Gọi Spring Boot API với GET method và query string params.
     *
     * @param  string  $path  API path
     * @param  array  $query  Query string params
     * @param  string|null  $jwt  JWT access_token
     * @return array Response từ Spring Boot (đã unwrap)
     */
    public function callApiGet(string $path, array $query = [], ?string $jwt = null): array
    {
        return $this->callApi('GET', $path, [], $query, $jwt);
    }

    /**
     * Lấy danh sách users từ Spring Boot (/api/admin/users).
     *
     * @param  int  $page  Số trang
     * @param  int  $size  Số lượng mỗi trang
     * @param  string|null  $search  Từ khóa tìm kiếm (tùy chọn)
     * @return array Danh sách users
     */
    public function getUsers(int $page = 1, int $size = 20, ?string $search = null): array
    {
        $query = ['page' => $page, 'size' => $size];
        if ($search !== null) {
            $query['search'] = $search;
        }

        return $this->callApiGet('/api/admin/users', $query);
    }

    /**
     * Fetch JWKS keys từ Spring Boot, cache trong request.
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
