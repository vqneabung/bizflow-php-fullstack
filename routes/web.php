<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

// ===== Trang chủ — redirect đến admin dashboard (có middleware kiểm tra login) =====
// Nếu chưa login → admin middleware redirect về /login → OIDC flow → Spring Boot
// Nếu đã login → vào dashboard luôn
Route::redirect('/', '/admin/dashboard');

Route::redirect('/admin', '/admin/dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

// ===== Admin OIDC — public routes (không cần auth) =====
// GET /login → redirect Spring Boot OIDC (thay thế Fortify login)
Route::get('login', [AuthController::class, 'login'])->name('admin.login');
// GET /admin/callback → Spring Boot redirect về đây sau khi login
Route::get('admin/callback', [AuthController::class, 'callback'])->name('admin.callback');
// POST /logout → xóa session admin
Route::post('logout', [AuthController::class, 'logout'])->name('admin.logout');

// ===== Admin Dashboard — yêu cầu admin_jwt trong session =====
Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::get('users/{id}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('users/{id}', [UserController::class, 'update'])->name('users.update');
    Route::get('users/{id}', [UserController::class, 'show'])->name('users.show');
    Route::delete('users/{id}', [UserController::class, 'destroy'])->name('users.destroy');

    Route::get('products', [ProductController::class, 'index'])->name('products.index');
    Route::get('products/{id}', [ProductController::class, 'show'])->name('products.show');

    Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('orders/{id}', [OrderController::class, 'show'])->name('orders.show');
    Route::patch('orders/{id}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');
});

require __DIR__.'/settings.php';
