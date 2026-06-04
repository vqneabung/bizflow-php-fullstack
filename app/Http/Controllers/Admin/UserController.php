<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Services\SpringOAuthService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

/**
 * UserController — Quản lý users (gọi Spring Boot API).
 *
 * Yêu cầu admin đã login (JWT hợp lệ + role ADMIN).
 */
class UserController extends Controller
{
    public function __construct(
        private SpringOAuthService $oauth
    ) {}

    /**
     * Danh sách users — gọi Spring Boot /api/admin/users.
     */
    public function index(Request $request): Response
    {
        try {
            $users = $this->oauth->getUsers();
        } catch (\Exception $e) {
            $users = [];
            session()->flash('error', __('messages.user.fetch_failed', ['message' => $e->getMessage()]));
        }

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'auth' => ['user' => session('admin_user')],
        ]);
    }

    public function show(string $id): Response
    {
        try {
            $user = $this->oauth->callApi('GET', "/api/admin/users/{$id}");
        } catch (\Exception $e) {
            $user = null;
            session()->flash('error', __('messages.user.fetch_failed_single', ['message' => $e->getMessage()]));
        }

        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
            'auth' => ['user' => session('admin_user')],
        ]);
    }
}
