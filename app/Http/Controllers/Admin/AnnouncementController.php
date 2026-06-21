<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\StoreAnnouncementRequest;
use App\Http\Requests\Admin\UpdateAnnouncementRequest;
use App\Services\SpringOAuthService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    public function __construct(
        private SpringOAuthService $oauth,
    ) {}

    public function index(Request $request): Response
    {
        try {
            $announcements = $this->oauth->callApiGet('/api/platform/announcements', ['audience' => 'all']);
        } catch (\Exception $e) {
            $announcements = [];
            session()->flash('error', __('messages.announcement.fetch_failed', ['message' => $e->getMessage()]));
        }

        // Spring READ endpoint only filters by audience; status filter is applied client-side
        // from the full list returned by the API.
        $status = $request->input('status');
        if (is_array($announcements) && $status === 'published') {
            $announcements = array_values(array_filter(
                $announcements,
                static fn (array $a): bool => (bool) ($a['isPublished'] ?? false),
            ));
        } elseif (is_array($announcements) && $status === 'draft') {
            $announcements = array_values(array_filter(
                $announcements,
                static fn (array $a): bool => ! ($a['isPublished'] ?? false),
            ));
        }

        return Inertia::render('Admin/Announcements/Index', [
            'announcements' => $announcements,
            'auth' => ['user' => session('admin_user')],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Announcements/Create', [
            'auth' => ['user' => session('admin_user')],
        ]);
    }

    public function store(StoreAnnouncementRequest $request): RedirectResponse
    {
        try {
            $data = $this->toCamelCase($request->validated());
            $data['createdBy'] = session('admin_user.email', 'admin');

            if (($data['isPublished'] ?? false) && empty($data['publishedAt'])) {
                $data['publishedAt'] = now()->toISOString();
            }

            $this->oauth->callApi('POST', '/api/platform/announcements', $data);
            session()->flash('success', __('messages.announcement.created'));
        } catch (\Exception $e) {
            session()->flash('error', __('messages.announcement.create_failed', ['message' => $e->getMessage()]));

            return redirect()->back()->withInput();
        }

        return redirect()->route('announcements.index');
    }

    public function edit(Request $request, string $id): Response
    {
        try {
            $announcement = $this->oauth->callApi('GET', "/api/platform/announcements/{$id}");
        } catch (\Exception $e) {
            $announcement = null;
            session()->flash('error', __('messages.announcement.fetch_failed_single', ['message' => $e->getMessage()]));
        }

        return Inertia::render('Admin/Announcements/Edit', [
            'announcement' => $announcement,
            'auth' => ['user' => session('admin_user')],
        ]);
    }

    public function update(UpdateAnnouncementRequest $request, string $id): RedirectResponse
    {
        try {
            $data = $this->toCamelCase($request->validated());
            // Spring service auto-sets publishedAt when isPublished flips true and publishedAt is null;
            // sending the flag through is enough.
            $this->oauth->callApi('PUT', "/api/platform/announcements/{$id}", $data);
            session()->flash('success', __('messages.announcement.updated'));
        } catch (\Exception $e) {
            session()->flash('error', __('messages.announcement.update_failed', ['message' => $e->getMessage()]));

            return redirect()->back()->withInput();
        }

        return redirect()->back();
    }

    public function destroy(string $id): RedirectResponse
    {
        try {
            $this->oauth->callApi('DELETE', "/api/platform/announcements/{$id}");
            session()->flash('success', __('messages.announcement.deleted'));
        } catch (\Exception $e) {
            session()->flash('error', __('messages.announcement.delete_failed', ['message' => $e->getMessage()]));
        }

        return redirect()->route('announcements.index');
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
