<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PendaftaranResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => new UserResource($this->whenLoaded('user')),
            'ekstrakurikuler' => new EkstrakurikulerResource($this->whenLoaded('ekstrakurikuler')),
            'motivasi' => $this->motivasi,
            'status' => $this->status,
            'catatan_reviewer' => $this->catatan_reviewer,
            'reviewer' => new UserResource($this->whenLoaded('reviewer')),
            'reviewed_at' => $this->reviewed_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
