<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePendaftaranRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ekstrakurikuler_id' => ['required', 'exists:ekstrakurikuler,id'],
            'motivasi' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
