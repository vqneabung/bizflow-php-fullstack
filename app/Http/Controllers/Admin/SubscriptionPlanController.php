<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\UpdateSubscriptionPlanRequest;
use App\Services\SpringOAuthService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionPlanController extends Controller
{
    public function __construct(
        private SpringOAuthService $oauth,
    ) {}

    public function index(): Response
    {
        try {
            $plans = $this->oauth->callApiGet('/api/platform/subscription-plans');
        } catch (\Exception $e) {
            $plans = [];
            session()->flash('error', __('messages.subscription.fetch_failed', ['message' => $e->getMessage()]));
        }

        return Inertia::render('Admin/Subscriptions/Index', [
            'plans' => $plans,
            'auth' => ['user' => session('admin_user')],
        ]);
    }

    public function edit(Request $request, string $id): Response
    {
        try {
            $plan = $this->oauth->callApi('GET', "/api/platform/subscription-plans/{$id}");
        } catch (\Exception $e) {
            $plan = null;
            session()->flash('error', __('messages.subscription.fetch_failed_single', ['message' => $e->getMessage()]));
        }

        return Inertia::render('Admin/Subscriptions/Edit', [
            'plan' => $plan,
            'auth' => ['user' => session('admin_user')],
        ]);
    }

    public function update(UpdateSubscriptionPlanRequest $request, string $id): RedirectResponse
    {
        try {
            $data = $this->toCamelCase($request->validated());
            $this->oauth->callApi('PUT', "/api/platform/subscription-plans/{$id}", $data);
            session()->flash('success', __('messages.subscription.saved'));
        } catch (\Exception $e) {
            session()->flash('error', __('messages.subscription.save_failed', ['message' => $e->getMessage()]));

            return redirect()->back()->withInput();
        }

        return redirect()->back();
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
