<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JadwalResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ekstrakurikuler' => new EkstrakurikulerResource($this->whenLoaded('ekstrakurikuler')),
            'hari' => $this->hari,
            'jam_mulai' => $this->jam_mulai,
            'jam_selesai' => $this->jam_selesai,
            'tempat' => $this->tempat,
            'keterangan' => $this->keterangan,
        ];
    }
}
