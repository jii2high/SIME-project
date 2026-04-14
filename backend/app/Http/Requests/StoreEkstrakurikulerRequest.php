<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEkstrakurikulerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama' => ['required', 'string', 'max:255', 'unique:ekstrakurikuler'],
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
