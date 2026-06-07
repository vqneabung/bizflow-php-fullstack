# AGENTS.md — bizflow-php-fullstack (Laravel 13 + Inertia 3 + React 19)

## Cấu trúc dự án

```
bizflow-php-fullstack/
├── app/                        # Application code
│   ├── Actions/                # Single-purpose action classes
│   ├── Concerns/               # Trait-like reusable logic
│   ├── Exceptions/             # Custom exception classes
│   ├── Http/                   # HTTP layer
│   │   ├── Controllers/        # Route controllers
│   │   ├── Middleware/         # Custom middleware
│   │   ├── Requests/           # Form request validation
│   │   └── Resources/          # API resources
│   ├── Models/                 # Eloquent models
│   ├── Providers/              # Service providers
│   └── Services/               # Business services
├── bootstrap/                  # Laravel bootstrap
│   ├── app.php                 # Application config
│   └── providers.php           # Provider registration
├── config/                     # Configuration files
│   ├── app.php
│   ├── auth.php
│   ├── database.php
│   ├── fortify.php             # Fortify auth
│   ├── inertia.php             # Inertia config
│   ├── services.php            # External services (Spring Boot API base URL)
│   └── ...
├── database/
│   ├── factories/              # Model factories
│   ├── migrations/             # Database migrations
│   └── seeders/                # Database seeders
├── lang/                       # Localization
│   ├── en/
│   └── vi/
├── public/                     # Web root
│   └── index.php
├── resources/
│   ├── js/                     # React frontend
│   │   ├── pages/              # Inertia pages
│   │   ├── components/         # React components
│   │   ├── actions/            # Wayfinder-generated controller functions
│   │   ├── routes/             # Wayfinder-generated route functions
│   │   └── types/              # TypeScript types
│   └── views/                  # Blade templates (root)
├── routes/
│   ├── console.php             # Artisan commands
│   ├── settings.php            # Settings routes
│   └── web.php                 # Web routes (Inertia)
├── tests/
│   ├── Feature/                # Feature tests (Pest)
│   ├── Unit/                   # Unit tests
│   ├── Pest.php                # Pest configuration
│   └── TestCase.php            # Base test class
├── eslint.config.js            # ESLint config
├── phpunit.xml                 # PHPUnit/Pest config
├── vite.config.ts              # Vite config (with Wayfinder + Inertia plugins)
├── pnpm-workspace.yaml         # pnpm workspace
└── pnpm-lock.yaml
```

## Layer rules

| Layer | Path | Rule |
|---|---|---|
| **Routes** | `routes/web.php` | Define routes only, delegate to controller. |
| **Controllers** | `app/Http/Controllers/` | Single responsibility, return Inertia response hoặc API resource. |
| **Actions** | `app/Actions/` | Single-purpose classes cho business operations (Laravel pattern). |
| **Models** | `app/Models/` | Eloquent models với relationships, scopes, casts. |
| **Services** | `app/Services/` | Business logic, external API clients (Spring Boot). |
| **Requests** | `app/Http/Requests/` | Form request validation (`authorize()`, `rules()`). |
| **Resources** | `app/Http/Resources/` | API response transformation. |
| **Frontend** | `resources/js/` | React + Inertia (pages) + Tailwind. |

## PHP rules

1. **PHP 8.5+** features: constructor property promotion, readonly properties, enums, fibers (nếu cần).
2. **Strict types**: `declare(strict_types=1);` ở đầu file.
3. **No `mixed`**: dùng union types hoặc `object` thay vì `mixed` khi có thể.
4. **Type hints bắt buộc** cho parameters + return types.
5. **Curly braces** cho mọi control structure (kể cả single-line).
6. **TitleCase** cho Enum keys.
7. **PHPDoc** blocks cho complex types, generics, array shapes — KHÔNG dùng inline comments.

## Laravel rules

