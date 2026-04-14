<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'nisn' => ['nullable', 'string', 'max:20', 'unique:users'],
            'kelas' => ['nullable', 'string', 'max:50'],
            'no_hp' => ['nullable', 'string', 'max:20'],
        ];
    }
}
