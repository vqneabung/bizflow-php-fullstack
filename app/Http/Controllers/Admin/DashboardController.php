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
        $revenue = null;
        $bestSelling = null;
        $inventory = null;
        $debt = null;
        $totalUsers = null;

        try {
            $overview = $this->oauth->callApiGet('/api/reports/overview');
        } catch (\RuntimeException) {
            $overview = null;
        }

        try {
            $revenue = $this->oauth->callApiGet('/api/reports/revenue', ['range' => '30d']);
        } catch (\RuntimeException) {
            $revenue = null;
        }

        try {
            $bestSelling = $this->oauth->callApiGet('/api/reports/best-selling', ['limit' => 5]);
        } catch (\RuntimeException) {
            $bestSelling = null;
        }

        try {
            $inventory = $this->oauth->callApiGet('/api/reports/inventory');
        } catch (\RuntimeException) {
            $inventory = null;
        }

        try {
            $debt = $this->oauth->callApiGet('/api/reports/debt');
        } catch (\RuntimeException) {
            $debt = null;
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
            'revenue' => $revenue,
            'bestSelling' => $bestSelling,
            'inventory' => $inventory,
            'debt' => $debt,
            'totalUsers' => $totalUsers,
        ]);
    }
}
