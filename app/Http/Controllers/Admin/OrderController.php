<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Services\SpringOAuthService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

/**
 * OrderController — Quản lý đơn hàng (gọi Spring Boot API).
 *
 * Yêu cầu admin đã login (JWT hợp lệ + role ADMIN).
 */
class OrderController extends Controller
{
    public function __construct(
        private SpringOAuthService $oauth
    ) {}

    /**
     * Danh sách đơn hàng — gọi Spring Boot /api/orders.
     */
    public function index(Request $request): Response
    {
        $page = (int) $request->input('page', 1);
        $status = $request->input('status');

        try {
            $result = $this->oauth->callApiGet('/api/orders', array_filter([
                'page' => $page,
                'size' => 20,
                'status' => $status,
            ]));

            $orders = $result['data'] ?? [];
            $total = $result['pagination']['totalElements'] ?? 0;
        } catch (\Exception $e) {
            $orders = [];
            $total = 0;
            session()->flash('error', __('messages.order.fetch_failed', ['message' => $e->getMessage()]));
        }

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'total' => $total,
            'page' => $page,
            'status' => $status,
            'auth' => ['user' => session('admin_user')],
        ]);
    }

    /**
     * Chi tiết đơn hàng — gọi Spring Boot /api/orders/{id}.
     */
    public function show(string $id): Response
    {
        try {
            $order = $this->oauth->callApi('GET', "/api/orders/{$id}");
        } catch (\Exception $e) {
            $order = null;
            session()->flash('error', __('messages.order.fetch_failed_single', ['message' => $e->getMessage()]));
        }

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
            'auth' => ['user' => session('admin_user')],
        ]);
    }

    /**
     * Hủy đơn hàng — gọi Spring Boot PATCH /api/orders/{id}/cancel.
     */
    public function cancel(string $id): RedirectResponse
    {
        try {
            $this->oauth->callApi('PATCH', "/api/orders/{$id}/cancel");
            session()->flash('success', __('messages.order.cancelled'));
        } catch (\Exception $e) {
            session()->flash('error', __('messages.order.cancel_failed', ['message' => $e->getMessage()]));
        }

        return redirect()->route('admin.orders.show', $id);
    }
}