1. **Artisan cho mọi generation**: `php artisan make:model X -a` (model + migration + factory + seeder + controller).
2. **Form Requests** cho validation (không validate trong controller).
3. **Eloquent API Resources** cho API responses.
4. **Named routes** + `route()` helper thay vì hard-code URLs.
5. **Factories** cho test data — KHÔNG tạo model manually trong tests.
6. **Pest** cho testing, feature tests > unit tests.
7. **Laravel Pint** format code: `vendor/bin/pint --dirty --format agent` trước khi commit.

## TypeScript rules (React frontend)

1. **No `any`** — dùng `unknown` + type guards.
2. **Inertia v3 page props**: dùng `usePage<T>().props` cho type-safe data.
3. **Wayfinder** cho navigation: `import { show } from '@/actions/ProductController'` thay vì hard-code URL.
4. **Tailwind v4** cho styling — utility classes, KHÔNG inline styles.
5. **Discriminated unions** cho state machines.

## TypeScript ↔ PHP naming mapping

| PHP | TypeScript |
|---|---|
| `string` | `string` |
| `int` | `number` |
| `float` | `number` |
| `bool` | `boolean` |
| `array<T>` | `T[]` |
| `?Type` (nullable) | `Type \| null` |
| `class X { public string $name; }` | `interface X { name: string }` |
| `enum E: string { case A = 'a'; }` | `type E = 'a'` (string) hoặc `const E = { A: 'a' } as const` |

## Quy tắc code

- **Package manager**: `pnpm` cho frontend, `composer` cho PHP.
- **Frontend bundling**: Vite (`@inertiajs/vite` plugin). Build với `npm run build` hoặc `composer run dev`.
- **Path alias**: `@/` → `resources/js/`.
- **Routing**: file-based với Inertia pages (`@inertiajs/inertia-react`).

## Future folder predictions

```
app/
├── Modules/                    # Feature-based modules
│   ├── Products/
│   │   ├── Actions/
│   │   ├── Http/
│   │   ├── Models/
│   │   └── Services/
│   └── Reports/
├── Exports/                    # Excel/CSV exports
├── Imports/                    # Excel/CSV imports
└── Notifications/              # Email/SMS notifications
resources/js/
├── hooks/                      # Custom React hooks
├── stores/                     # State management (Zustand/Jotai)
├── lib/                        # Utility functions
└── components/                 # Shared UI components (shadcn/ui)
```

## Anti-patterns cần tránh

- ❌ `any` trong TypeScript
- ❌ Validate trong controller (dùng Form Request)
- ❌ Trả về Eloquent model trực tiếp từ API (dùng API Resource)
- ❌ Hard-code URLs (dùng named routes + `route()`)
- ❌ Tạo model manual trong tests (dùng factory)
- ❌ `mixed` type (dùng union types cụ thể)
- ❌ `dd()` / `dump()` trong production code
- ❌ Catch `Exception` chung (catch specific)
- ❌ Comment "what" — chỉ comment "why"

---

<laravel-boost-guidelines>
=== foundation rules ===

# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. These guidelines should be followed closely to ensure the best experience when building Laravel applications.

## Foundational Context

This application is a Laravel application and its main Laravel ecosystems package & versions are below. You are an expert with them all. Ensure you abide by these specific packages & versions.

- php - 8.5
- inertiajs/inertia-laravel (INERTIA_LARAVEL) - v3
- laravel/fortify (FORTIFY) - v1
- laravel/framework (LARAVEL) - v13
- laravel/prompts (PROMPTS) - v0
- laravel/wayfinder (WAYFINDER) - v0
- laravel/boost (BOOST) - v2
- laravel/mcp (MCP) - v0
- laravel/pail (PAIL) - v1
- laravel/pint (PINT) - v1
- laravel/sail (SAIL) - v1
- pestphp/pest (PEST) - v4
- phpunit/phpunit (PHPUNIT) - v12
- @inertiajs/react (INERTIA_REACT) - v3
- react (REACT) - v19
- tailwindcss (TAILWINDCSS) - v4
- @laravel/vite-plugin-wayfinder (WAYFINDER_VITE) - v0
- eslint (ESLINT) - v9
- prettier (PRETTIER) - v3

