<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Partial update — tất cả field optional.
 * Spring Boot UpdateProductRequest chấp nhận null, controller filter null trước khi gửi.
 */
class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'name' => ['nullable', 'string', 'max:255'],
            'category_id' => ['nullable', 'string', 'uuid'],
            'primary_unit_id' => ['nullable', 'string', 'uuid'],
            'price' => ['nullable', 'numeric', 'min:1'],
            'cost_price' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['nullable', 'numeric', 'min:0'],
            'min_stock' => ['nullable', 'numeric', 'min:0'],
            'image_url' => ['nullable', 'string', 'max:500'],
            'image_keys' => ['nullable', 'array'],
            'image_keys.*' => ['string'],
            'barcode' => ['nullable', 'string', 'max:100'],
        ];
    }
}
