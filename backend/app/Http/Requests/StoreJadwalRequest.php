<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreJadwalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ekstrakurikuler_id' => ['required', 'exists:ekstrakurikuler,id'],
            'hari' => ['required', 'string', 'max:20'],
            'jam_mulai' => ['required', 'string', 'max:10'],
            'jam_selesai' => ['required', 'string', 'max:10'],
            'tempat' => ['required', 'string', 'max:255'],
            'keterangan' => ['nullable', 'string', 'max:500'],
        ];
    }
}
