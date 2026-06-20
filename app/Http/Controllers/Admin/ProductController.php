<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Services\SpringOAuthService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

/**
 * ProductController — Quản lý sản phẩm (gọi Spring Boot API).
 *
 * Yêu cầu admin đã login (JWT hợp lệ + role ADMIN).
 */
class ProductController extends Controller
{
    public function __construct(
        private SpringOAuthService $oauth
    ) {}

    /**
     * Danh sách sản phẩm — gọi Spring Boot /api/products.
     */
    public function index(Request $request): Response
    {
        $page = (int) $request->input('page', 1);
        $search = $request->input('search');

        try {
            $result = $this->oauth->callApiGet('/api/products', array_filter([
                'page' => $page,
                'size' => 20,
                'search' => $search,
            ]));

            $products = $result['data'] ?? [];
            $pagination = $result['pagination'] ?? [];
            $total = $pagination['totalElements'] ?? 0;
        } catch (\Exception $e) {
            $products = [];
            $total = 0;
            session()->flash('error', __('messages.product.fetch_failed', ['message' => $e->getMessage()]));
        }

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'total' => $total,
            'page' => $page,
            'search' => $search,
            'auth' => ['user' => session('admin_user')],
        ]);
    }

    /**
     * Chi tiết sản phẩm — gọi Spring Boot /api/products/{id}.
     */
    public function show(string $id): Response
    {
        try {
            $product = $this->oauth->callApi('GET', "/api/products/{$id}");
        } catch (\Exception $e) {
            $product = null;
            session()->flash('error', __('messages.product.fetch_failed_single', ['message' => $e->getMessage()]));
        }

        return Inertia::render('Admin/Products/Show', [
            'product' => $product,
            'auth' => ['user' => session('admin_user')],
        ]);
    }
}
