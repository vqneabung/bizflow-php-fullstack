<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReportTemplateRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'circular_ref' => ['required', 'string', 'max:255'],
            'version' => ['required', 'string', 'max:20'],
            'fields' => ['required', 'array', 'min:1'],
            'fields.*.key' => ['required', 'string', 'max:100'],
            'fields.*.label' => ['required', 'string', 'max:255'],
            'fields.*.type' => ['required', 'string', 'in:text,number,date,boolean'],
            'fields.*.width' => ['nullable', 'integer', 'min:0'],
            'fields.*.alignment' => ['nullable', 'string', 'in:left,center,right'],
            'is_active' => ['boolean'],
            'last_updated_by' => ['nullable', 'string', 'max:255'],
        ];
    }
}
