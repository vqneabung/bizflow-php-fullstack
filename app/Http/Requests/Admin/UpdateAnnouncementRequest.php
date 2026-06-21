<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

/**
 * Same validation rules as StoreAnnouncementRequest.
 * Reuses the base class to avoid duplicating the ruleset (DRY).
 */
class UpdateAnnouncementRequest extends StoreAnnouncementRequest {}