## Skills Activation

This project has domain-specific skills available in `**/skills/**`. You MUST activate the relevant skill whenever you work in that domain—don't wait until you're stuck.

## Conventions

- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, and naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts

- Do not create verification scripts or tinker when tests cover that functionality and prove they work. Unit and feature tests are more important.

## Application Structure & Architecture

- Stick to existing directory structure; don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling

- If the user doesn't see a frontend change reflected in the UI, it could mean they need to run `npm run build`, `npm run dev`, or `composer run dev`. Ask them.

## Documentation Files

- You must only create documentation files if explicitly requested by the user.

## Replies

- Be concise in your explanations - focus on what's important rather than explaining obvious details.

=== boost rules ===

# Laravel Boost

## Tools

- Laravel Boost is an MCP server with tools designed specifically for this application. Prefer Boost tools over manual alternatives like shell commands or file reads.
- Use `database-query` to run read-only queries against the database instead of writing raw SQL in tinker.
- Use `database-schema` to inspect table structure before writing migrations or models.
- Use `get-absolute-url` to resolve the correct scheme, domain, and port for project URLs. Always use this before sharing a URL with the user.
- Use `browser-logs` to read browser logs, errors, and exceptions. Only recent logs are useful, ignore old entries.

## Searching Documentation (IMPORTANT)

- Always use `search-docs` before making code changes. Do not skip this step. It returns version-specific docs based on installed packages automatically.
- Pass a `packages` array to scope results when you know which packages are relevant.
- Use multiple broad, topic-based queries: `['rate limiting', 'routing rate limiting', 'routing']`. Expect the most relevant results first.
- Do not add package names to queries because package info is already shared. Use `test resource table`, not `filament 4 test resource table`.

### Search Syntax

1. Use words for auto-stemmed AND logic: `rate limit` matches both "rate" AND "limit".
2. Use `"quoted phrases"` for exact position matching: `"infinite scroll"` requires adjacent words in order.
3. Combine words and phrases for mixed queries: `middleware "rate limit"`.
4. Use multiple queries for OR logic: `queries=["authentication", "middleware"]`.

## Artisan

- Run Artisan commands directly via the command line (e.g., `php artisan route:list`). Use `php artisan list` to discover available commands and `php artisan [command] --help` to check parameters.
- Inspect routes with `php artisan route:list`. Filter with: `--method=GET`, `--name=users`, `--path=api`, `--except-vendor`, `--only-vendor`.
- Read configuration values using dot notation: `php artisan config:show app.name`, `php artisan config:show database.default`. Or read config files directly from the `config/` directory.

## Tinker

- Execute PHP in app context for debugging and testing code. Do not create models without user approval, prefer tests with factories instead. Prefer existing Artisan commands over custom tinker code.
- Always use single quotes to prevent shell expansion: `php artisan tinker --execute 'Your::code();'`
  - Double quotes for PHP strings inside: `php artisan tinker --execute 'User::where("active", true)->count();'`

=== php rules ===

# PHP

- Always use curly braces for control structures, even for single-line bodies.
- Use PHP 8 constructor property promotion: `public function __construct(public GitHub $github) { }`. Do not leave empty zero-parameter `__construct()` methods unless the constructor is private.
- Use explicit return type declarations and type hints for all method parameters: `function isAccessible(User $user, ?string $path = null): bool`
- Use TitleCase for Enum keys: `FavoritePerson`, `BestLake`, `Monthly`.
- Prefer PHPDoc blocks over inline comments. Only add inline comments for exceptionally complex logic.
- Use array shape type definitions in PHPDoc blocks.

=== deployments rules ===

