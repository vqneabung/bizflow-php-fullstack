<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\StoreOrderRequest;
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

    /**
     * Form tạo đơn hàng — load products + customers để chọn trong form.
     */
    public function create(): Response
    {
        $products = [];
        $customers = [];
        try {
            $products = $this->oauth->callApiGet('/api/products', ['size' => 100]);
        } catch (\RuntimeException) {
            $products = [];
        }
        try {
            $customers = $this->oauth->callApiGet('/api/customers', ['size' => 100]);
        } catch (\RuntimeException) {
            $customers = [];
        }

        return Inertia::render('Admin/Orders/Create', [
            'products' => $products,
            'customers' => $customers,
            'auth' => ['user' => session('admin_user')],
        ]);
    }

    /**
     * Tạo đơn hàng — gọi Spring Boot POST /api/orders.
     */
    public function store(StoreOrderRequest $request): RedirectResponse
    {
        try {
            $data = $this->toCamelCase($request->validated());
            $order = $this->oauth->callApi('POST', '/api/orders', $data);

            return redirect()->route('admin.orders.show', $order['id'])
                ->with('success', __('messages.order.created'));
        } catch (\Exception $e) {
            return redirect()->back()->withInput()
                ->with('error', __('messages.order.create_failed', ['message' => $e->getMessage()]));
        }
    }

    /**
     * Convert snake_case keys → camelCase before forwarding to Spring Boot.
     *
     * Spring Boot Jackson defaults to camelCase; Laravel FormRequest returns snake_case.
     */
    private function toCamelCase(array $data): array
    {
        $result = [];
        foreach ($data as $key => $value) {
            $camelKey = preg_replace_callback('/_([a-z])/', fn (array $m): string => strtoupper($m[1]), $key);
            $result[$camelKey] = is_array($value) ? $this->toCamelCase($value) : $value;
        }

        return $result;
    }
}
