<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLaporanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ekstrakurikuler_id' => ['required', 'exists:ekstrakurikuler,id'],
            'judul' => ['required', 'string', 'max:255'],
            'isi_laporan' => ['required', 'string'],
            'tanggal_kegiatan' => ['required', 'date'],
        ];
    }
}
