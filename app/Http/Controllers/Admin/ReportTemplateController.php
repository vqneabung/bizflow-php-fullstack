<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\UpdateReportTemplateRequest;
use App\Services\SpringOAuthService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ReportTemplateController extends Controller
{
    public function __construct(
        private SpringOAuthService $oauth,
    ) {}

    public function index(): Response
    {
        try {
            $templates = $this->oauth->callApiGet('/api/platform/report-templates');
        } catch (\Exception $e) {
            $templates = [];
            session()->flash('error', __('messages.reportTemplate.fetch_failed', ['message' => $e->getMessage()]));
        }

        return Inertia::render('Admin/ReportTemplates/Index', [
            'templates' => $templates,
            'auth' => ['user' => session('admin_user')],
        ]);
    }

    public function show(Request $request, string $id): Response
    {
        try {
            $template = $this->oauth->callApi('GET', "/api/platform/report-templates/{$id}");
        } catch (\Exception $e) {
            $template = null;
            session()->flash('error', __('messages.reportTemplate.fetch_failed_single', ['message' => $e->getMessage()]));
        }

        return Inertia::render('Admin/ReportTemplates/Show', [
            'template' => $template,
            'auth' => ['user' => session('admin_user')],
        ]);
    }

    public function edit(Request $request, string $id): Response
    {
        try {
            $template = $this->oauth->callApi('GET', "/api/platform/report-templates/{$id}");
        } catch (\Exception $e) {
            $template = null;
            session()->flash('error', __('messages.reportTemplate.fetch_failed_single', ['message' => $e->getMessage()]));
        }

        return Inertia::render('Admin/ReportTemplates/Edit', [
            'template' => $template,
            'auth' => ['user' => session('admin_user')],
        ]);
    }

    public function update(UpdateReportTemplateRequest $request, string $id): RedirectResponse
    {
        try {
            $data = $this->toCamelCase($request->validated());
            $data['lastUpdatedBy'] = session('admin_user.email', 'admin');
            $this->oauth->callApi('PUT', "/api/platform/report-templates/{$id}", $data);
            session()->flash('success', __('messages.reportTemplate.saved'));
        } catch (\Exception $e) {
            session()->flash('error', __('messages.reportTemplate.save_failed', ['message' => $e->getMessage()]));

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