# Deployment

- Laravel can be deployed using [Laravel Cloud](https://cloud.laravel.com/), which is the fastest way to deploy and scale production Laravel applications.

=== tests rules ===

# Test Enforcement

- Every change must be programmatically tested. Write a new test or update an existing test, then run the affected tests to make sure they pass.
- Run the minimum number of tests needed to ensure code quality and speed. Use `php artisan test --compact` with a specific filename or filter.

=== inertia-laravel/core rules ===

# Inertia

- Inertia creates fully client-side rendered SPAs without modern SPA complexity, leveraging existing server-side patterns.
- Components live in `resources/js/pages` (unless specified in `vite.config.js`). Use `Inertia::render()` for server-side routing instead of Blade views.
- ALWAYS use `search-docs` tool for version-specific Inertia documentation and updated code examples.
- IMPORTANT: Activate `inertia-react-development` when working with Inertia client-side patterns.

# Inertia v3

- Use all Inertia features from v1, v2, and v3. Check the documentation before making changes to ensure the correct approach.
- New v3 features: standalone HTTP requests (`useHttp` hook), optimistic updates with automatic rollback, layout props (`useLayoutProps` hook), instant visits, simplified SSR via `@inertiajs/vite` plugin, custom exception handling for error pages.
- Carried over from v2: deferred props, infinite scroll, merging props, polling, prefetching, once props, flash data.
- When using deferred props, add an empty state with a pulsing or animated skeleton.
- Axios has been removed. Use the built-in XHR client with interceptors, or install Axios separately if needed.
- `Inertia::lazy()` / `LazyProp` has been removed. Use `Inertia::optional()` instead.
- Prop types (`Inertia::optional()`, `Inertia::defer()`, `Inertia::merge()`) work inside nested arrays with dot-notation paths.
- SSR works automatically in Vite dev mode with `@inertiajs/vite` - no separate Node.js server needed during development.
- Event renames: `invalid` is now `httpException`, `exception` is now `networkError`.
- `router.cancel()` replaced by `router.cancelAll()`.
- The `future` configuration namespace has been removed - all v2 future options are now always enabled.

=== laravel/core rules ===

# Do Things the Laravel Way

- Use `php artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using `php artisan list` and check their parameters with `php artisan [command] --help`.
- If you're creating a generic PHP class, use `php artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

### Model Creation

- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `php artisan make:model --help` to check the available options.

## APIs & Eloquent Resources

- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.

## URL Generation

- When generating links to other pages, prefer named routes and the `route()` function.

## Testing

- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.
- When creating tests, make use of `php artisan make:test [options] {name}` to create a feature test, and pass `--unit` to create a unit test. Most tests should be feature tests.

## Vite Error

- If you receive an "Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest" error, you can run `npm run build` or ask the user to run `npm run dev` or `composer run dev`.

=== wayfinder/core rules ===

# Laravel Wayfinder

Use Wayfinder to generate TypeScript functions for Laravel routes. Import from `@/actions/` (controllers) or `@/routes/` (named routes).

=== pint/core rules ===

# Laravel Pint Code Formatter

- If you have modified any PHP files, you must run `vendor/bin/pint --dirty --format agent` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/pint --test --format agent`, simply run `vendor/bin/pint --format agent` to fix any formatting issues.

=== pest/core rules ===

## Pest

- This project uses Pest for testing. Create tests: `php artisan make:test --pest {name}`.
- The `{name}` argument should not include the test suite directory. Use `php artisan make:test --pest SomeFeatureTest` instead of `php artisan make:test --pest Feature/SomeFeatureTest`.
- Run tests: `php artisan test --compact` or filter: `php artisan test --compact --filter=testName`.
- Do NOT delete tests without approval.

=== inertia-react/core rules ===

# Inertia + React

- IMPORTANT: Activate `inertia-react-development` when working with Inertia React client-side patterns.

</laravel-boost-guidelines>
