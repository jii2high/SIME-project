<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEkstrakurikulerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama' => ['sometimes', 'string', 'max:255', Rule::unique('ekstrakurikuler')->ignore($this->route('ekstrakurikuler'))],
            'deskripsi' => ['nullable', 'string'],
            'ketua_id' => ['nullable', 'exists:users,id'],
            'hari_kegiatan' => ['nullable', 'string', 'max:50'],
            'jam_mulai' => ['nullable', 'string', 'max:10'],
            'jam_selesai' => ['nullable', 'string', 'max:10'],
            'tempat' => ['nullable', 'string', 'max:255'],
            'kuota' => ['nullable', 'integer', 'min:1'],
            'status' => ['nullable', Rule::in(['aktif', 'nonaktif'])],
        ];
    }
}
