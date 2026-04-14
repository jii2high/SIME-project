<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('user');

        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', Rule::unique('users')->ignore($userId)],
            'password' => ['nullable', 'string', 'min:8'],
            'nisn' => ['nullable', 'string', 'max:20', Rule::unique('users')->ignore($userId)],
            'kelas' => ['nullable', 'string', 'max:50'],
            'no_hp' => ['nullable', 'string', 'max:20'],
            'role' => ['sometimes', 'string', 'exists:roles,name'],
        ];
    }
}
