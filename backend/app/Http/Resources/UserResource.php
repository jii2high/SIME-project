<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'nisn' => $this->nisn,
            'kelas' => $this->kelas,
            'no_hp' => $this->no_hp,
            'roles' => $this->roles->pluck('name'),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
