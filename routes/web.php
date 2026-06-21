<?php

use App\Http\Controllers\Admin\AnnouncementController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ReportTemplateController;
use App\Http\Controllers\Admin\SubscriptionPlanController;
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
    Route::get('products/create', [ProductController::class, 'create'])->name('products.create');
    Route::post('products', [ProductController::class, 'store'])->name('products.store');
    Route::get('products/{id}', [ProductController::class, 'show'])->name('products.show');
    Route::get('products/{id}/edit', [ProductController::class, 'edit'])->name('products.edit');
    Route::put('products/{id}', [ProductController::class, 'update'])->name('products.update');
    Route::patch('products/{id}/deactivate', [ProductController::class, 'deactivate'])->name('products.deactivate');

    Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('orders/create', [OrderController::class, 'create'])->name('orders.create');
    Route::post('orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('orders/{id}', [OrderController::class, 'show'])->name('orders.show');
    Route::patch('orders/{id}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');

    Route::get('subscriptions', [SubscriptionPlanController::class, 'index'])->name('subscriptions.index');
    Route::get('subscriptions/{id}/edit', [SubscriptionPlanController::class, 'edit'])->name('subscriptions.edit');
    Route::put('subscriptions/{id}', [SubscriptionPlanController::class, 'update'])->name('subscriptions.update');

    Route::get('report-templates', [ReportTemplateController::class, 'index'])->name('report-templates.index');
    Route::get('report-templates/{id}', [ReportTemplateController::class, 'show'])->name('report-templates.show');
    Route::get('report-templates/{id}/edit', [ReportTemplateController::class, 'edit'])->name('report-templates.edit');
    Route::put('report-templates/{id}', [ReportTemplateController::class, 'update'])->name('report-templates.update');

    Route::get('announcements', [AnnouncementController::class, 'index'])->name('announcements.index');
    Route::get('announcements/create', [AnnouncementController::class, 'create'])->name('announcements.create');
    Route::post('announcements', [AnnouncementController::class, 'store'])->name('announcements.store');
    Route::get('announcements/{id}/edit', [AnnouncementController::class, 'edit'])->name('announcements.edit');
    Route::put('announcements/{id}', [AnnouncementController::class, 'update'])->name('announcements.update');
    Route::delete('announcements/{id}', [AnnouncementController::class, 'destroy'])->name('announcements.destroy');
});

require __DIR__.'/settings.php';
