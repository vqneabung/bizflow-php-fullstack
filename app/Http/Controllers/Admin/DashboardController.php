<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Services\SpringOAuthService;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private SpringOAuthService $oauth,
    ) {}

    public function __invoke(): Response
    {
        $overview = null;
        $totalUsers = null;

        try {
            $overview = $this->oauth->callApiGet('/api/reports/overview');
        } catch (\RuntimeException) {
            $overview = null;
        }

        try {
            $usersResponse = $this->oauth->getUsers(page: 1, size: 1);
            $totalUsers = $usersResponse['total'] ?? null;
        } catch (\RuntimeException) {
            $totalUsers = null;
        }

        return Inertia::render('Admin/Dashboard', [
            'auth' => [
                'user' => session('admin_user'),
            ],
            'overview' => $overview,
            'totalUsers' => $totalUsers,
        ]);
    }
}
