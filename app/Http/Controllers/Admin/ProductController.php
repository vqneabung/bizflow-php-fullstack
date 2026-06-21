<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Services\SpringOAuthService;
use Illuminate\Http\RedirectResponse;
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
     * Form tạo sản phẩm — load categories + units từ Spring reference endpoints.
     */
    public function create(): Response
    {
        $categories = [];
        $units = [];
        try {
            $categories = $this->oauth->callApiGet('/api/reference/categories');
        } catch (\RuntimeException) {
            $categories = [];
        }
        try {
            $units = $this->oauth->callApiGet('/api/reference/units');
        } catch (\RuntimeException) {
            $units = [];
        }

        return Inertia::render('Admin/Products/Create', [
            'categories' => $categories,
            'units' => $units,
            'auth' => ['user' => session('admin_user')],
        ]);
    }

    /**
     * Tạo sản phẩm mới — POST /api/products.
     */
    public function store(StoreProductRequest $request): RedirectResponse
    {
        try {
            $data = $this->toCamelCase($request->validated());
            $product = $this->oauth->callApi('POST', '/api/products', $data);

            return redirect()->route('admin.products.show', $product['id'])
                ->with('success', __('messages.product.created'));
        } catch (\Exception $e) {
            return redirect()->back()->withInput()
                ->with('error', __('messages.product.create_failed', ['message' => $e->getMessage()]));
        }
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

    /**
     * Form sửa sản phẩm — load product + reference data.
     */
    public function edit(string $id): Response
    {
        try {
            $product = $this->oauth->callApi('GET', "/api/products/{$id}");
        } catch (\RuntimeException $e) {
            abort(404, 'Product not found');
        }

        $categories = [];
        $units = [];
        try {
            $categories = $this->oauth->callApiGet('/api/reference/categories');
        } catch (\RuntimeException) {
            $categories = [];
        }
        try {
            $units = $this->oauth->callApiGet('/api/reference/units');
        } catch (\RuntimeException) {
            $units = [];
        }

        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
            'categories' => $categories,
            'units' => $units,
            'auth' => ['user' => session('admin_user')],
        ]);
    }

    /**
     * Cập nhật sản phẩm — PUT /api/products/{id}.
     * Spring chấp nhận partial update: filter bỏ field null trước khi gửi.
     */
    public function update(UpdateProductRequest $request, string $id): RedirectResponse
    {
        try {
            $data = $this->toCamelCase($request->validated());
            // Spring partial update: bỏ field null để không ghi đè giá trị hiện tại.
            $data = array_filter($data, static fn ($v): bool => $v !== null);

            $this->oauth->callApi('PUT', "/api/products/{$id}", $data);

            return redirect()->route('admin.products.show', $id)
                ->with('success', __('messages.product.updated'));
        } catch (\Exception $e) {
            return redirect()->back()->withInput()
                ->with('error', __('messages.product.update_failed', ['message' => $e->getMessage()]));
        }
    }

    /**
     * Tạm ngưng sản phẩm (soft delete) — PATCH /api/products/{id}/deactivate.
     */
    public function deactivate(string $id): RedirectResponse
    {
        try {
            $this->oauth->callApi('PATCH', "/api/products/{$id}/deactivate");

            return redirect()->route('admin.products.index')
                ->with('success', __('messages.product.deactivated'));
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', __('messages.product.deactivate_failed', ['message' => $e->getMessage()]));
        }
    }

    /**
     * Convert snake_case keys → camelCase trước khi gửi sang Spring Boot.
     *
     * Spring Boot Jackson mặc định camelCase; Laravel FormRequest trả snake_case.
     *
     * @param  array<mixed>  $data
     * @return array<mixed>
     */
    private function toCamelCase(array $data): array
    {
        $result = [];
        foreach ($data as $key => $value) {
            $camelKey = preg_replace_callback('/_([a-z])/', static fn (array $m): string => strtoupper($m[1]), (string) $key);
            $result[$camelKey] = is_array($value) ? $this->toCamelCase($value) : $value;
        }

        return $result;
    }
}
